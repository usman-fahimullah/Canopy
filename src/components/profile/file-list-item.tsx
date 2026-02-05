"use client";

import { Button } from "@/components/ui/button";
import { FilePdf, DownloadSimple } from "@phosphor-icons/react";

interface FileListItemProps {
  name: string;
  url: string;
}

export function FileListItem({ name, url }: FileListItemProps) {
  return (
    <div className="flex items-center gap-4 border-b border-[var(--border-muted)] py-4 last:border-0">
      {/* File icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
        <FilePdf size={20} className="text-[var(--foreground-muted)]" />
      </div>

      {/* File name */}
      <p className="min-w-0 flex-1 truncate text-body font-medium text-[var(--foreground-default)]">
        {name}
      </p>

      {/* Download */}
      <Button variant="outline" size="sm" leftIcon={<DownloadSimple size={16} />} asChild>
        <a href={url} download target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      </Button>
    </div>
  );
}
