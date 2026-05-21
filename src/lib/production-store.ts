import { create } from "zustand";

export type Stage =
  | "confirmed"
  | "rm_request"
  | "rm_receipt"
  | "tds_qc"
  | "cutting"
  | "ready";

export const STAGES: { key: Stage; label: string; short: string }[] = [
  { key: "confirmed", label: "Order Confirmed", short: "Confirmed" },
  { key: "rm_request", label: "RM Request", short: "RM Req" },
  { key: "rm_receipt", label: "RM Receipt", short: "RM Rcpt" },
  { key: "tds_qc", label: "TDS & Quality Check", short: "TDS/QC" },
  { key: "cutting", label: "Cutting Approval", short: "Cutting" },
  { key: "ready", label: "Production Ready", short: "Ready" },
];

export const stageIndex = (s: Stage) => STAGES.findIndex((x) => x.key === s);

export type ProductionOrder = {
  id: string;
  client: string;
  product: string;
  qty: number;
  unit: string;
  rm: string;
  rmQty: number;
  micron: number;
  createdAt: string;
  stage: Stage;
  history: { stage: Stage; at: string; by: string; note?: string }[];
  rmRequest?: { qty: number; note: string; at: string };
  rmReceipt?: { receivedQty: number; lot: string; at: string };
  tdsQc?: { tdsOk: boolean; micronActual: number; remarks: string; at: string };
  cutting?: { approvedBy: string; remarks: string; at: string };
};

const seed: ProductionOrder[] = [
  {
    id: "PO-2401",
    client: "Aero Components Pvt Ltd",
    product: "Aluminum Sheet 1.2mm",
    qty: 500,
    unit: "pcs",
    rm: "Al Coil Grade 5052",
    rmQty: 620,
    micron: 1200,
    createdAt: "2026-05-12",
    stage: "rm_request",
    history: [
      { stage: "confirmed", at: "2026-05-12 09:14", by: "S. Mehta" },
    ],
  },
  {
    id: "PO-2402",
    client: "Bharath Packaging Co.",
    product: "PET Film Roll 50µ",
    qty: 1200,
    unit: "kg",
    rm: "PET Resin Clear",
    rmQty: 1320,
    micron: 50,
    createdAt: "2026-05-13",
    stage: "rm_receipt",
    history: [
      { stage: "confirmed", at: "2026-05-13 10:02", by: "S. Mehta" },
      { stage: "rm_request", at: "2026-05-13 14:20", by: "R. Kapoor" },
    ],
    rmRequest: { qty: 1320, note: "Urgent — shipment Friday", at: "2026-05-13 14:20" },
  },
  {
    id: "PO-2403",
    client: "Crescent Foils",
    product: "Foil Lamination 12µ",
    qty: 800,
    unit: "kg",
    rm: "Aluminum Foil 12mic",
    rmQty: 850,
    micron: 12,
    createdAt: "2026-05-11",
    stage: "tds_qc",
    history: [
      { stage: "confirmed", at: "2026-05-11 08:30", by: "S. Mehta" },
      { stage: "rm_request", at: "2026-05-11 11:00", by: "R. Kapoor" },
      { stage: "rm_receipt", at: "2026-05-12 09:45", by: "Store Team" },
    ],
    rmRequest: { qty: 850, note: "", at: "2026-05-11 11:00" },
    rmReceipt: { receivedQty: 850, lot: "LOT-AF-7781", at: "2026-05-12 09:45" },
  },
  {
    id: "PO-2404",
    client: "Delta Print House",
    product: "BOPP Film 25µ",
    qty: 2000,
    unit: "kg",
    rm: "BOPP Granules",
    rmQty: 2150,
    micron: 25,
    createdAt: "2026-05-10",
    stage: "cutting",
    history: [
      { stage: "confirmed", at: "2026-05-10 08:00", by: "S. Mehta" },
      { stage: "rm_request", at: "2026-05-10 10:10", by: "R. Kapoor" },
      { stage: "rm_receipt", at: "2026-05-11 09:00", by: "Store Team" },
      { stage: "tds_qc", at: "2026-05-12 15:30", by: "QC: A. Nair" },
    ],
    rmRequest: { qty: 2150, note: "", at: "2026-05-10 10:10" },
    rmReceipt: { receivedQty: 2150, lot: "LOT-BO-3321", at: "2026-05-11 09:00" },
    tdsQc: { tdsOk: true, micronActual: 25.2, remarks: "Within tolerance", at: "2026-05-12 15:30" },
  },
  {
    id: "PO-2405",
    client: "Everest Labels",
    product: "Coated Paper Roll",
    qty: 600,
    unit: "kg",
    rm: "Kraft Base 80gsm",
    rmQty: 650,
    micron: 90,
    createdAt: "2026-05-09",
    stage: "ready",
    history: [
      { stage: "confirmed", at: "2026-05-09 08:00", by: "S. Mehta" },
      { stage: "rm_request", at: "2026-05-09 10:00", by: "R. Kapoor" },
      { stage: "rm_receipt", at: "2026-05-10 11:00", by: "Store Team" },
      { stage: "tds_qc", at: "2026-05-11 12:00", by: "QC: A. Nair" },
      { stage: "cutting", at: "2026-05-12 09:00", by: "M. Iyer" },
      { stage: "ready", at: "2026-05-13 16:40", by: "Production" },
    ],
    rmRequest: { qty: 650, note: "", at: "2026-05-09 10:00" },
    rmReceipt: { receivedQty: 650, lot: "LOT-KR-1102", at: "2026-05-10 11:00" },
    tdsQc: { tdsOk: true, micronActual: 91, remarks: "OK", at: "2026-05-11 12:00" },
    cutting: { approvedBy: "M. Iyer", remarks: "Ready for slitting", at: "2026-05-12 09:00" },
  },
  {
    id: "PO-2406",
    client: "Forge Metal Works",
    product: "Stainless Sheet 0.8mm",
    qty: 350,
    unit: "pcs",
    rm: "SS Coil 304",
    rmQty: 420,
    micron: 800,
    createdAt: "2026-05-14",
    stage: "confirmed",
    history: [
      { stage: "confirmed", at: "2026-05-14 09:00", by: "S. Mehta" },
    ],
  },
];

type State = {
  orders: ProductionOrder[];
  advance: (id: string, stage: Stage, data: Partial<ProductionOrder>, by: string, note?: string) => void;
};

const now = () => new Date().toISOString().slice(0, 16).replace("T", " ");

export const useProduction = create<State>((set) => ({
  orders: seed,
  advance: (id, stage, data, by, note) =>
    set((s) => ({
      orders: s.orders.map((o) => {
        if (o.id !== id) return o;
        const next = STAGES[stageIndex(stage) + 1]?.key ?? "ready";
        return {
          ...o,
          ...data,
          stage: next,
          history: [...o.history, { stage, at: now(), by, note }],
        };
      }),
    })),
}));

export const stageLabel = (s: Stage) => STAGES.find((x) => x.key === s)!.label;

export const pendingCount = (orders: ProductionOrder[], stage: Stage) =>
  orders.filter((o) => o.stage === stage).length;
