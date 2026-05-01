import { FilePlus, Send, Trophy, CheckCircle2, XCircle } from "lucide-react";
import { formatDate, relativeFromNow } from "@/lib/utils";

export type JobEventType = "created" | "quoted" | "won" | "completed" | "lost";

const META: Record<JobEventType, { icon: React.ElementType; colorClass: string }> = {
  created:   { icon: FilePlus,      colorClass: "text-muted-foreground" },
  quoted:    { icon: Send,          colorClass: "text-warning" },
  won:       { icon: Trophy,        colorClass: "text-success" },
  completed: { icon: CheckCircle2,  colorClass: "text-success" },
  lost:      { icon: XCircle,       colorClass: "text-destructive" },
};

export function TimelineEvent({
  type,
  jobTitle,
  date,
  label,
}: {
  type: JobEventType;
  jobTitle: string;
  date: Date;
  label: string;
}) {
  const { icon: Icon, colorClass } = META[type];

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card p-4">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${colorClass}`} />
      <div className="flex-1 space-y-0.5">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{jobTitle}</div>
        <div className="text-xs text-muted-foreground">
          {formatDate(date)} · {relativeFromNow(date)}
        </div>
      </div>
    </div>
  );
}
