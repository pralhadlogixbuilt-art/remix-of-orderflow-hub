import { createFileRoute } from "@tanstack/react-router";
import { OperationScreen } from "@/components/production/OperationScreen";
import { Scissors } from "lucide-react";

export const Route = createFileRoute("/production/cutting-approval")({
  head: () => ({ meta: [{ title: "Cutting Approval — Ontoz ERP" }] }),
  component: () => (
    <OperationScreen
      stage="cutting"
      title="Cutting Approval"
      description="Orders ready for cutting/slitting approval before being marked production-ready."
      icon={Scissors}
    />
  ),
});
