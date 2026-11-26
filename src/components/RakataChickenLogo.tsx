interface RakataChickenLogoProps {
  className?: string;
}

export function RakataChickenLogo({
  className = 'w-11 h-8',
}: RakataChickenLogoProps) {
  return (
    <span className="inline-flex items-center justify-center rounded-lg bg-[#FFF8EA] px-1.5 py-0.5 shadow-xs shrink-0">
      <svg
        viewBox="0 0 180 120"
        className={className}
        role="img"
        aria-label="Logo Ayam RAKATA"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Golden sun disc behind rooster neck */}
        <circle cx="80" cy="48" r="24" fill="#F4C343" />

        {/* Cream halo around rooster neck & cloud edge over sun */}
        <path
          d="M54 56 C52 44 64 38 76 46 C86 38 96 28 105 22 L126 70 L54 70 Z"
          fill="#FFF8EA"
        />

        {/* Golden left swirling cloud tail */}
        <path
          d="M6 88 C22 86 30 74 44 74 C56 74 60 88 54 98 C46 106 24 102 6 88 Z"
          fill="#F4C343"
        />
        {/* Cream swirl cutout inside golden cloud */}
        <path
          d="M27 89 C32 84 41 84 43 90 C44 95 38 97 34 94"
          fill="none"
          stroke="#FFF8EA"
          strokeWidth="3.4"
          strokeLinecap="round"
        />

        {/* Rooster comb (3 lobes) */}
        <path
          d="M104 22 C96 15 103 6 111 12 C112 3 123 3 123 12 C129 7 136 13 130 21 C122 19 112 20 104 22 Z"
          fill="#781B19"
        />

        {/* Rooster head, beak & sweeping body into mega mendung cloud waves */}
        <path
          d="M105 24
             C114 20 125 22 130 28
             L143 33
             L132 37
             C131 44 128 53 126 64
             C136 69 148 72 155 83
             C159 89 162 91 166 90
             C161 98 148 100 137 94
             C128 107 104 114 78 112
             C64 111 54 108 46 107
             C56 103 61 98 60 91
             C52 88 46 80 46 70
             C46 56 59 48 71 54
             C78 57 82 64 81 71
             C86 64 93 52 98 40
             C101 33 103 28 105 24 Z"
          fill="#781B19"
        />

        {/* Rooster wattle below beak */}
        <path
          d="M132 40 C137 42 138 51 132 53 C128 53 127 46 132 40 Z"
          fill="#781B19"
        />

        {/* Cream negative-space Nusantara cloud curl lines */}
        <path
          d="M61 68 C58 63 64 59 69 63 C74 68 70 78 60 79"
          fill="none"
          stroke="#FFF8EA"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M78 79 C91 74 101 66 106 59 C112 67 120 71 127 72"
          fill="none"
          stroke="#FFF8EA"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M84 89 C94 84 106 83 111 90 C114 94 110 99 103 97"
          fill="none"
          stroke="#FFF8EA"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M116 98 C122 86 134 80 144 84 C150 87 149 94 143 95"
          fill="none"
          stroke="#FFF8EA"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
