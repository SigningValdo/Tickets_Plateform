interface CameroonFlagProps {
  width?: number;
  height?: number;
  className?: string;
}

export function CameroonFlag({
  width = 32,
  height = 20,
  className,
}: CameroonFlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 200"
      width={width}
      height={height}
      className={className}
      aria-label="Drapeau du Cameroun"
    >
      {/* Bande verte */}
      <rect x="0" y="0" width="100" height="200" fill="#007a5e" />
      {/* Bande rouge */}
      <rect x="100" y="0" width="100" height="200" fill="#ce1126" />
      {/* Bande jaune */}
      <rect x="200" y="0" width="100" height="200" fill="#fcd116" />
      {/* Étoile jaune au centre */}
      <polygon
        points="150,55 162,90 200,90 170,112 180,148 150,127 120,148 130,112 100,90 138,90"
        fill="#fcd116"
      />
    </svg>
  );
}
