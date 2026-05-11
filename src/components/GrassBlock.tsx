type Props = {
  size?: number;
  className?: string;
};

export default function GrassBlock({ size = 96, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="topGrass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fd154" />
          <stop offset="100%" stopColor="#3e8a2c" />
        </linearGradient>
        <linearGradient id="sideGrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5fb33d" />
          <stop offset="100%" stopColor="#2f6a1d" />
        </linearGradient>
        <linearGradient id="dirtSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a35" />
          <stop offset="100%" stopColor="#5a3a1f" />
        </linearGradient>
        <linearGradient id="dirtFront" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a06b3f" />
          <stop offset="100%" stopColor="#6a4424" />
        </linearGradient>
      </defs>

      {/* Top face */}
      <polygon
        points="60,8 110,32 60,56 10,32"
        fill="url(#topGrass)"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
      />
      {/* Left face (dirt + grass strip) */}
      <polygon
        points="10,32 60,56 60,112 10,88"
        fill="url(#dirtFront)"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
      />
      <polygon
        points="10,32 60,56 60,64 10,40"
        fill="url(#sideGrass)"
      />
      {/* Right face (dirt + grass strip) */}
      <polygon
        points="60,56 110,32 110,88 60,112"
        fill="url(#dirtSide)"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
      />
      <polygon
        points="60,56 110,32 110,40 60,64"
        fill="url(#sideGrass)"
        opacity="0.85"
      />

      {/* Grass top speckles */}
      <g opacity="0.45">
        <rect x="40" y="22" width="6" height="3" fill="#9be36b" transform="rotate(20 43 23)" />
        <rect x="64" y="18" width="6" height="3" fill="#9be36b" transform="rotate(20 67 19)" />
        <rect x="78" y="28" width="6" height="3" fill="#9be36b" transform="rotate(20 81 29)" />
        <rect x="52" y="34" width="6" height="3" fill="#9be36b" transform="rotate(20 55 35)" />
      </g>

      {/* Dirt specks */}
      <g opacity="0.5">
        <rect x="18" y="52" width="6" height="4" fill="#6e4322" />
        <rect x="34" y="74" width="5" height="4" fill="#4f2d14" />
        <rect x="74" y="64" width="5" height="4" fill="#4f2d14" />
        <rect x="86" y="82" width="6" height="4" fill="#6e4322" />
      </g>
    </svg>
  );
}
