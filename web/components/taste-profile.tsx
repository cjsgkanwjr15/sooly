/**
 * 맛 프로필 레이더 차트 (hexagon).
 * 6개 축: 단맛·산미·쓴맛·감칠맛·향·목넘김 (0~5)
 * 데이터 없으면 empty state.
 */

export type TasteProfile = {
  단맛?: number;
  산미?: number;
  쓴맛?: number;
  감칠맛?: number;
  향?: number;
  목넘김?: number;
};

type Props = {
  profile?: TasteProfile | null;
  className?: string;
};

const AXES: Array<keyof TasteProfile> = [
  "단맛", "산미", "쓴맛", "감칠맛", "향", "목넘김",
];

export function TasteRadar({ profile, className = "" }: Props) {
  const hasData =
    profile && AXES.some((k) => typeof profile[k] === "number" && profile[k]! > 0);

  // SVG 좌표계 중심
  const cx = 100;
  const cy = 100;
  const maxR = 80;

  // 축별 각도 (12시 방향이 0°, 시계방향)
  function pointAt(axisIndex: number, value: number) {
    const angle = (Math.PI * 2 * axisIndex) / AXES.length - Math.PI / 2;
    const r = (value / 5) * maxR;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  }

  const gridLevels = [1, 2, 3, 4, 5];

  const dataPoints = hasData
    ? AXES.map((axis, i) => pointAt(i, profile![axis] ?? 0))
    : [];
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-auto">
        {/* 그리드 (hexagon 5단) */}
        {gridLevels.map((lv) => {
          const pts = AXES.map((_, i) => pointAt(i, lv));
          return (
            <polygon
              key={lv}
              points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeOpacity={lv === 5 ? 0.25 : 0.08}
              strokeWidth={lv === 5 ? 1 : 0.75}
              className="text-foreground"
            />
          );
        })}
        {/* 축 라인 */}
        {AXES.map((_, i) => {
          const end = pointAt(i, 5);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={0.75}
              className="text-foreground"
            />
          );
        })}
        {/* 데이터 폴리곤 */}
        {hasData && (
          <polygon
            points={polygon}
            className="fill-primary/20 stroke-primary"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        )}
        {/* 축 라벨 */}
        {AXES.map((axis, i) => {
          const labelPoint = pointAt(i, 6.2);
          return (
            <text
              key={axis}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted-foreground font-sans text-[10px]"
            >
              {axis}
            </text>
          );
        })}
      </svg>

      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">
            <span className="block font-serif text-lg text-foreground/70">?</span>
            <span className="mt-1 block">맛 프로필은 체크인 누적 후 표시됩니다</span>
          </p>
        </div>
      )}
    </div>
  );
}
