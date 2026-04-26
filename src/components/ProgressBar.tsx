interface ProgressBarProps {
  progress: number; // 0-100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60]">
      <div
        className="h-full progress-gradient transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
