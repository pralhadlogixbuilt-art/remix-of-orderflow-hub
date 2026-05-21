import { Link } from "@tanstack/react-router";
import { useProduction, type Stage, stageLabel } from "@/lib/production-store";
import { StatusChip } from "@/components/production/StatusChip";
import { StageForm } from "@/routes/production.orders.$orderId";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronRight, Inbox } from "lucide-react";
import { toast } from "sonner";

export function OperationScreen({
  stage,
  title,
  description,
  icon: Icon,
}: {
  stage: Stage;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const orders = useProduction((s) => s.orders.filter((o) => o.stage === stage));
  const advance = useProduction((s) => s.advance);
  const [openId, setOpenId] = useState<string | null>(null);
  const openOrder = useProduction((s) => (openId ? s.orders.find((o) => o.id === openId) : null));

  return (
    <div className="p-6">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tabular-nums">{orders.length}</div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">pending</div>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Every entry below is order-linked. Bulk-process here, or open the full order workflow.
      </div>

      <div className="overflow-hidden rounded-lg border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Order ID</th>
              <th className="px-4 py-3 text-left font-medium">Client</th>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">RM</th>
              <th className="px-4 py-3 text-right font-medium">Qty</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-mono text-xs font-semibold">
                  <Link to="/production/orders/$orderId" params={{ orderId: o.id }} className="text-primary hover:underline">{o.id}</Link>
                </td>
                <td className="px-4 py-3">{o.client}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.product}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.rm}</td>
                <td className="px-4 py-3 text-right tabular-nums">{o.qty} {o.unit}</td>
                <td className="px-4 py-3"><StatusChip stage={o.stage} /></td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => setOpenId(o.id)}>
                    Process <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-16 text-center">
                <Inbox className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">No orders pending {title.toLowerCase()}.</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-2xl">
          {openOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono">{openOrder.id}</span>
                  <StatusChip stage={openOrder.stage} />
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {openOrder.client} · {openOrder.product} · {openOrder.qty} {openOrder.unit}
                </p>
              </DialogHeader>
              <div className="mt-2">
                <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {stageLabel(openOrder.stage)}
                </div>
                <StageForm
                  orderId={openOrder.id}
                  stage={openOrder.stage}
                  onDone={(payload, note) => {
                    advance(openOrder.id, openOrder.stage, payload, "You", note);
                    toast.success(`${stageLabel(openOrder.stage)} done for ${openOrder.id}`);
                    setOpenId(null);
                  }}
                />
              </div>
              <div className="mt-4 border-t pt-3 text-xs">
                <Link to="/production/orders/$orderId" params={{ orderId: openOrder.id }} className="text-primary hover:underline">
                  Open full order workflow →
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
