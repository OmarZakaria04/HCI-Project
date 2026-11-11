import { useLanguage } from "../i18n/useLanguage";

/**
 * Circular Radar / Metrics Graph matching the wireframe's "Child Graph" & "Metrics Graph"
 */
export default function RadarChart({
  data,
  size = 220,
}) {
  const { tr } = useLanguage();
  const chartData = data ?? [
    { label: tr("Math", "Mathematik"), value: 90 },
    { label: tr("Science", "Naturwissenschaften"), value: 95 },
    { label: tr("Languages", "Sprachen"), value: 85 },
    { label: tr("History", "Geschichte"), value: 88 },
    { label: tr("Classwork", "Mitarbeit"), value: 92 },
  ];
  const center = size / 2;
  const radius = size * 0.38;
  const count = chartData.length;

  // Compute vertex coordinates
  const getCoordinates = (index, valuePercent) => {
    // start from top (-PI / 2)
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (valuePercent / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Concentric polygon web levels (25%, 50%, 75%, 100%)
  const levels = [25, 50, 75, 100];

  // Polygon points for data values
  const polygonPoints = chartData
    .map((item, i) => {
      const { x, y } = getCoordinates(i, item.value);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Concentric rings */}
        {levels.map((level) => {
          const points = Array.from({ length: count })
            .map((_, i) => {
              const { x, y } = getCoordinates(i, level);
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#C8B48A"
              strokeWidth="1"
              strokeDasharray={level === 100 ? "none" : "2 2"}
              opacity={level === 100 ? 0.8 : 0.4}
            />
          );
        })}

        {/* Spokes from center to edge */}
        {chartData.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#C8B48A"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}

        {/* Data area polygon */}
        <polygon
          points={polygonPoints}
          fill="#7F8C6A"
          fillOpacity="0.4"
          stroke="#1E3B2F"
          strokeWidth="2"
        />

        {/* Vertices & value labels */}
        {chartData.map((item, i) => {
          const point = getCoordinates(i, item.value);
          const labelPos = getCoordinates(i, 118);

          return (
            <g key={i}>
              {/* Vertex dot */}
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#1E3B2F"
                stroke="#C8B48A"
                strokeWidth="1.5"
              />
              {/* Label */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fontWeight="700"
                fill="#1E3B2F"
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

