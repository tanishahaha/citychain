import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';


const TextEditor = () => {
    const [content, setContent] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        autofocus: true,
        content,
        onUpdate({ editor }) {
            setContent(editor.getHTML());
        }

    })
    return (
        <div>
            <EditorContent editor={editor} />

        </div>
    )
}

export default TextEditor;