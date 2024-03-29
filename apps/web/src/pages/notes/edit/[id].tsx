import { useParams } from "react-router-dom";
import { AuthLayout } from "../../../components/AuthLayout";
import { BaseLayout } from "../../../components/BaseLayout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TRPCResponseError, api, isTRPCResponseError } from "../../../utils/trpc";
import { Loading } from "../../../components/Loading";
import { Error } from "../../../components/Error";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { useState } from "react";
import { formatZodError } from "utils";

const EditNoteEditor: React.FC<{ id: string, content: string }> = (props) => {
  const [HTML, setHTML] = useState(props.content);
  const [text, setText] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal",
        },
      }),
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Placeholder.configure({ placeholder: "Draft here..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: HTML,
    onUpdate: (props) => {
      setHTML(props.editor.getHTML());
      setText(props.editor.getText());
    },
    editable: true,
  });

  const editNote = useMutation(["note.edit"], api.note.edit.mutate, {
    onSuccess: (res) => alert(res.message), // should redirect to index
    onError: (err: TRPCResponseError) => {
      if (err.data?.zodError) return alert(formatZodError(err.data.zodError))
      alert(err.message)
    },
  })

  const canSubmitNote: boolean = text.length > 0 && HTML !== props.content;

  const submitNote = () => {
    if (!canSubmitNote) return alert("Your note should not be empty");
    editNote.mutate({ id: props.id, content: HTML });
  }

  return (
    <div>
      <RichTextEditor
        editor={editor}
        styles={{ root: { border: 0 } }}
        className="list-disc"
      >
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <button
            disabled={!canSubmitNote}
            className="z-10 py-3 w-full bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 disabled:bg-blue-900"
            onClick={submitNote}
          >
            Edit
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
};

const EditNote: React.FC<{ id: string }> = (props) => {
  const { data, error, isError, isLoading } = useQuery(
    ["note.get"],
    () => api.note.get.query({ id: props.id }),
    {}
  );

  if (isLoading) return <Loading />;

  if (isError) {
    if (isTRPCResponseError(error)) return <Error message={error.message} />;
    console.error(error);
    return <Error message={`Contact the support to get help`} />;
  }

  return <EditNoteEditor id={props.id} content={data.note.content} />
};

const EditNotePage: React.FC = () => {
  const { id } = useParams();

  return (
    <BaseLayout href={`/notes/edit`} title="Edit">
      <AuthLayout>
        {(_user) => (
          <>{id ? <EditNote id={id} /> : "No note was found to be editted"}</>
        )}
      </AuthLayout>
    </BaseLayout>
  );
};

export default EditNotePage;
