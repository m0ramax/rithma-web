interface RithmaLogoProps {
  size?: number;
  color?: string;
}

export function RithmaLogo({ size = 32, color = "#E8A020" }: RithmaLogoProps) {
  const bars = [
    { height: 0.4, delay: "0s" },
    { height: 0.75, delay: "0.15s" },
    { height: 1, delay: "0.05s" },
    { height: 0.6, delay: "0.2s" },
    { height: 0.85, delay: "0.1s" },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Rithma logo"
    >
      {bars.map((bar, i) => {
        const barWidth = 3.6;
        const gap = 1.8;
        const totalWidth = bars.length * barWidth + (bars.length - 1) * gap;
        const startX = (32 - totalWidth) / 2;
        const x = startX + i * (barWidth + gap);
        const maxHeight = 20;
        const barHeight = bar.height * maxHeight;
        const y = 16 - barHeight / 2;

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={barWidth / 2}
            fill={color}
          />
        );
      })}
    </svg>
  );
}
