import { createFileRoute, Link } from "@tanstack/react-router";
import { useProduction, STAGES } from "@/lib/production-store";
import { StatusChip } from "@/components/production/StatusChip";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Search, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/production/orders/")({
  head: () => ({ meta: [{ title: "Production Orders — Ontoz ERP" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const orders = useProduction((s) => s.orders);
  const [q, setQ] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchQ = (o.id + o.client + o.product).toLowerCase().includes(q.toLowerCase());
      const matchS = stageFilter === "all" || o.stage === stageFilter;
      return matchQ && matchS;
    });
  }, [orders, q, stageFilter]);

  return (
    <div className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Production Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track each order through the full manufacturing waterfall. Click an order to open its workflow.
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div className="text-lg font-semibold text-foreground">{orders.length}</div>
          active orders
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by order, client, product…"
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 rounded-md border bg-background p-1">
          <button
            onClick={() => setStageFilter("all")}
            className={`rounded px-2.5 py-1 text-xs font-medium ${stageFilter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            All
          </button>
          {STAGES.map((s) => (
            <button
              key={s.key}
              onClick={() => setStageFilter(s.key)}
              className={`rounded px-2.5 py-1 text-xs font-medium ${stageFilter === s.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              {s.short}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Order ID</th>
              <th className="px-4 py-3 text-left font-medium">Client</th>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-right font-medium">Qty</th>
              <th className="px-4 py-3 text-left font-medium">Current Stage</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((o) => (
              <tr key={o.id} className="group transition-colors hover:bg-muted/40">
                <td className="px-4 py-3 font-mono text-xs font-semibold">
                  <Link to="/production/orders/$orderId" params={{ orderId: o.id }} className="text-primary hover:underline">
                    {o.id}
                  </Link>
                </td>
                <td className="px-4 py-3">{o.client}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.product}</td>
                <td className="px-4 py-3 text-right tabular-nums">{o.qty} {o.unit}</td>
                <td className="px-4 py-3"><StatusChip stage={o.stage} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{o.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/production/orders/$orderId"
                    params={{ orderId: o.id }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Open <ChevronRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No orders match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
