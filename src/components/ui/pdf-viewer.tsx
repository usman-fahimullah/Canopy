"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Skeleton } from "./skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./dropdown";
import {
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowLeft,
  ArrowRight,
  DownloadSimple,
  Printer,
  ArrowsOut,
  ArrowsIn,
  MagnifyingGlass,
  X,
  FilePdf,
  Warning,
  CaretLeft,
  CaretRight,
  CircleNotch,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";

/* ============================================
   PDF Viewer Types
   ============================================ */
export interface PdfViewerProps {
  /** PDF source - URL or File */
  src: string | File;
  /** Title to display in header */
  title?: string;
  /** Initial page number */
  initialPage?: number;
  /** Initial zoom level (1 = 100%) */
  initialZoom?: number;
  /** Show toolbar */
  showToolbar?: boolean;
  /** Show page thumbnails sidebar */
  showThumbnails?: boolean;
  /** Allow download */
  allowDownload?: boolean;
  /** Allow print */
  allowPrint?: boolean;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Callback when document loads */
  onLoad?: (numPages: number) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Custom class name */
  className?: string;
  /** Height of viewer */
  height?: string | number;
}

export interface ResumeViewerProps extends Omit<PdfViewerProps, "showThumbnails"> {
  /** Candidate name for context */
  candidateName?: string;
  /** Resume upload date */
  uploadedAt?: Date;
  /** File size in bytes */
  fileSize?: number;
  /** Show ATS parsing highlights */
  showParsingHighlights?: boolean;
}

/* ============================================
   PDF Toolbar
   ============================================ */
interface PdfToolbarProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  onPageChange: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
  title?: string;
}

const PdfToolbar: React.FC<PdfToolbarProps> = ({
  currentPage,
  totalPages,
  zoom,
  onPageChange,
  onZoomChange,
  onDownload,
  onPrint,
  onFullscreen,
  isFullscreen,
  title,
}) => {
  const [pageInput, setPageInput] = React.useState(currentPage.toString());

  React.useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const zoomPresets = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border-muted bg-background-subtle">
      {/* Left: Title */}
      <div className="flex items-center gap-2 min-w-0">
        <FilePdf className="h-5 w-5 text-foreground-error flex-shrink-0" />
        {title && (
          <span className="text-sm font-medium truncate">{title}</span>
        )}
      </div>

      {/* Center: Navigation & Zoom */}
      <div className="flex items-center gap-4">
        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-8 w-8 p-0"
          >
            <CaretLeft className="h-4 w-4" />
          </Button>

          <form onSubmit={handlePageSubmit} className="flex items-center gap-1">
            <Input
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-12 h-8 text-center text-sm p-1"
            />
            <span className="text-sm text-foreground-muted">/ {totalPages}</span>
          </form>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 p-0"
          >
            <CaretRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-border-default" />

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
            disabled={zoom <= 0.25}
            className="h-8 w-8 p-0 transition-all duration-fast hover:scale-105 active:scale-95"
          >
            <MagnifyingGlassMinus className="h-4 w-4" />
          </Button>

          <Select
            value={String(zoom)}
            onValueChange={(value) => onZoomChange(parseFloat(value))}
          >
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {zoomPresets.map((preset) => (
                <SelectItem key={preset} value={String(preset)}>
                  {Math.round(preset * 100)}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.min(3, zoom + 0.25))}
            disabled={zoom >= 3}
            className="h-8 w-8 p-0 transition-all duration-fast hover:scale-105 active:scale-95"
          >
            <MagnifyingGlassPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {onPrint && (
          <Button variant="ghost" size="sm" onClick={onPrint} className="h-8 w-8 p-0">
            <Printer className="h-4 w-4" />
          </Button>
        )}
        {onDownload && (
          <Button variant="ghost" size="sm" onClick={onDownload} className="h-8 w-8 p-0">
            <DownloadSimple className="h-4 w-4" />
          </Button>
        )}
        {onFullscreen && (
          <Button variant="ghost" size="sm" onClick={onFullscreen} className="h-8 w-8 p-0">
            {isFullscreen ? (
              <ArrowsIn className="h-4 w-4" />
            ) : (
              <ArrowsOut className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

/* ============================================
   PDF Viewer Component
   Note: This is a placeholder that uses an iframe.
   For production, integrate with @react-pdf/renderer
   or pdf.js for full functionality.
   ============================================ */
const PdfViewer = React.forwardRef<HTMLDivElement, PdfViewerProps>(
  (
    {
      src,
      title,
      initialPage = 1,
      initialZoom = 1,
      showToolbar = true,
      showThumbnails = false,
      allowDownload = true,
      allowPrint = true,
      onPageChange,
      onLoad,
      onError,
      className,
      height = "600px",
    },
    ref
  ) => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);
    const [currentPage, setCurrentPage] = React.useState(initialPage);
    const [totalPages, setTotalPages] = React.useState(1);
    const [zoom, setZoom] = React.useState(initialZoom);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Get URL from src
    const pdfUrl = React.useMemo(() => {
      if (typeof src === "string") return src;
      return URL.createObjectURL(src);
    }, [src]);

    // Cleanup object URL
    React.useEffect(() => {
      return () => {
        if (typeof src !== "string") {
          URL.revokeObjectURL(pdfUrl);
        }
      };
    }, [src, pdfUrl]);

    const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        onPageChange?.(page);
      }
    };

    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = title || "document.pdf";
      link.click();
    };

    const handlePrint = () => {
      const printWindow = window.open(pdfUrl);
      printWindow?.print();
    };

    const handleFullscreen = () => {
      if (!containerRef.current) return;

      if (!isFullscreen) {
        containerRef.current.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    };

    const handleIframeLoad = () => {
      setLoading(false);
      // In a real implementation, we'd get page count from pdf.js
      setTotalPages(1);
      onLoad?.(1);
    };

    const handleIframeError = () => {
      const err = new Error("Failed to load PDF");
      setError(err);
      setLoading(false);
      onError?.(err);
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          "flex flex-col rounded-lg border border-border-muted bg-surface-default overflow-hidden",
          isFullscreen && "fixed inset-0 z-50 rounded-none",
          className
        )}
        style={{ height: isFullscreen ? "100vh" : height }}
      >
        {/* Toolbar */}
        {showToolbar && (
          <PdfToolbar
            currentPage={currentPage}
            totalPages={totalPages}
            zoom={zoom}
            onPageChange={handlePageChange}
            onZoomChange={setZoom}
            onDownload={allowDownload ? handleDownload : undefined}
            onPrint={allowPrint ? handlePrint : undefined}
            onFullscreen={handleFullscreen}
            isFullscreen={isFullscreen}
            title={title}
          />
        )}

        {/* Content */}
        <div className="flex-1 relative overflow-auto bg-background-emphasized">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background-default animate-fade-in">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-background-brand-subtle flex items-center justify-center">
                    <FilePdf className="h-8 w-8 text-foreground-brand" />
                  </div>
                  <div className="absolute -inset-1 flex items-center justify-center">
                    <CircleNotch className="h-[72px] w-[72px] text-foreground-brand/30 animate-spin" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground-default">Loading PDF</p>
                  <p className="text-xs text-foreground-muted mt-0.5">Please wait...</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background-default animate-fade-in">
              <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
                <div className="w-16 h-16 rounded-full bg-background-error/20 flex items-center justify-center">
                  <Warning className="h-8 w-8 text-foreground-error" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground-default">
                    Unable to load PDF
                  </p>
                  <p className="text-sm text-foreground-muted mt-1">{error.message}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                  }}
                  className="mt-2"
                >
                  <ArrowCounterClockwise className="h-4 w-4 mr-2" />
                  Try again
                </Button>
              </div>
            </div>
          )}

          {/* PDF iframe - in production use pdf.js or @react-pdf/renderer */}
          <iframe
            src={`${pdfUrl}#page=${currentPage}&zoom=${zoom * 100}`}
            title={title || "PDF Viewer"}
            className={cn(
              "w-full h-full border-0",
              (loading || error) && "invisible"
            )}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      </div>
    );
  }
);
PdfViewer.displayName = "PdfViewer";

/* ============================================
   Resume Viewer (ATS-specific)
   ============================================ */
const ResumeViewer = React.forwardRef<HTMLDivElement, ResumeViewerProps>(
  (
    {
      src,
      candidateName,
      uploadedAt,
      fileSize,
      showParsingHighlights = false,
      ...props
    },
    ref
  ) => {
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
      <div ref={ref} className="space-y-3">
        {/* Resume metadata */}
        {(candidateName || uploadedAt || fileSize) && (
          <div className="flex items-center justify-between px-3 py-2 bg-background-subtle rounded-lg">
            <div className="flex items-center gap-3">
              <FilePdf className="h-8 w-8 text-foreground-error" />
              <div>
                <p className="text-sm font-medium">
                  {candidateName ? `${candidateName}'s Resume` : "Resume"}
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                  {uploadedAt && (
                    <span>
                      Uploaded{" "}
                      {uploadedAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {fileSize && uploadedAt && <span>•</span>}
                  {fileSize && <span>{formatFileSize(fileSize)}</span>}
                </div>
              </div>
            </div>

            {showParsingHighlights && (
              <Button variant="outline" size="sm">
                <MagnifyingGlass className="h-4 w-4 mr-1" />
                Show parsed data
              </Button>
            )}
          </div>
        )}

        {/* PDF Viewer */}
        <PdfViewer
          src={src}
          title={candidateName ? `${candidateName}'s Resume` : "Resume"}
          {...props}
        />
      </div>
    );
  }
);
ResumeViewer.displayName = "ResumeViewer";

/* ============================================
   Document Preview Card
   ============================================ */
interface DocumentPreviewCardProps {
  title: string;
  src: string | File;
  type?: "pdf" | "doc" | "image";
  uploadedAt?: Date;
  fileSize?: number;
  onView?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  className?: string;
}

const DocumentPreviewCard: React.FC<DocumentPreviewCardProps> = ({
  title,
  src,
  type = "pdf",
  uploadedAt,
  fileSize,
  onView,
  onDownload,
  onDelete,
  className,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg border border-border-muted",
        "bg-surface-default hover:bg-card-background-hover hover:shadow-sm hover:border-border-default",
        "transition-all duration-fast",
        className
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-background-error/10 flex items-center justify-center transition-transform duration-fast group-hover:scale-105">
        <FilePdf className="h-5 w-5 text-foreground-error" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          {uploadedAt && (
            <span>
              {uploadedAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {fileSize && <span>• {formatFileSize(fileSize)}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
        {onView && (
          <Button variant="ghost" size="sm" onClick={onView} className="h-8 w-8 p-0 transition-all duration-fast hover:scale-110 active:scale-95">
            <ArrowsOut className="h-4 w-4" />
          </Button>
        )}
        {onDownload && (
          <Button variant="ghost" size="sm" onClick={onDownload} className="h-8 w-8 p-0 transition-all duration-fast hover:scale-110 active:scale-95">
            <DownloadSimple className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-foreground-error hover:bg-background-error/20 transition-all duration-fast hover:scale-110 active:scale-95"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

/* ============================================
   Exports
   ============================================ */
export {
  PdfViewer,
  PdfToolbar,
  ResumeViewer,
  DocumentPreviewCard,
};
