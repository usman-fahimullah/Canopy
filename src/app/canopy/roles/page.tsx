import { redirect } from "next/navigation";
import { getCachedAuthContext } from "@/lib/access-control";
import { fetchRolesList } from "@/lib/services/roles";
import { fetchTemplatesList } from "@/lib/services/templates";
import { RolesView } from "./RolesView";

export default async function RolesPage() {
  const ctx = await getCachedAuthContext();
  if (!ctx) redirect("/login");

  const [rolesData, templates] = await Promise.all([
    fetchRolesList(ctx),
    fetchTemplatesList(ctx),
  ]);

  return (
    <RolesView
      initialJobs={rolesData.jobs}
      initialTemplates={templates}
    />
  );
}
