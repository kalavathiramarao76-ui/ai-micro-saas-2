interface ToolIconProps {
  path: string;
  className?: string;
}

export default function ToolIcon({ path, className = "h-6 w-6" }: ToolIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}
