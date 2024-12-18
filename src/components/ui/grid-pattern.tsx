import { useId } from "react";
import { cn } from "../../lib/utils";

export default function GridPattern({
  width = 100,
  height = 100,
  x = -1,
  y = -1,
  squares = [[0, 0]],
  className,
  ...props
}: {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[number, number]>;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  const pattern = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      {...props}
    >
      <defs>
        <pattern
          id={pattern}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d="M.5 100V.5H100"
            fill="none"
            stroke="rgba(45,148,116,0.1)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${pattern})`} />
      {squares && squares.map(([x, y], index) => (
        <rect
          key={index}
          width={20}
          height={20}
          x={x * width + 4}
          y={y * height + 4}
          className="fill-primary/5"
          stroke="rgba(45,148,116,0.2)"
        />
      ))}
    </svg>
  );
}