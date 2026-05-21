import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useProduction, STAGES, stageIndex, stageLabel, type Stage } from "@/lib/production-store";
import { StatusChip } from "@/components/production/StatusChip";
import { WorkflowStepper } from "@/components/production/WorkflowStepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, CheckCircle2, Clock, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/production/orders/$orderId")({
  head: ({ params }) => ({ meta: [{ title: `${params.orderId} — Production Order` }] }),
  component: OrderDetail,
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <p className="text-sm text-muted-foreground">Order not found.</p>
      <Link to="/production/orders" className="mt-3 inline-block text-sm text-primary hover:underline">Back to orders</Link>
    </div>
  ),
});

function OrderDetail() {
  const { orderId } = Route.useParams();
  const order = useProduction((s) => s.orders.find((o) => o.id === orderId));
  if (!order) throw notFound();

  return (
    <div className="flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-14 z-20 border-b bg-background/95 backdrop-blur">
        <div className="px-6 py-4">
          <Link to="/production/orders" className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> All orders
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-mono text-xl font-semibold">{order.id}</h1>
                <StatusChip stage={order.stage} />
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span><span className="text-foreground font-medium">{order.client}</span></span>
                <span>·</span>
                <span>{order.product}</span>
                <span>·</span>
                <span>{order.qty} {order.unit}</span>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              Current stage<div className="mt-1 text-sm font-semibold text-foreground">{stageLabel(order.stage)}</div>
            </div>
          </div>
          <div className="mt-4">
            <WorkflowStepper current={order.stage} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ActiveStageCard order={order} />
          <StageTimeline order={order} />
        </div>
        <div className="space-y-6">
          <OrderMetaCard order={order} />
        </div>
      </div>
    </div>
  );
}

function OrderMetaCard({ order }: { order: ReturnType<typeof useProduction.getState>["orders"][number] }) {
  return (
    <div className="rounded-lg border bg-background p-5">
      <h3 className="text-sm font-semibold">Order details</h3>
      <dl className="mt-4 space-y-3 text-sm">
        <Row k="Client" v={order.client} />
        <Row k="Product" v={order.product} />
        <Row k="Quantity" v={`${order.qty} ${order.unit}`} />
        <Row k="Raw material" v={order.rm} />
        <Row k="RM required" v={`${order.rmQty} kg`} />
        <Row k="Spec micron" v={`${order.micron} µ`} />
        <Row k="Created" v={order.createdAt} />
      </dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

function StageTimeline({ order }: { order: ReturnType<typeof useProduction.getState>["orders"][number] }) {
  return (
    <div className="rounded-lg border bg-background p-5">
      <h3 className="text-sm font-semibold">Activity timeline</h3>
      <ol className="mt-4 space-y-3">
        {order.history.map((h, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div className="flex-1">
              <div className="font-medium">{stageLabel(h.stage)} completed</div>
              <div className="text-xs text-muted-foreground">{h.at} · {h.by}</div>
              {h.note && <div className="mt-0.5 text-xs text-muted-foreground">"{h.note}"</div>}
            </div>
          </li>
        ))}
        {order.stage !== "ready" && (
          <li className="flex gap-3 text-sm">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <div className="font-medium">{stageLabel(order.stage)} pending</div>
              <div className="text-xs text-muted-foreground">Awaiting action</div>
            </div>
          </li>
        )}
      </ol>
    </div>
  );
}

function ActiveStageCard({ order }: { order: ReturnType<typeof useProduction.getState>["orders"][number] }) {
  const advance = useProduction((s) => s.advance);
  if (order.stage === "ready") {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          <div>
            <h3 className="text-base font-semibold text-emerald-900">Production ready</h3>
            <p className="text-sm text-emerald-800/80">All workflow stages have been completed successfully.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Active stage</div>
          <h3 className="mt-0.5 text-base font-semibold">{stageLabel(order.stage)}</h3>
        </div>
        <StatusChip stage={order.stage} />
      </div>
      <StageForm orderId={order.id} stage={order.stage} onDone={(payload, note) => {
        advance(order.id, order.stage, payload, "You", note);
        toast.success(`${stageLabel(order.stage)} completed — order moved forward`);
      }} />
      <div className="mt-4 flex items-start gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
        <Lock className="mt-0.5 h-3.5 w-3.5" />
        Waterfall workflow — stages cannot be skipped. The next stage activates automatically.
      </div>
    </div>
  );
}

export function StageForm({
  orderId,
  stage,
  onDone,
}: {
  orderId: string;
  stage: Stage;
  onDone: (payload: any, note?: string) => void;
}) {
  if (stage === "confirmed") return <ConfirmedForm onDone={onDone} />;
  if (stage === "rm_request") return <RmRequestForm orderId={orderId} onDone={onDone} />;
  if (stage === "rm_receipt") return <RmReceiptForm orderId={orderId} onDone={onDone} />;
  if (stage === "tds_qc") return <TdsQcForm orderId={orderId} onDone={onDone} />;
  if (stage === "cutting") return <CuttingForm onDone={onDone} />;
  return null;
}

function ConfirmedForm({ onDone }: { onDone: (p: any, n?: string) => void }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Order has been confirmed. Trigger RM request to proceed.</p>
      <Button onClick={() => onDone({})}>Move to RM Request →</Button>
    </div>
  );
}

function RmRequestForm({ orderId, onDone }: { orderId: string; onDone: (p: any, n?: string) => void }) {
  const order = useProduction((s) => s.orders.find((o) => o.id === orderId))!;
  const [qty, setQty] = useState(order.rmQty);
  const [note, setNote] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onDone({ rmRequest: { qty, note, at: new Date().toISOString() } }, note); }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div>
        <Label>Raw material</Label>
        <Input value={order.rm} disabled className="mt-1" />
      </div>
      <div>
        <Label>Request quantity (kg)</Label>
        <Input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="mt-1" />
      </div>
      <div className="sm:col-span-2">
        <Label>Note to purchase</Label>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Urgency, vendor, etc." className="mt-1" />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit">Submit RM Request →</Button>
      </div>
    </form>
  );
}

function RmReceiptForm({ orderId, onDone }: { orderId: string; onDone: (p: any, n?: string) => void }) {
  const order = useProduction((s) => s.orders.find((o) => o.id === orderId))!;
  const [received, setReceived] = useState(order.rmRequest?.qty ?? order.rmQty);
  const [lot, setLot] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onDone({ rmReceipt: { receivedQty: received, lot, at: new Date().toISOString() } }, `Lot ${lot}`); }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div><Label>Requested qty</Label><Input value={order.rmRequest?.qty ?? order.rmQty} disabled className="mt-1" /></div>
      <div><Label>Received qty (kg)</Label><Input type="number" value={received} onChange={(e) => setReceived(Number(e.target.value))} className="mt-1" /></div>
      <div className="sm:col-span-2"><Label>Lot / Batch no.</Label><Input value={lot} onChange={(e) => setLot(e.target.value)} placeholder="LOT-…" required className="mt-1" /></div>
      <div className="sm:col-span-2"><Button type="submit">Confirm RM Receipt →</Button></div>
    </form>
  );
}

function TdsQcForm({ orderId, onDone }: { orderId: string; onDone: (p: any, n?: string) => void }) {
  const order = useProduction((s) => s.orders.find((o) => o.id === orderId))!;
  const [tdsOk, setTdsOk] = useState(true);
  const [micron, setMicron] = useState(order.micron);
  const [remarks, setRemarks] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onDone({ tdsQc: { tdsOk, micronActual: micron, remarks, at: new Date().toISOString() } }, remarks); }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="flex items-center justify-between rounded-md border p-3 sm:col-span-2">
        <div>
          <Label className="text-sm">Sheet TDS verified</Label>
          <p className="text-xs text-muted-foreground">Confirms technical data sheet matches incoming RM.</p>
        </div>
        <Switch checked={tdsOk} onCheckedChange={setTdsOk} />
      </div>
      <div><Label>Spec micron</Label><Input value={`${order.micron} µ`} disabled className="mt-1" /></div>
      <div><Label>Measured micron</Label><Input type="number" step="0.1" value={micron} onChange={(e) => setMicron(Number(e.target.value))} className="mt-1" /></div>
      <div className="sm:col-span-2"><Label>QC remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Tolerance, observations…" className="mt-1" /></div>
      <div className="sm:col-span-2"><Button type="submit" disabled={!tdsOk}>Approve TDS & QC →</Button></div>
    </form>
  );
}

function CuttingForm({ onDone }: { onDone: (p: any, n?: string) => void }) {
  const [by, setBy] = useState("");
  const [remarks, setRemarks] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onDone({ cutting: { approvedBy: by, remarks, at: new Date().toISOString() } }, remarks); }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2"><Label>Approved by</Label><Input value={by} onChange={(e) => setBy(e.target.value)} placeholder="Supervisor name" required className="mt-1" /></div>
      <div className="sm:col-span-2"><Label>Cutting remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Slitting plan, dimensions…" className="mt-1" /></div>
      <div className="sm:col-span-2"><Button type="submit">Approve Cutting → Production Ready</Button></div>
    </form>
  );
}

// Ignore unused stageIndex import
void stageIndex; void STAGES;
