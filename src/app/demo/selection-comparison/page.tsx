"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";

/**
 * Demo page comparing text selection highlight colors:
 * 1. Neutral warm (#e5dfd8 / neutral-300)
 * 3. Light blue (#BFDBFE / blue-200)
 */

// Neutral Selection Editor
function NeutralSelectionEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: `
      <p><strong>Option 1: Neutral Warm Selection</strong></p>
      <p>Try selecting this text by clicking and dragging your cursor. The selection uses a warm neutral color (#e5dfd8) that matches your existing design tokens.</p>
      <p>This keeps the selection subtle and cohesive with the earthy tones of the Green Jobs Board brand. It feels natural and doesn't draw too much attention away from the content.</p>
      <ul>
        <li>Select this list item</li>
        <li>And this one too</li>
        <li>Notice how the selection blends in</li>
      </ul>
    `,
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)]">
      <EditorContent
        editor={editor}
        className={cn(
          "px-4 py-4",
          "[&_.ProseMirror]:min-h-[200px]",
          "[&_.ProseMirror]:text-lg [&_.ProseMirror]:leading-6 [&_.ProseMirror]:text-foreground",
          "[&_.ProseMirror]:focus:outline-none",
          // Neutral selection color
          "[&_.ProseMirror]::selection:bg-[#e5dfd8]",
          "[&_.ProseMirror]:selection:bg-[#e5dfd8]",
          "[&_.ProseMirror_*::selection]:bg-[#e5dfd8]",
          "[&_.ProseMirror_*]:selection:bg-[#e5dfd8]"
        )}
      />
      <style jsx global>{`
        .neutral-selection .ProseMirror ::selection {
          background-color: #e5dfd8 !important;
        }
        .neutral-selection .ProseMirror *::selection {
          background-color: #e5dfd8 !important;
        }
      `}</style>
    </div>
  );
}

// Blue Selection Editor
function BlueSelectionEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: `
      <p><strong>Option 3: Light Blue Selection</strong></p>
      <p>Try selecting this text by clicking and dragging your cursor. The selection uses a light blue color (#BFDBFE) similar to what you see in most modern text editors.</p>
      <p>This provides clear visual feedback that text is selected. It's a familiar convention from Google Docs, VS Code, and other popular editors. Users immediately recognize this as "selected text."</p>
      <ul>
        <li>Select this list item</li>
        <li>And this one too</li>
        <li>Notice how the selection stands out</li>
      </ul>
    `,
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)]">
      <EditorContent
        editor={editor}
        className={cn(
          "px-4 py-4",
          "[&_.ProseMirror]:min-h-[200px]",
          "[&_.ProseMirror]:text-lg [&_.ProseMirror]:leading-6 [&_.ProseMirror]:text-foreground",
          "[&_.ProseMirror]:focus:outline-none"
        )}
      />
      <style jsx global>{`
        .blue-selection .ProseMirror ::selection {
          background-color: #bfdbfe !important;
        }
        .blue-selection .ProseMirror *::selection {
          background-color: #bfdbfe !important;
        }
      `}</style>
    </div>
  );
}

export default function SelectionComparisonPage() {
  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-100)] px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-black">Text Selection Color Comparison</h1>
          <p className="text-[var(--primitive-neutral-600)]">
            Click and drag to select text in each editor to compare selection highlight colors.
          </p>
        </div>

        {/* Color Swatches */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-white p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl border border-[var(--primitive-neutral-300)] bg-[#e5dfd8]" />
              <div>
                <h3 className="font-medium text-black">Option 1: Neutral Warm</h3>
                <p className="text-sm text-[var(--primitive-neutral-600)]">#e5dfd8 (neutral-300)</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-[var(--primitive-neutral-600)]">
              <li>✓ Matches existing design tokens</li>
              <li>✓ Warm, earthy tone fits brand</li>
              <li>✓ Subtle, professional feel</li>
              <li>○ May be less immediately recognizable</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-white p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl border border-blue-300 bg-[#BFDBFE]" />
              <div>
                <h3 className="font-medium text-black">Option 3: Light Blue</h3>
                <p className="text-sm text-[var(--primitive-neutral-600)]">#BFDBFE (blue-200)</p>
              </div>
            </div>
            <ul className="space-y-1 text-sm text-[var(--primitive-neutral-600)]">
              <li>✓ Universally recognized as selection</li>
              <li>✓ Clear visual feedback</li>
              <li>✓ Familiar convention</li>
              <li>○ Introduces blue outside palette</li>
            </ul>
          </div>
        </div>

        {/* Editor Demos */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-xl font-medium text-black">
              Option 1: Neutral Warm Selection
            </h2>
            <div className="neutral-selection">
              <NeutralSelectionEditor />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-medium text-black">Option 3: Light Blue Selection</h2>
            <div className="blue-selection">
              <BlueSelectionEditor />
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-white p-6">
          <h2 className="mb-4 text-xl font-medium text-black">My Recommendation</h2>
          <div className="prose prose-sm max-w-none text-[var(--primitive-neutral-700)]">
            <p>
              For <strong>text selection</strong> specifically, I&apos;d lean towards{" "}
              <strong>light blue (#BFDBFE)</strong> because:
            </p>
            <ul>
              <li>
                Selection is a <em>transient UI state</em>, not a design element - users expect it
                to look like selection
              </li>
              <li>It provides immediate, clear feedback that text is selected</li>
              <li>
                It&apos;s a universal convention that doesn&apos;t need to match your brand colors
              </li>
              <li>The neutral option might make users wonder if they actually selected the text</li>
            </ul>
            <p>
              Think of it like cursor colors or scroll bars - some UI elements benefit from being
              conventionally styled rather than branded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
