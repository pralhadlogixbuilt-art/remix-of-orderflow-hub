import { createFileRoute } from "@tanstack/react-router";
import { OperationScreen } from "@/components/production/OperationScreen";
import { FlaskConical } from "lucide-react";

export const Route = createFileRoute("/production/tds-qc")({
  head: () => ({ meta: [{ title: "TDS & Quality Check — Ontoz ERP" }] }),
  component: () => (
    <OperationScreen
      stage="tds_qc"
      title="TDS & Quality Check"
      description="Combined sheet TDS verification and micron QC. Handled by the same operator."
      icon={FlaskConical}
    />
  ),
});
