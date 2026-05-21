import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Factory,
  ClipboardList,
  PackagePlus,
  PackageCheck,
  FlaskConical,
  Scissors,
  Activity,
} from "lucide-react";
import { useProduction, pendingCount } from "@/lib/production-store";

const items = [
  { title: "Production Orders", url: "/production/orders", icon: ClipboardList, stage: null },
  { title: "RM Request", url: "/production/rm-request", icon: PackagePlus, stage: "rm_request" as const },
  { title: "RM Receipt", url: "/production/rm-receipt", icon: PackageCheck, stage: "rm_receipt" as const },
  { title: "TDS & Quality Check", url: "/production/tds-qc", icon: FlaskConical, stage: "tds_qc" as const },
  { title: "Cutting Approval", url: "/production/cutting-approval", icon: Scissors, stage: "cutting" as const },
  { title: "Stage Tracking", url: "/production/stage-tracking", icon: Activity, stage: null },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const orders = useProduction((s) => s.orders);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Factory className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Ontoz ERP</span>
            <span className="text-xs text-muted-foreground">Manufacturing</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Production</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = path.startsWith(item.url);
                const count = item.stage ? pendingCount(orders, item.stage) : 0;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.stage && count > 0 && (
                          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary group-data-[collapsible=icon]:hidden">
                            {count}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
