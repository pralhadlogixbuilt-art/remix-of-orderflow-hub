import { cn } from "@/lib/utils";
import type { Stage } from "@/lib/production-store";

const styles: Record<Stage | "default", string> = {
  confirmed: "bg-slate-100 text-slate-700 border-slate-200",
  rm_request: "bg-amber-50 text-amber-800 border-amber-200",
  rm_receipt: "bg-blue-50 text-blue-800 border-blue-200",
  tds_qc: "bg-violet-50 text-violet-800 border-violet-200",
  cutting: "bg-orange-50 text-orange-800 border-orange-200",
  ready: "bg-emerald-50 text-emerald-800 border-emerald-200",
  default: "bg-muted text-muted-foreground border-border",
};

const labels: Record<Stage, string> = {
  confirmed: "Confirmed",
  rm_request: "RM Request",
  rm_receipt: "RM Receipt",
  tds_qc: "TDS & QC",
  cutting: "Cutting",
  ready: "Ready",
};

export function StatusChip({ stage, className }: { stage: Stage; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[stage] ?? styles.default,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {labels[stage]}
    </span>
  );
}
