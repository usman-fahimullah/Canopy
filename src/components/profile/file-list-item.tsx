"use client";

import {
  Button,
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemTrailing,
} from "@/components/ui";
import { FilePdf, DownloadSimple } from "@phosphor-icons/react";

interface FileListItemProps {
  name: string;
  url: string;
}

export function FileListItem({ name, url }: FileListItemProps) {
  return (
    <ListItem size="md" className="border-b border-[var(--border-muted)] last:border-0">
      {/* File icon */}
      <ListItemLeading size="md">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background-subtle)]">
          <FilePdf size={20} className="text-[var(--foreground-muted)]" />
        </div>
      </ListItemLeading>

      {/* File name */}
      <ListItemContent>
        <ListItemTitle>{name}</ListItemTitle>
      </ListItemContent>

      {/* Download */}
      <ListItemTrailing>
        <Button variant="outline" size="sm" leftIcon={<DownloadSimple size={16} />} asChild>
          <a href={url} download target="_blank" rel="noopener noreferrer">
            Download PDF
          </a>
        </Button>
      </ListItemTrailing>
    </ListItem>
  );
}
