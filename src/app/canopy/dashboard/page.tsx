import { redirect } from "next/navigation";
import { getCachedAuthContext } from "@/lib/access-control";
import { fetchDashboardData } from "@/lib/services/dashboard";
import { DashboardView } from "./DashboardView";

export default async function EmployerDashboardPage() {
  const ctx = await getCachedAuthContext();
  if (!ctx) redirect("/login");

  const data = await fetchDashboardData(ctx);

  return <DashboardView data={data} />;
}
