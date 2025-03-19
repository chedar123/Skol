"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import YouTube from '@tiptap/extension-youtube';
import { 
  Bold, Italic, List, ListOrdered, Link as LinkIcon, 
  Image as ImageIcon, Youtube, Undo, Redo, Code 
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  error?: string;
}

export default function TiptapEditor({ 
  content, 
  onChange, 
  placeholder = 'Skriv ditt inlägg här...', 
  error 
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-pink-600 hover:text-pink-800 underline',
        },
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      YouTube.configure({
        width: 640,
        height: 480,
        controls: true,
      }),
    ],
    content,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg min-h-[150px] max-w-full focus:outline-none',
      },
    },
  });

  if (!editor) {
    return <div className="border rounded-md p-3 min-h-[150px] flex items-center justify-center">
      <div className="animate-pulse h-5 w-5 bg-gray-200 rounded-full"></div>
    </div>;
  }

  const addImage = () => {
    const url = window.prompt('URL för bild:');
    
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('YouTube URL:');
    
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);
    
    // avbryt om dialogrutan avbryts
    if (url === null) {
      return;
    }
    
    // ta bort länk
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    
    // lägg till http om det saknas
    const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
    
    // uppdatera länk
    editor.chain().focus().setLink({ href: urlWithProtocol }).run();
  };
  
  return (
    <div className={`border rounded-md overflow-hidden ${error ? 'border-red-500' : 'border-gray-300'}`}>
      <div className="bg-gray-50 p-2 border-b border-gray-200 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Fet"
        >
          <Bold className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Kursiv"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Punktlista"
        >
          <List className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Numrerad lista"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Kodblock"
        >
          <Code className="w-4 h-4" />
        </button>
        
        <div className="border-r border-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Lägg till länk"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-gray-200"
          title="Lägg till bild"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={addYoutubeVideo}
          className="p-1.5 rounded hover:bg-gray-200"
          title="Lägg till YouTube-video"
        >
          <Youtube className="w-4 h-4" />
        </button>
        
        <div className="border-r border-gray-300 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Ångra"
        >
          <Undo className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Gör om"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
} 