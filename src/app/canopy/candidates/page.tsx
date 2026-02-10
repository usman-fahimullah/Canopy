import { redirect } from "next/navigation";
import { getCachedAuthContext } from "@/lib/access-control";
import { fetchCandidatesList } from "@/lib/services/candidates";
import { CandidatesView } from "./CandidatesView";

interface CandidatesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CandidatesPage({ searchParams }: CandidatesPageProps) {
  const ctx = await getCachedAuthContext();
  if (!ctx) redirect("/login");

  const params = await searchParams;
  const skip = parseInt((params.skip as string) || "0");
  const take = parseInt((params.take as string) || "20");
  const stage = (params.stage as string) || undefined;
  const matchScoreMin = params.matchScoreMin
    ? parseInt(params.matchScoreMin as string)
    : undefined;
  const matchScoreMax = params.matchScoreMax
    ? parseInt(params.matchScoreMax as string)
    : undefined;
  const source = (params.source as string) || undefined;
  const search = (params.search as string) || undefined;

  const data = await fetchCandidatesList(ctx, {
    skip,
    take,
    stage,
    matchScoreMin,
    matchScoreMax,
    source,
    search,
  });

  return (
    <CandidatesView
      initialData={{
        applications: data.applications,
        meta: { total: data.meta.total, skip: data.meta.skip, take: data.meta.take },
        userRole: data.userRole,
      }}
    />
  );
}
