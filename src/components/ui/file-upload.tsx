"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Upload, File, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

/**
 * FileUpload component for uploading files
 *
 * Uses semantic tokens:
 * - border-interactive for drag states
 * - background-success/error for status
 */

const dropzoneVariants = cva(
  cn(
    "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed",
    "transition-colors cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-interactive-focus"
  ),
  {
    variants: {
      size: {
        sm: "p-4 gap-2",
        md: "p-6 gap-3",
        lg: "p-8 gap-4",
      },
      state: {
        idle: "border-border-default bg-background-subtle hover:border-border-interactive-hover hover:bg-background-interactive-hover",
        dragover:
          "border-border-interactive-focus bg-background-interactive-selected",
        uploading: "border-border-brand bg-background-brand-subtle",
        success: "border-border-success bg-background-success",
        error: "border-border-error bg-background-error",
        disabled:
          "border-border-disabled bg-background-interactive-disabled cursor-not-allowed opacity-60",
      },
    },
    defaultVariants: {
      size: "md",
      state: "idle",
    },
  }
);

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onError">,
    VariantProps<typeof dropzoneVariants> {
  /** Accepted file types (e.g., "image/*,.pdf") */
  accept?: string;
  /** Allow multiple files */
  multiple?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Disable the uploader */
  disabled?: boolean;
  /** Files already selected */
  value?: File[];
  /** Callback when files change */
  onChange?: (files: File[]) => void;
  /** Custom upload handler */
  onUpload?: (files: File[]) => Promise<void>;
  /** Callback on error */
  onError?: (error: string) => void;
}

interface FileWithProgress extends File {
  id: string;
  progress?: number;
  status?: "pending" | "uploading" | "success" | "error";
  error?: string;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      className,
      size,
      accept,
      multiple = false,
      maxSize = 10 * 1024 * 1024, // 10MB default
      maxFiles = 10,
      disabled = false,
      value = [],
      onChange,
      onUpload,
      onError,
      children,
      ...props
    },
    ref
  ) => {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [files, setFiles] = React.useState<FileWithProgress[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const state = disabled
      ? "disabled"
      : isDragOver
        ? "dragover"
        : files.some((f) => f.status === "uploading")
          ? "uploading"
          : files.some((f) => f.status === "error")
            ? "error"
            : files.every((f) => f.status === "success") && files.length > 0
              ? "success"
              : "idle";

    const handleFiles = React.useCallback(
      async (newFiles: FileList | File[]) => {
        const fileArray = Array.from(newFiles);

        // Validate file count
        if (fileArray.length + files.length > maxFiles) {
          onError?.(`Maximum ${maxFiles} files allowed`);
          return;
        }

        // Validate file sizes
        const oversizedFiles = fileArray.filter((f) => f.size > maxSize);
        if (oversizedFiles.length > 0) {
          onError?.(
            `Files must be smaller than ${Math.round(maxSize / 1024 / 1024)}MB`
          );
          return;
        }

        // Add files with IDs
        const filesWithIds: FileWithProgress[] = fileArray.map((f) =>
          Object.assign(f, {
            id: Math.random().toString(36).slice(2),
            status: "pending" as const,
            progress: 0,
          })
        );

        setFiles((prev) => [...prev, ...filesWithIds]);
        onChange?.(fileArray);

        // Handle upload if provided
        if (onUpload) {
          setFiles((prev) =>
            prev.map((f) =>
              filesWithIds.find((nf) => nf.id === f.id)
                ? { ...f, status: "uploading" as const }
                : f
            )
          );

          try {
            await onUpload(fileArray);
            setFiles((prev) =>
              prev.map((f) =>
                filesWithIds.find((nf) => nf.id === f.id)
                  ? { ...f, status: "success" as const, progress: 100 }
                  : f
              )
            );
          } catch (err) {
            setFiles((prev) =>
              prev.map((f) =>
                filesWithIds.find((nf) => nf.id === f.id)
                  ? {
                      ...f,
                      status: "error" as const,
                      error: err instanceof Error ? err.message : "Upload failed",
                    }
                  : f
              )
            );
          }
        }
      },
      [files.length, maxFiles, maxSize, onChange, onError, onUpload]
    );

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!disabled && e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    };

    const handleClick = () => {
      if (!disabled) inputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    };

    const removeFile = (id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    return (
      <div className="space-y-3">
        <div
          ref={ref}
          className={cn(dropzoneVariants({ size, state }), className)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
          {...props}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />

          {children || (
            <>
              <div className="rounded-full bg-background-muted p-3">
                <Upload className="h-6 w-6 text-foreground-muted" />
              </div>
              <div className="text-center">
                <p className="text-body-sm font-medium text-foreground-default">
                  Drop files here or click to upload
                </p>
                <p className="text-caption text-foreground-muted mt-1">
                  {accept
                    ? `Accepted: ${accept}`
                    : "All file types supported"}
                </p>
                <p className="text-caption-sm text-foreground-subtle mt-0.5">
                  Max {Math.round(maxSize / 1024 / 1024)}MB per file
                </p>
              </div>
            </>
          )}
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={() => removeFile(file.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

// File item component
interface FileItemProps {
  file: FileWithProgress;
  onRemove: () => void;
}

const FileItem = ({ file, onRemove }: FileItemProps) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border",
        file.status === "error"
          ? "border-border-error bg-background-error"
          : file.status === "success"
            ? "border-border-success bg-background-success"
            : "border-border-default bg-background-subtle"
      )}
    >
      <div className="flex-shrink-0">
        {file.status === "error" ? (
          <AlertCircle className="h-5 w-5 text-foreground-error" />
        ) : file.status === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-foreground-success" />
        ) : (
          <File className="h-5 w-5 text-foreground-muted" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-caption font-medium text-foreground-default truncate">
          {file.name}
        </p>
        <p className="text-caption-sm text-foreground-muted">
          {file.error || formatSize(file.size)}
        </p>
        {file.status === "uploading" && (
          <Progress
            value={file.progress}
            size="sm"
            className="mt-1"
          />
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 rounded-md p-1 hover:bg-background-interactive-hover transition-colors"
      >
        <X className="h-4 w-4 text-foreground-muted" />
      </button>
    </div>
  );
};

export { FileUpload, dropzoneVariants };
