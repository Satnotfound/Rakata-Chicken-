# RAKATA Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Unauthenticated Default Deny**: No unauthenticated request may read, list, create, update, or delete any user profile, owner setting, admin marker, or financial ledger document.
2. **Email Verification Mandate**: Every authenticated read/write operation requires `request.auth.token.email_verified == true`.
3. **Identity & Ownership Binding**:
   - Every `/users/{userId}` document must have `uid == request.auth.uid == userId` on create, and `uid` is immutable thereafter.
   - Every `/financeEntries/{entryId}` document must have `id == entryId` and `ownerUid == request.auth.uid` on create, and `id`, `ownerUid`, and `createdAt` are immutable on update.
4. **No Self-Escalation**: `/users/{userId}` forbids extra keys (such as `role` or `isAdmin`). Only the bootstrapped admin (`razanputra0111@gmail.com` with `email_verified == true`) can create/modify `/admins/{userId}`.
5. **Server Timestamps Only**: `createdAt` and `updatedAt` must equal `request.time` on creation, and `updatedAt` must equal `request.time` on update.
6. **Strict Schema & Bounds**: All string fields enforce `.size()` bounds, numeric amounts must be `> 0` and `<= 1000000000`, enums (`type`, `paymentMethod`, `source`) are strictly allowlisted, and document IDs match `^[a-zA-Z0-9_-]+$` (`<= 128` chars).
7. **Zero Query Trust**: `allow list` on `/financeEntries/{entryId}` explicitly enforces `isBootstrappedAdmin() || resource.data.ownerUid == request.auth.uid` without any `get()` or `exists()` lookups.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Finance Read**: Anonymous user attempts `getDoc` or `getDocs` on `/financeEntries` -> `PERMISSION_DENIED`.
2. **Unverified Email Spoofing**: Authenticated user with `email: "razanputra0111@gmail.com"` and `email_verified: false` attempts read/write -> `PERMISSION_DENIED`.
3. **Shadow Field / Privilege Escalation**: Authenticated user attempts `setDoc` on `/users/{uid}` adding `isAdmin: true` -> `PERMISSION_DENIED` (`hasOnly` rejects extra key).
4. **Self-Admin Creation**: Non-admin user attempts `setDoc` on `/admins/{uid}` -> `PERMISSION_DENIED`.
5. **Cross-Tenant Finance Spoofing (Create)**: User A attempts `setDoc` on `/financeEntries/e1` with `ownerUid: "userB"` -> `PERMISSION_DENIED`.
6. **Cross-Tenant Finance Tampering (Update/Delete)**: User A attempts `updateDoc` or `deleteDoc` on `/financeEntries/eB` owned by User B -> `PERMISSION_DENIED`.
7. **Cross-Tenant Blanket List Query**: User A runs `getDocs(collection(db, "financeEntries"))` without `where("ownerUid", "==", userA.uid)` -> `PERMISSION_DENIED`.
8. **Client-Side Timestamp Forgery**: User creates a `FinanceEntry` with a backdated JS `Date` instead of `serverTimestamp()` -> `PERMISSION_DENIED` (`createdAt == request.time`).
9. **Immutable Field Mutation**: Owner updates `ownerUid`, `id`, or `createdAt` on an existing `FinanceEntry` -> `PERMISSION_DENIED`.
10. **Negative / Zero / Overflow Amount**: Owner submits `amount: -50000` or `amount: 0` or `amount: 999999999999` -> `PERMISSION_DENIED`.
11. **Path Variable / ID Poisoning**: User attempts write to `/financeEntries/` with invalid characters (`foo$bar`) or oversized 200-char ID -> `PERMISSION_DENIED`.
12. **Cross-User PII Leak**: User A attempts `getDoc` on `/users/userB` or `/users/userB/private/settings` -> `PERMISSION_DENIED`.

## 3. Reference Test Runner (`firestore.rules.test.ts`)

```ts
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where, serverTimestamp } from 'firebase/firestore';
import fs from 'node:fs';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'valiant-arcana-k01dl',
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

test('Dirty Dozen adversarial payloads are denied', async () => {
  const unauth = testEnv.unauthenticatedContext().firestore();
  const spoofAdmin = testEnv.authenticatedContext('spoof', { email: 'razanputra0111@gmail.com', email_verified: false }).firestore();
  const userA = testEnv.authenticatedContext('userA', { email: 'a@example.com', email_verified: true }).firestore();
  const userB = testEnv.authenticatedContext('userB', { email: 'b@example.com', email_verified: true }).firestore();

  // 1. Unauthenticated read
  await assertFails(getDoc(doc(unauth, 'financeEntries', 'e1')));
  // 2. Unverified admin email spoof
  await assertFails(getDocs(collection(spoofAdmin, 'financeEntries')));
  // 3. Shadow field privilege escalation on /users
  await assertFails(setDoc(doc(userA, 'users', 'userA'), {
    uid: 'userA', email: 'a@example.com', displayName: 'A', isAdmin: true,
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }));
  // 4. Self-admin creation
  await assertFails(setDoc(doc(userA, 'admins', 'userA'), {
    uid: 'userA', email: 'a@example.com', grantedBy: 'userA', createdAt: serverTimestamp(),
  }));
  // 5. Cross-tenant create spoofing
  await assertFails(setDoc(doc(userA, 'financeEntries', 'e1'), {
    id: 'e1', ownerUid: 'userB', date: '2026-11-26', type: 'income',
    category: 'Penjualan Langsung (Kasir)', paymentMethod: 'cash', amount: 15000,
    description: 'Spoofed', source: 'manual', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }));
  // Seed valid entry as userB
  await assertSucceeds(setDoc(doc(userB, 'financeEntries', 'eB'), {
    id: 'eB', ownerUid: 'userB', date: '2026-11-26', type: 'income',
    category: 'Penjualan Langsung (Kasir)', paymentMethod: 'cash', amount: 25000,
    description: 'Valid order', source: 'manual', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }));
  // 6. Cross-tenant update/delete
  await assertFails(updateDoc(doc(userA, 'financeEntries', 'eB'), { amount: 1, updatedAt: serverTimestamp() }));
  await assertFails(deleteDoc(doc(userA, 'financeEntries', 'eB')));
  // 7. Blanket list without ownerUid filter
  await assertFails(getDocs(collection(userA, 'financeEntries')));
  await assertSucceeds(getDocs(query(collection(userB, 'financeEntries'), where('ownerUid', '==', 'userB'))));
  // 8. Client timestamp forgery
  await assertFails(setDoc(doc(userA, 'financeEntries', 'eBadTime'), {
    id: 'eBadTime', ownerUid: 'userA', date: '2026-11-26', type: 'income',
    category: 'Penjualan Langsung (Kasir)', paymentMethod: 'cash', amount: 15000,
    description: 'Backdated', source: 'manual', createdAt: new Date(0), updatedAt: serverTimestamp(),
  }));
  // 9. Immutable field mutation & 10. Negative amount
  await assertFails(updateDoc(doc(userB, 'financeEntries', 'eB'), { ownerUid: 'userA', updatedAt: serverTimestamp() }));
  await assertFails(updateDoc(doc(userB, 'financeEntries', 'eB'), { amount: -100, updatedAt: serverTimestamp() }));
  // 11. Oversized ID poisoning
  await assertFails(setDoc(doc(userA, 'financeEntries', 'x'.repeat(129)), {
    id: 'x'.repeat(129), ownerUid: 'userA', date: '2026-11-26', type: 'income',
    category: 'Penjualan Langsung (Kasir)', paymentMethod: 'cash', amount: 15000,
    description: 'Too long', source: 'manual', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  }));
  // 12. Cross-user PII leak
  await assertFails(getDoc(doc(userA, 'users', 'userB')));
});
```
