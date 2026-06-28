import { SparkleIcon } from "@/components/icons";

interface AiBadgeProps {
  className?: string;
}

export default function AiBadge({ className = "" }: AiBadgeProps) {
  return (
    <span
      title="Diese Zusammenfassung wurde mit künstlicher Intelligenz erstellt."
      className={`inline-flex items-center gap-1 rounded-md border border-line bg-[#fafbfc] px-2 py-0.5 text-[0.7rem] font-semibold text-muted dark:bg-[#181230] ${className}`}
    >
      <SparkleIcon className="h-3 w-3 text-accent" />
      KI-zusammengefasst
    </span>
  );
}
