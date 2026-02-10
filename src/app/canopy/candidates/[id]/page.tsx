import { redirect } from "next/navigation";

/**
 * Redirects to the candidates list with the preview sheet open.
 * The full-page candidate detail route has been replaced by an
 * expanded CandidatePreviewSheet overlay on the candidates list page.
 */
export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/canopy/candidates?preview=${id}`);
}
