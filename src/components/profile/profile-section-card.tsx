"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PencilSimple } from "@phosphor-icons/react";

interface ProfileSectionCardProps {
  title: string;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  emptyActionLabel: string;
  onAction: () => void;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function ProfileSectionCard({
  title,
  isEmpty,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onAction,
  onEdit,
  children,
}: ProfileSectionCardProps) {
  if (isEmpty) {
    return (
      <Card>
        <CardContent className="p-6">
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            size="sm"
            action={{
              label: emptyActionLabel,
              onClick: onAction,
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-body-strong text-[var(--foreground-default)]">{title}</h3>
          {onEdit && (
            <Button variant="link" leftIcon={<PencilSimple size={16} />} onClick={onEdit}>
              Edit {title.toLowerCase()}
            </Button>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
