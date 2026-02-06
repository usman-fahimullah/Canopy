"use client";

import { useParams } from "next/navigation";
import { RoleEditView } from "./_components/RoleEditView";

export default function RoleEditPage() {
  const params = useParams();
  const roleId = params.id as string;
  return <RoleEditView roleId={roleId} />;
}
