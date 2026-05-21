import { createFileRoute } from "@tanstack/react-router";
import { OperationScreen } from "@/components/production/OperationScreen";
import { PackageCheck } from "lucide-react";

export const Route = createFileRoute("/production/rm-receipt")({
  head: () => ({ meta: [{ title: "RM Receipt — Ontoz ERP" }] }),
  component: () => (
    <OperationScreen
      stage="rm_receipt"
      title="RM Receipt"
      description="Orders with pending raw material receipt — confirm incoming stock against the order."
      icon={PackageCheck}
    />
  ),
});
