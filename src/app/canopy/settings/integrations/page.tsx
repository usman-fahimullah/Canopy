"use client";

import { useState, useCallback } from "react";
import { Toast } from "@/components/ui/toast";
import IntegrationsSection from "./IntegrationsSection";

export default function IntegrationsPage() {
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "critical";
  } | null>(null);

  const showToast = useCallback((message: string, variant: "success" | "critical" = "success") => {
    setToast({ message, variant });
  }, []);

  return (
    <>
      <IntegrationsSection showToast={showToast} />

      {toast && (
        <div className="fixed bottom-6 right-6 z-[var(--z-toast)]">
          <Toast
            variant={toast.variant}
            dismissible
            autoDismiss={4000}
            onDismiss={() => setToast(null)}
          >
            {toast.message}
          </Toast>
        </div>
      )}
    </>
  );
}
