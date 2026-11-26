interface CloudClusterProps {
  className?: string;
  strokeColor?: string;
}

/**
 * 4-cloud line-art Nusantara mega mendung cluster matching the RAKATA brand guide.
 */
export function NusantaraCloudsSvg({
  className = 'w-44 h-36',
  strokeColor = '#E3BD32',
}: CloudClusterProps) {
  return (
    <svg
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top small cloud */}
      <g
        stroke={strokeColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M104 42 C104 34 114 31 120 36 C125 24 142 22 148 33 C156 30 167 34 176 41 C166 44 159 49 149 52 C140 55 130 51 123 47 C115 50 104 48 104 42 Z" />
        <path d="M132 39 C134 36 139 36 140 40 C140 43 137 45 134 44" />
        <path d="M114 42 C116 40 119 41 119 43" />

        {/* Upper-middle wide cloud */}
        <path d="M76 80 C76 70 90 66 98 72 C106 56 128 54 137 68 C149 64 164 70 175 79 C161 83 151 90 138 94 C126 98 113 92 103 87 C92 91 76 89 76 80 Z" />
        <path d="M115 76 C118 72 124 72 126 77 C127 81 122 84 118 82" />
        <path d="M90 80 C93 77 97 78 97 81" />

        {/* Lower-left medium cloud */}
        <path d="M22 110 C22 101 34 98 41 103 C48 89 67 87 75 99 C85 96 98 101 108 109 C96 113 87 119 76 122 C65 125 54 120 45 116 C36 119 22 118 22 110 Z" />
        <path d="M56 106 C59 102 64 103 65 107 C66 111 62 113 58 111" />
        <path d="M34 110 C37 107 40 108 40 111" />

        {/* Bottom-right large cloud */}
        <path d="M68 144 C68 134 82 130 90 136 C98 120 120 118 129 132 C141 128 156 134 167 143 C153 147 143 154 130 158 C118 162 105 156 95 151 C84 155 68 153 68 144 Z" />
        <path d="M107 140 C110 136 116 136 118 141 C119 145 114 148 110 146" />
        <path d="M82 144 C85 141 89 142 89 145" />
      </g>
    </svg>
  );
}

/**
 * Rolling golden organic wave accent matching the RAKATA brand guide shapes.
 */
export function GoldenWaveDivider({
  className = 'w-full h-10 sm:h-14',
  bottomColor = '#FFFFFF',
}: {
  className?: string;
  bottomColor?: string;
}) {
  return (
    <div className="relative w-full overflow-hidden leading-none" aria-hidden="true">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Golden rolling double-crest wave */}
        <path
          d="M0 32 C220 4 420 56 640 36 C860 16 1040 62 1260 28 C1340 16 1400 22 1440 34 L1440 120 L0 120 Z"
          fill="#E3BD32"
        />
        {/* Smooth lower cream wave */}
        <path
          d="M0 68 C260 92 520 48 780 74 C1040 100 1260 54 1440 78 L1440 120 L0 120 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}

/**
 * Architectural corner-anchored label frame inspired by the RAKATA brand guide.
 */
export function FramedLabel({
  children,
  variant = 'gold',
}: {
  children: React.ReactNode;
  variant?: 'gold' | 'maroon';
}) {
  const borderClass =
    variant === 'gold'
      ? 'border-[#E3BD32]/80 text-[#E3BD32]'
      : 'border-[#8A1C05]/80 text-[#8A1C05]';
  const dotClass = variant === 'gold' ? 'bg-[#E3BD32]' : 'bg-[#8A1C05]';

  return (
    <span
      className={`relative inline-flex items-center px-3.5 py-1 border text-xs font-bold tracking-[0.18em] uppercase ${borderClass}`}
    >
      <span
        className={`absolute -top-[3px] -left-[3px] w-1.5 h-1.5 ${dotClass}`}
        aria-hidden="true"
      />
      <span
        className={`absolute -top-[3px] -right-[3px] w-1.5 h-1.5 ${dotClass}`}
        aria-hidden="true"
      />
      <span
        className={`absolute -bottom-[3px] -left-[3px] w-1.5 h-1.5 ${dotClass}`}
        aria-hidden="true"
      />
      <span
        className={`absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 ${dotClass}`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
