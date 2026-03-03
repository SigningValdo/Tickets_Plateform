interface FecafootBadgeProps {
  size?: number;
  className?: string;
}

export function FecafootBadge({ size = 40, className }: FecafootBadgeProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-label="FECAFOOT"
    >
      {/* Shield background */}
      <path
        d="M100,10 L180,50 L180,120 C180,160 140,190 100,195 C60,190 20,160 20,120 L20,50 Z"
        fill="#007a5e"
        stroke="#fcd116"
        strokeWidth="4"
      />
      {/* Inner shield */}
      <path
        d="M100,25 L165,58 L165,118 C165,152 132,178 100,183 C68,178 35,152 35,118 L35,58 Z"
        fill="#ce1126"
      />
      {/* Yellow star */}
      <polygon
        points="100,50 110,78 140,78 116,95 124,122 100,106 76,122 84,95 60,78 90,78"
        fill="#fcd116"
      />
      {/* FECAFOOT text */}
      <text
        x="100"
        y="155"
        textAnchor="middle"
        fill="#fcd116"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="16"
      >
        FECAFOOT
      </text>
    </svg>
  );
}
