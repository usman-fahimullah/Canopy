"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function RootNotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 px-8">
      <MagnifyingGlass size={48} className="text-[var(--primitive-neutral-400)]" />
      <h2 className="text-foreground-default text-heading-sm font-medium">Page not found</h2>
      <p className="max-w-md text-center text-body text-foreground-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild variant="primary">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
