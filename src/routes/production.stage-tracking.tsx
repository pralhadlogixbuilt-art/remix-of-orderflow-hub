import { createFileRoute, Link } from "@tanstack/react-router";
import { useProduction, STAGES, stageIndex } from "@/lib/production-store";
import { StatusChip } from "@/components/production/StatusChip";

export const Route = createFileRoute("/production/stage-tracking")({
  head: () => ({ meta: [{ title: "Stage Tracking — Ontoz ERP" }] }),
  component: StageTracking,
});

function StageTracking() {
  const orders = useProduction((s) => s.orders);

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Stage Tracking</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pipeline view of every production order across the waterfall. Drag your eye across the columns to spot bottlenecks.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((s) => {
          const count = orders.filter((o) => o.stage === s.key).length;
          return (
            <div key={s.key} className="rounded-lg border bg-background p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.short}</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{count}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {STAGES.map((s) => {
          const stageOrders = orders.filter((o) => o.stage === s.key);
          return (
            <div key={s.key} className="flex flex-col rounded-lg border bg-muted/30 p-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">{s.label}</div>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium tabular-nums">{stageOrders.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {stageOrders.map((o) => (
                  <Link
                    key={o.id}
                    to="/production/orders/$orderId"
                    params={{ orderId: o.id }}
                    className="group rounded-md border bg-background p-3 transition-colors hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-primary">{o.id}</span>
                      <StatusChip stage={o.stage} />
                    </div>
                    <div className="mt-1 truncate text-sm font-medium">{o.client}</div>
                    <div className="truncate text-xs text-muted-foreground">{o.product} · {o.qty} {o.unit}</div>
                    <div className="mt-2 flex items-center gap-1">
                      {STAGES.map((st, i) => (
                        <div
                          key={st.key}
                          className={`h-1 flex-1 rounded-full ${i <= stageIndex(o.stage) ? "bg-primary" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  </Link>
                ))}
                {stageOrders.length === 0 && (
                  <div className="rounded-md border border-dashed bg-background/50 p-4 text-center text-xs text-muted-foreground">
                    No orders at this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
