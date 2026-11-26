interface RakataChickenLogoProps {
  className?: string;
}

export function RakataChickenLogo({
  className = 'w-12 h-[30px]',
}: RakataChickenLogoProps) {
  return (
    <span className="inline-flex items-center justify-center rounded-lg bg-[#FFFFFF] p-0.5 shadow-xs shrink-0 overflow-hidden">
      <img
        src="/assets/aistudio/WhatsApp_Image_2026-11-13_at_11.48.55__1__9e3c587a.jpeg"
        alt="Logo Ayam RAKATA"
        referrerPolicy="no-referrer"
        className={`${className} object-cover object-top rounded-md`}
      />
    </span>
  );
}
