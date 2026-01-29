"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, File } from "@/components/Icons";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");
  const hasHeader = filename || language;

  return (
    <div className={cn("relative group rounded-xl overflow-hidden", className)}>
      {/* Header bar with filename and copy button */}
      {hasHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-background-emphasized border-b border-border">
          <div className="flex items-center gap-2">
            {filename && (
              <>
                <File className="w-4 h-4 text-foreground-subtle" />
                <span className="text-caption-sm text-foreground-muted font-mono">
                  {filename}
                </span>
              </>
            )}
            {!filename && language && (
              <span className="text-caption-sm text-foreground-subtle uppercase font-mono">
                {language}
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200",
              "text-caption-sm font-medium",
              copied
                ? "bg-primary-600/20 text-primary-400"
                : "text-foreground-subtle hover:text-foreground hover:bg-background-muted"
            )}
            aria-label={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Code content */}
      <div className="relative">
        {!hasHeader && (
          <div className="absolute right-2 top-2 z-10">
            <button
              onClick={handleCopy}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "bg-background-emphasized hover:bg-background-muted",
                "opacity-0 group-hover:opacity-100",
                "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              )}
              aria-label={copied ? "Copied!" : "Copy code"}
            >
              {copied ? (
                <Check className="w-4 h-4 text-primary-400" />
              ) : (
                <Copy className="w-4 h-4 text-foreground-muted" />
              )}
            </button>
          </div>
        )}
        <pre
          className={cn(
            "bg-background-inverse text-foreground-inverse p-4 overflow-x-auto",
            "text-caption font-mono",
            !hasHeader && "rounded-xl",
            showLineNumbers && "pl-12"
          )}
        >
          <code className="block">
            {lines.map((line, i) => {
              const lineNumber = i + 1;
              const isHighlighted = highlightLines.includes(lineNumber);

              return (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    isHighlighted && "bg-primary-500/10 -mx-4 px-4 border-l-2 border-primary-500"
                  )}
                >
                  {showLineNumbers && (
                    <span className="mr-4 text-foreground-subtle select-none w-6 text-right shrink-0">
                      {lineNumber}
                    </span>
                  )}
                  <span className="flex-1">{line || " "}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

interface CodePreviewProps {
  code: string;
  children: React.ReactNode;
  className?: string;
}

export function CodePreview({ code, children, className }: CodePreviewProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className={cn("border border-border rounded-xl overflow-hidden", className)}>
      {/* Preview */}
      <div className="p-6 bg-surface">{children}</div>

      {/* Toggle */}
      <div className="border-t border-border bg-background-muted px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-caption text-foreground-muted hover:text-foreground transition-colors flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {showCode ? "Hide code" : "Show code"}
        </button>
      </div>

      {/* Code */}
      {showCode && (
        <div className="border-t border-border">
          <CodeBlock code={code} />
        </div>
      )}
    </div>
  );
}
