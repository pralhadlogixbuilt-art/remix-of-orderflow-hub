import { Check } from "lucide-react";
import { STAGES, stageIndex, type Stage } from "@/lib/production-store";
import { cn } from "@/lib/utils";

export function WorkflowStepper({ current }: { current: Stage }) {
  const ci = stageIndex(current);
  return (
    <div className="w-full overflow-x-auto">
      <ol className="flex min-w-max items-center gap-0">
        {STAGES.map((s, i) => {
          const done = i < ci;
          const active = i === ci;
          return (
            <li key={s.key} className="flex items-center">
              <div className="flex flex-col items-center gap-2 px-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    done && "border-emerald-500 bg-emerald-500 text-white",
                    active && "border-primary bg-primary text-primary-foreground ring-4 ring-primary/15",
                    !done && !active && "border-border bg-background text-muted-foreground",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <div
                  className={cn(
                    "whitespace-nowrap text-xs font-medium",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.short}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-12 md:w-20 transition-colors",
                    i < ci ? "bg-emerald-500" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
