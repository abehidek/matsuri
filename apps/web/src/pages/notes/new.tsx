import { BaseLayout } from "../../components/BaseLayout";
import { OptionalLayout } from "../../components/AuthLayout";
import { Navigate } from "react-router-dom";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import { api } from "../../utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "../../../../server/src/router/root";
import { formatZodError } from 'utils'

const NewNote: React.FC = () => {
  const [content, setContent] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Placeholder.configure({ placeholder: "Draft here..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: (props) => {
      setContent(props.editor.getHTML());
    },
  });

  const createNote = useMutation(["note.create"], api.note.create.mutate, {
    onSuccess: (res) => alert(res.message),
    onError: (err: TRPCClientErrorLike<AppRouter>) => {
      if (err.data?.zodError) return alert(formatZodError(err.data.zodError))
      alert(err.message)
    },
  });

  const submitNote = () => {
    createNote.mutate({
      content,
    });
  };
  return (
    <BaseLayout href="/notes/new" title="New">
      <OptionalLayout>
        {(user) => {
          if (!user) return <Navigate to="/" />;
          return (
            <div>
              <RichTextEditor editor={editor} styles={{ root: { border: 0 } }}>
                <RichTextEditor.Toolbar sticky stickyOffset={0}>
                  <button
                    className="z-10 py-3 w-full bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                    onClick={submitNote}
                  >
                    Adicionar
                  </button>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
              </RichTextEditor>
            </div>
          );
        }}
      </OptionalLayout>
    </BaseLayout>
  );
};

export default NewNote;
