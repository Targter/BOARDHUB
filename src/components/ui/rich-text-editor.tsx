'use client'

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Quote } from 'lucide-react'
import { Button } from './button'
import { cn } from 'src/libs/utils'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Enter description...',
  disabled = false,
  className
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      if (isUpdating) return // Prevent infinite loops
      
      const html = editor.getHTML()
      // Only call onChange if content actually changed and avoid empty paragraphs
      const sanitizedHtml = html === '<p></p>' ? '' : html
      if (sanitizedHtml !== content) {
        onChange(sanitizedHtml)
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] max-w-none',
          'prose-headings:font-semibold prose-a:text-blue-600 prose-strong:font-semibold',
          className
        ),
      },
    },
  })

  // Update editor content when prop changes
  React.useEffect(() => {
    if (editor && !isUpdating) {
      const currentContent = editor.getHTML()
      const normalizedContent = content || '<p></p>'
      
      // Only update if content is actually different to prevent infinite loops
      if (normalizedContent !== currentContent) {
        setIsUpdating(true)
        editor.commands.setContent(normalizedContent, false)
        // Use a small timeout to reset the updating flag
        setTimeout(() => setIsUpdating(false), 10)
      }
    }
  }, [editor, content, isUpdating])

  if (!editor || !isMounted) {
    return (
      <div className={cn(
        'border border-input rounded-md bg-background min-h-[120px] p-3',
        disabled && 'opacity-50 cursor-not-allowed'
      )}>
        <div className="text-muted-foreground">{placeholder}</div>
      </div>
    )
  }

  return (
    <div className={cn(
      'border border-input rounded-md bg-background',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      {/* Toolbar */}
      <div className="border-b border-input p-2 flex items-center gap-1 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled || !editor.can().chain().focus().toggleBold().run()}
          data-active={editor.isActive('bold')}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled || !editor.can().chain().focus().toggleItalic().run()}
          data-active={editor.isActive('italic')}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled || !editor.can().chain().focus().toggleBulletList().run()}
          data-active={editor.isActive('bulletList')}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled || !editor.can().chain().focus().toggleOrderedList().run()}
          data-active={editor.isActive('orderedList')}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled || !editor.can().chain().focus().toggleBlockquote().run()}
          data-active={editor.isActive('blockquote')}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="p-3 min-h-[120px]" onMouseDown={(e) => e.stopPropagation()}>
        <EditorContent 
          editor={editor} 
          className="focus-within:outline-none"
        />
      </div>
    </div>
  )
}

// CSS for active states and editor styling
const editorStyles = `
  .ProseMirror {
    outline: none;
    min-height: 120px;
    padding: 0;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #9ca3af;
    pointer-events: none;
    height: 0;
  }

  button[data-active="true"] {
    background-color: hsl(var(--accent));
    color: hsl(var(--accent-foreground));
  }

  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }

  .ProseMirror li {
    margin: 0.25rem 0;
  }

  .ProseMirror blockquote {
    border-left: 4px solid hsl(var(--border));
    padding-left: 1rem;
    margin: 0.5rem 0;
    font-style: italic;
    color: hsl(var(--muted-foreground));
  }

  .ProseMirror strong {
    font-weight: 600;
  }

  .ProseMirror em {
    font-style: italic;
  }
`

// Inject styles only on client side after hydration
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Check if styles are already injected
  if (!document.querySelector('#rich-text-editor-styles')) {
    const styleElement = document.createElement('style')
    styleElement.id = 'rich-text-editor-styles'
    styleElement.textContent = editorStyles
    document.head.appendChild(styleElement)
  }
} 