import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function CoachNotFound() {
  return (
    <div className="flex h-[calc(100vh-108px)] flex-col items-center justify-center gap-4 px-8">
      <MagnifyingGlass size={48} className="text-[var(--primitive-neutral-400)]" />
      <h2 className="text-heading-sm font-medium text-foreground-default">
        Page not found
      </h2>
      <p className="text-body text-foreground-muted text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild variant="primary">
        <Link href="/coach/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
