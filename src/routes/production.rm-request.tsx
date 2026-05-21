import { createFileRoute } from "@tanstack/react-router";
import { OperationScreen } from "@/components/production/OperationScreen";
import { PackagePlus } from "lucide-react";

export const Route = createFileRoute("/production/rm-request")({
  head: () => ({ meta: [{ title: "RM Request — Ontoz ERP" }] }),
  component: () => (
    <OperationScreen
      stage="rm_request"
      title="RM Request"
      description="All orders waiting for raw material requests to be raised to purchase."
      icon={PackagePlus}
    />
  ),
});
