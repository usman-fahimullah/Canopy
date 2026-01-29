"use client";

import * as React from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { cn } from "@/lib/utils";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  ToolbarSpacer,
} from "./toolbar";
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  ListBullets,
  ListNumbers,
  ArrowUUpLeft,
  ArrowUUpRight,
  Link as LinkIcon,
  LinkBreak,
  Minus,
  Quotes,
  Code,
  TextHOne,
  TextHTwo,
  TextHThree,
} from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { Input } from "./input";
import { Button } from "./button";

/* ============================================
   Rich Text Editor Context
   ============================================ */
interface RichTextEditorContextValue {
  editor: Editor | null;
}

const RichTextEditorContext = React.createContext<RichTextEditorContextValue>({
  editor: null,
});

const useRichTextEditor = () => {
  const context = React.useContext(RichTextEditorContext);
  if (!context) {
    throw new Error("useRichTextEditor must be used within RichTextEditor");
  }
  return context;
};

/* ============================================
   Rich Text Editor Root
   ============================================ */
interface RichTextEditorProps {
  content?: string;
  placeholder?: string;
  onChange?: (html: string) => void;
  onUpdate?: (editor: Editor) => void;
  editable?: boolean;
  className?: string;
  children?: React.ReactNode;
  autofocus?: boolean;
  minHeight?: string;
  maxHeight?: string;
}

const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      content = "",
      placeholder = "Write your role description here",
      onChange,
      onUpdate,
      editable = true,
      className,
      children,
      autofocus = false,
      minHeight = "200px",
      maxHeight,
    },
    ref
  ) => {
    const editor = useEditor({
      immediatelyRender: false, // Disable SSR to avoid hydration mismatches
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Placeholder.configure({
          placeholder,
          emptyEditorClass: "is-editor-empty",
        }),
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-foreground-link underline cursor-pointer hover:text-foreground-link-hover",
          },
        }),
        Highlight.configure({
          multicolor: false,
        }),
      ],
      content,
      editable,
      autofocus,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
        onUpdate?.(editor as Editor);
      },
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm max-w-none focus:outline-none",
            "prose-headings:font-medium prose-headings:text-foreground-default",
            "prose-p:text-foreground-default prose-p:leading-relaxed",
            "prose-strong:font-semibold prose-strong:text-foreground-default",
            "prose-a:text-foreground-link prose-a:underline hover:prose-a:text-foreground-link-hover",
            "prose-ul:list-disc prose-ol:list-decimal",
            "prose-li:text-foreground-default prose-li:marker:text-foreground-muted",
            "prose-blockquote:border-l-4 prose-blockquote:border-border-brand prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground-muted",
            "prose-code:bg-background-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono",
            "prose-hr:border-border-default"
          ),
        },
      },
    });

    return (
      <RichTextEditorContext.Provider value={{ editor }}>
        <div
          ref={ref}
          className={cn(
            // Figma: bg #faf9f7 (neutral-100), border #f2ede9 (neutral-200), 12px radius
            "rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] overflow-hidden",
            "focus-within:border-[var(--primitive-green-500)]",
            "transition-all duration-150",
            className
          )}
        >
          {/* Toolbar wrapper - Figma: pt-4 (16px) px-4 (16px) pb-2 (8px) */}
          {children && (
            <div className="pt-4 px-4 pb-2">
              {children}
            </div>
          )}
          <EditorContent
            editor={editor}
            className={cn(
              // Figma: px-4 (16px) py-3 (12px) for text area
              "px-4 py-3",
              "[&_.ProseMirror]:min-h-[var(--min-height)]",
              maxHeight && "[&_.ProseMirror]:max-h-[var(--max-height)] [&_.ProseMirror]:overflow-y-auto",
              // Figma: placeholder color #7a7671, font-size 18px, line-height 24px
              "[&_.ProseMirror]:text-lg [&_.ProseMirror]:leading-6 [&_.ProseMirror]:text-foreground",
              "[&_.is-editor-empty]:before:content-[attr(data-placeholder)]",
              "[&_.is-editor-empty]:before:text-[var(--primitive-neutral-500)]",
              "[&_.is-editor-empty]:before:float-left",
              "[&_.is-editor-empty]:before:h-0",
              "[&_.is-editor-empty]:before:pointer-events-none",
              // Text selection color - blue-100
              "[&_.ProseMirror_*::selection]:bg-[var(--primitive-blue-100)]",
              "[&_.ProseMirror_::selection]:bg-[var(--primitive-blue-100)]"
            )}
            style={{
              "--min-height": minHeight,
              "--max-height": maxHeight,
            } as React.CSSProperties}
          />
        </div>
      </RichTextEditorContext.Provider>
    );
  }
);
RichTextEditor.displayName = "RichTextEditor";

/* ============================================
   Rich Text Editor Toolbar
   ============================================ */
interface RichTextToolbarProps {
  className?: string;
}

const RichTextToolbar = React.forwardRef<HTMLDivElement, RichTextToolbarProps>(
  ({ className }, ref) => {
    const { editor } = useRichTextEditor();

    // Show skeleton toolbar while editor is loading
    if (!editor) {
      return (
        <Toolbar
          ref={ref}
          aria-label="Formatting toolbar"
          className={cn("w-full", className)}
        >
          <div className="flex items-center gap-6 animate-pulse">
            {/* Bold/Italic skeleton */}
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-10 w-10 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
            </div>
            {/* Decoration skeleton */}
            <div className="h-10 w-28 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
            {/* Alignment skeleton */}
            <div className="h-10 w-28 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
            {/* Lists skeleton */}
            <div className="h-10 w-20 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
          </div>
        </Toolbar>
      );
    }

    // Determine current decoration state for toggle group
    const getDecorationValue = () => {
      if (editor.isActive("underline")) return "underline";
      if (editor.isActive("strike")) return "strikethrough";
      return "none";
    };

    const handleDecorationChange = (value: string) => {
      // First, remove any existing decoration
      if (editor.isActive("underline")) {
        editor.chain().focus().toggleUnderline().run();
      }
      if (editor.isActive("strike")) {
        editor.chain().focus().toggleStrike().run();
      }
      // Then apply the new one (if not "none")
      if (value === "underline") {
        editor.chain().focus().toggleUnderline().run();
      } else if (value === "strikethrough") {
        editor.chain().focus().toggleStrike().run();
      }
    };

    // Full-width toolbar with white background and shadow
    // Figma: toolbar has gap-6 (24px) between groups, nested in RTE container with pt-4 px-4 pb-2
    return (
      <Toolbar
        ref={ref}
        aria-label="Formatting toolbar"
        className={cn("w-full", className)}
      >
        {/* Bold & Italic - standalone group with gap-2 (8px) */}
        <ToolbarGroup variant="plain" aria-label="Text style">
          <ToolbarButton
            selected={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            tooltip="Bold"
            shortcut="⌘B"
          >
            <TextB weight={editor.isActive("bold") ? "bold" : "regular"} />
          </ToolbarButton>
          <ToolbarButton
            selected={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            tooltip="Italic"
            shortcut="⌘I"
          >
            <TextItalic weight={editor.isActive("italic") ? "bold" : "regular"} />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Decoration Toggle Group - none, underline, strikethrough */}
        <ToolbarToggleGroup
          value={getDecorationValue()}
          onValueChange={handleDecorationChange}
          aria-label="Text decoration"
        >
          <ToolbarToggleItem value="none" tooltip="No decoration">
            <Minus />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="underline" tooltip="Underline" shortcut="⌘U">
            <TextUnderline />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="strikethrough" tooltip="Strikethrough" shortcut="⌘⇧S">
            <TextStrikethrough />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>

        {/* Text Alignment Group */}
        <ToolbarToggleGroup
          value={
            editor.isActive({ textAlign: "center" })
              ? "center"
              : editor.isActive({ textAlign: "right" })
              ? "right"
              : "left"
          }
          onValueChange={(value) => {
            editor.chain().focus().setTextAlign(value).run();
          }}
          aria-label="Text alignment"
        >
          <ToolbarToggleItem value="left" tooltip="Align left">
            <TextAlignLeft />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="center" tooltip="Align center">
            <TextAlignCenter />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="right" tooltip="Align right">
            <TextAlignRight />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>

        {/* Lists Group */}
        <ToolbarGroup variant="grouped" aria-label="Lists">
          <ToolbarButton
            selected={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            tooltip="Bullet list"
            grouped
          >
            <ListBullets weight={editor.isActive("bulletList") ? "bold" : "regular"} />
          </ToolbarButton>
          <ToolbarButton
            selected={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            tooltip="Numbered list"
            grouped
          >
            <ListNumbers weight={editor.isActive("orderedList") ? "bold" : "regular"} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSpacer />

        {/* Undo/Redo - grouped together */}
        <ToolbarGroup variant="plain" aria-label="History">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            tooltip="Undo"
            shortcut="⌘Z"
          >
            <ArrowUUpLeft />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            tooltip="Redo"
            shortcut="⌘⇧Z"
          >
            <ArrowUUpRight />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }
);
RichTextToolbar.displayName = "RichTextToolbar";

/* ============================================
   Rich Text Editor Extended Toolbar
   (with headings, links, blockquote, etc.)
   ============================================ */
interface RichTextExtendedToolbarProps {
  className?: string;
}

const RichTextExtendedToolbar = React.forwardRef<
  HTMLDivElement,
  RichTextExtendedToolbarProps
>(({ className }, ref) => {
  const { editor } = useRichTextEditor();
  const [linkUrl, setLinkUrl] = React.useState("");
  const [linkOpen, setLinkOpen] = React.useState(false);

  if (!editor) return null;

  const setLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setLinkOpen(false);
    setLinkUrl("");
  };

  return (
    <Toolbar
      ref={ref}
      aria-label="Formatting toolbar"
      className={cn("flex-wrap w-full px-4 py-3", className)}
    >
        {/* Headings */}
        <ToolbarGroup variant="grouped" aria-label="Headings">
          <ToolbarButton
            selected={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            tooltip="Heading 1"
            grouped
          >
            <TextHOne weight={editor.isActive("heading", { level: 1 }) ? "bold" : "regular"} />
          </ToolbarButton>
          <ToolbarButton
            selected={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            tooltip="Heading 2"
            grouped
          >
            <TextHTwo weight={editor.isActive("heading", { level: 2 }) ? "bold" : "regular"} />
          </ToolbarButton>
          <ToolbarButton
            selected={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            tooltip="Heading 3"
            grouped
          >
            <TextHThree weight={editor.isActive("heading", { level: 3 }) ? "bold" : "regular"} />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Text Formatting Group */}
        <ToolbarGroup variant="grouped" aria-label="Text formatting">
          <ToolbarButton
            selected={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            tooltip="Bold"
            shortcut="⌘B"
            grouped
          >
            <TextB weight={editor.isActive("bold") ? "bold" : "regular"} />
          </ToolbarButton>
          <ToolbarButton
            selected={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            tooltip="Italic"
            shortcut="⌘I"
            grouped
          >
            <TextItalic weight={editor.isActive("italic") ? "bold" : "regular"} />
          </ToolbarButton>
          <ToolbarButton
            selected={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            tooltip="Underline"
            shortcut="⌘U"
            grouped
          >
            <TextUnderline weight={editor.isActive("underline") ? "bold" : "regular"} />
          </ToolbarButton>
          <ToolbarButton
            selected={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            tooltip="Strikethrough"
            grouped
          >
            <TextStrikethrough weight={editor.isActive("strike") ? "bold" : "regular"} />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Text Alignment Group */}
        <ToolbarToggleGroup
          value={
            editor.isActive({ textAlign: "center" })
              ? "center"
              : editor.isActive({ textAlign: "right" })
              ? "right"
              : "left"
          }
          onValueChange={(value) => {
            editor.chain().focus().setTextAlign(value).run();
          }}
          aria-label="Text alignment"
        >
          <ToolbarToggleItem value="left" tooltip="Align left">
            <TextAlignLeft />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="center" tooltip="Align center">
            <TextAlignCenter />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="right" tooltip="Align right">
            <TextAlignRight />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>

        {/* Lists Group */}
        <ToolbarGroup variant="grouped" aria-label="Lists">
          <ToolbarButton
            selected={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            tooltip="Bullet list"
            grouped
          >
            <ListBullets weight={editor.isActive("bulletList") ? "bold" : "regular"} />
          </ToolbarButton>
          <ToolbarButton
            selected={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            tooltip="Numbered list"
            grouped
          >
            <ListNumbers weight={editor.isActive("orderedList") ? "bold" : "regular"} />
          </ToolbarButton>
        </ToolbarGroup>

        <ToolbarSeparator />

        {/* Block Elements */}
        <ToolbarGroup aria-label="Block elements">
          <ToolbarButton
            selected={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            tooltip="Quote"
          >
            <Quotes weight={editor.isActive("blockquote") ? "bold" : "regular"} />
          </ToolbarButton>
          <ToolbarButton
            selected={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            tooltip="Code block"
          >
            <Code weight={editor.isActive("codeBlock") ? "bold" : "regular"} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            tooltip="Horizontal rule"
          >
            <Minus />
          </ToolbarButton>
        </ToolbarGroup>

        {/* Link */}
        <Popover open={linkOpen} onOpenChange={setLinkOpen}>
          <PopoverTrigger asChild>
            <ToolbarButton
              selected={editor.isActive("link")}
              tooltip={editor.isActive("link") ? "Edit link" : "Add link"}
            >
              <LinkIcon weight={editor.isActive("link") ? "bold" : "regular"} />
            </ToolbarButton>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground-default">
                  URL
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setLink();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={setLink}>
                  {editor.isActive("link") ? "Update" : "Add"} link
                </Button>
                {editor.isActive("link") && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setLinkOpen(false);
                    }}
                  >
                    <LinkBreak className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <ToolbarSpacer />

        {/* Undo/Redo */}
        <ToolbarGroup aria-label="History">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            tooltip="Undo"
            shortcut="⌘Z"
          >
            <ArrowUUpLeft />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            tooltip="Redo"
            shortcut="⌘⇧Z"
          >
            <ArrowUUpRight />
          </ToolbarButton>
        </ToolbarGroup>
    </Toolbar>
  );
});
RichTextExtendedToolbar.displayName = "RichTextExtendedToolbar";

/* ============================================
   Read-only Renderer
   ============================================ */
interface RichTextRendererProps {
  content: string;
  className?: string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  className,
}) => {
  const editor = useEditor({
    immediatelyRender: false, // Disable SSR to avoid hydration mismatches
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-foreground-link underline cursor-pointer hover:text-foreground-link-hover",
        },
      }),
      Highlight,
    ],
    content,
    editable: false,
  });

  return (
    <EditorContent
      editor={editor}
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:font-medium prose-headings:text-foreground-default",
        "prose-p:text-foreground-default prose-p:leading-relaxed",
        "prose-strong:font-semibold prose-strong:text-foreground-default",
        "prose-a:text-foreground-link prose-a:underline hover:prose-a:text-foreground-link-hover",
        "prose-ul:list-disc prose-ol:list-decimal",
        "prose-li:text-foreground-default prose-li:marker:text-foreground-muted",
        "prose-blockquote:border-l-4 prose-blockquote:border-border-brand prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground-muted",
        "prose-code:bg-background-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono",
        "prose-hr:border-border-default",
        // Text selection color - blue-100
        "[&_.ProseMirror_*::selection]:bg-[var(--primitive-blue-100)]",
        "[&_.ProseMirror_::selection]:bg-[var(--primitive-blue-100)]",
        className
      )}
    />
  );
};

/* ============================================
   Exports
   ============================================ */
export {
  RichTextEditor,
  RichTextToolbar,
  RichTextExtendedToolbar,
  RichTextRenderer,
  useRichTextEditor,
  type RichTextEditorProps,
  type RichTextToolbarProps,
  type RichTextExtendedToolbarProps,
  type RichTextRendererProps,
};
