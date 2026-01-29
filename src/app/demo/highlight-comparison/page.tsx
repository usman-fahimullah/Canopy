"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { cn } from "@/lib/utils";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarSpacer,
} from "@/components/ui/toolbar";
import {
  TextB,
  TextItalic,
  Highlighter,
  ArrowUUpLeft,
  ArrowUUpRight,
} from "@phosphor-icons/react";

/**
 * Demo page comparing highlight color options:
 * 1. Neutral warm (#f2ede9 / neutral-200)
 * 3. Light blue (#DBEAFE)
 */

// Neutral Highlight Editor
function NeutralHighlightEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-[#e5dfd8] rounded-sm px-0.5", // neutral-300 for visibility
        },
      }),
    ],
    content: `
      <p>This is a demo of the <mark>neutral warm highlight</mark> option.</p>
      <p>Select some text and click the highlight button to see how it looks. This uses your existing design token <mark>neutral-300 (#e5dfd8)</mark> which keeps the design cohesive with the earthy, warm tones of the Green Jobs Board brand.</p>
      <p>Try highlighting <strong>bold text</strong> or <em>italic text</em> to see how it combines.</p>
    `,
  });

  if (!editor) return null;

  return (
    <div className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] overflow-hidden">
      <div className="pt-4 px-4 pb-2">
        <Toolbar className="w-full">
          <ToolbarGroup variant="plain">
            <ToolbarButton
              selected={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              tooltip="Bold"
            >
              <TextB weight={editor.isActive("bold") ? "bold" : "regular"} />
            </ToolbarButton>
            <ToolbarButton
              selected={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              tooltip="Italic"
            >
              <TextItalic weight={editor.isActive("italic") ? "bold" : "regular"} />
            </ToolbarButton>
          </ToolbarGroup>

          <ToolbarButton
            selected={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            tooltip="Highlight"
            className="bg-[#e5dfd8]"
          >
            <Highlighter weight={editor.isActive("highlight") ? "fill" : "regular"} />
          </ToolbarButton>

          <ToolbarSpacer />

          <ToolbarGroup variant="plain">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              tooltip="Undo"
            >
              <ArrowUUpLeft />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              tooltip="Redo"
            >
              <ArrowUUpRight />
            </ToolbarButton>
          </ToolbarGroup>
        </Toolbar>
      </div>
      <EditorContent
        editor={editor}
        className={cn(
          "px-4 py-3",
          "[&_.ProseMirror]:min-h-[150px]",
          "[&_.ProseMirror]:text-lg [&_.ProseMirror]:leading-6 [&_.ProseMirror]:text-foreground",
          "[&_.ProseMirror]:focus:outline-none"
        )}
      />
    </div>
  );
}

// Blue Highlight Editor
function BlueHighlightEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-[#DBEAFE] rounded-sm px-0.5", // Light blue
        },
      }),
    ],
    content: `
      <p>This is a demo of the <mark>light blue highlight</mark> option.</p>
      <p>Select some text and click the highlight button to see how it looks. This uses <mark>#DBEAFE (blue-100)</mark> which stands out more as "marked" content, similar to what you'd see in document editors like Google Docs or Notion.</p>
      <p>Try highlighting <strong>bold text</strong> or <em>italic text</em> to see how it combines.</p>
    `,
  });

  if (!editor) return null;

  return (
    <div className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] overflow-hidden">
      <div className="pt-4 px-4 pb-2">
        <Toolbar className="w-full">
          <ToolbarGroup variant="plain">
            <ToolbarButton
              selected={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              tooltip="Bold"
            >
              <TextB weight={editor.isActive("bold") ? "bold" : "regular"} />
            </ToolbarButton>
            <ToolbarButton
              selected={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              tooltip="Italic"
            >
              <TextItalic weight={editor.isActive("italic") ? "bold" : "regular"} />
            </ToolbarButton>
          </ToolbarGroup>

          <ToolbarButton
            selected={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            tooltip="Highlight"
            className="bg-[#DBEAFE]"
          >
            <Highlighter weight={editor.isActive("highlight") ? "fill" : "regular"} />
          </ToolbarButton>

          <ToolbarSpacer />

          <ToolbarGroup variant="plain">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              tooltip="Undo"
            >
              <ArrowUUpLeft />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              tooltip="Redo"
            >
              <ArrowUUpRight />
            </ToolbarButton>
          </ToolbarGroup>
        </Toolbar>
      </div>
      <EditorContent
        editor={editor}
        className={cn(
          "px-4 py-3",
          "[&_.ProseMirror]:min-h-[150px]",
          "[&_.ProseMirror]:text-lg [&_.ProseMirror]:leading-6 [&_.ProseMirror]:text-foreground",
          "[&_.ProseMirror]:focus:outline-none"
        )}
      />
    </div>
  );
}

export default function HighlightComparisonPage() {
  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-100)] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Highlight Color Comparison
          </h1>
          <p className="text-[var(--primitive-neutral-600)]">
            Compare the two highlight options to see which fits better with your design system.
          </p>
        </div>

        {/* Color Swatches */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[var(--primitive-neutral-200)] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#e5dfd8] border border-[var(--primitive-neutral-300)]" />
              <div>
                <h3 className="font-medium text-black">Option 1: Neutral Warm</h3>
                <p className="text-sm text-[var(--primitive-neutral-600)]">#e5dfd8 (neutral-300)</p>
              </div>
            </div>
            <ul className="text-sm text-[var(--primitive-neutral-600)] space-y-1">
              <li>✓ Matches existing design tokens</li>
              <li>✓ Warm, earthy tone fits brand</li>
              <li>✓ Subtle, doesn't compete with content</li>
              <li>○ Less visually distinct as "highlighted"</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--primitive-neutral-200)] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] border border-blue-200" />
              <div>
                <h3 className="font-medium text-black">Option 3: Light Blue</h3>
                <p className="text-sm text-[var(--primitive-neutral-600)]">#DBEAFE (blue-100)</p>
              </div>
            </div>
            <ul className="text-sm text-[var(--primitive-neutral-600)] space-y-1">
              <li>✓ Clearly stands out as "marked"</li>
              <li>✓ Familiar convention (Google Docs, Notion)</li>
              <li>✓ Good contrast without being harsh</li>
              <li>○ Introduces new color to palette</li>
            </ul>
          </div>
        </div>

        {/* Editor Demos */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-medium text-black mb-3">
              Option 1: Neutral Warm Highlight
            </h2>
            <NeutralHighlightEditor />
          </div>

          <div>
            <h2 className="text-xl font-medium text-black mb-3">
              Option 3: Light Blue Highlight
            </h2>
            <BlueHighlightEditor />
          </div>
        </div>

        {/* Usage Context */}
        <div className="bg-white rounded-2xl border border-[var(--primitive-neutral-200)] p-6">
          <h2 className="text-xl font-medium text-black mb-4">Usage Context</h2>
          <div className="prose prose-sm max-w-none text-[var(--primitive-neutral-700)]">
            <p>
              Consider how highlights will be used in your application:
            </p>
            <ul>
              <li><strong>For emphasis in job descriptions:</strong> Light blue may help key requirements stand out to candidates scanning listings.</li>
              <li><strong>For internal notes:</strong> Neutral fits better as it's less visually aggressive for frequent use.</li>
              <li><strong>For AI-suggested content:</strong> Either could work, but blue might better signal "AI marked this" vs user-written content.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
