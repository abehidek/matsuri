import { TRPCResponseError, api, isTRPCResponseError } from "../utils/trpc";
import { OptionalLayout, User } from "../components/AuthLayout";
import { BaseLayout } from "../components/BaseLayout";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loading } from "../components/Loading";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Error } from "../components/Error";
import IconOptions from "../assets/icon-options.svg";
import { Menu } from "@headlessui/react";
import { formatZodError } from "utils";

const App: React.FC = () => {
  return (
    <BaseLayout title="Home" href="/">
      <OptionalLayout>
        {(user) => {
          return user ? <MyNotes user={user} /> : <Landing />;
        }}
      </OptionalLayout>
    </BaseLayout>
  );
};

type MyNotesProps = {
  user: User;
};

export const MyNotes: React.FC<MyNotesProps> = (props) => {
  const { data, error, isError, isLoading } = useQuery(
    ["note.all"],
    () => api.note.all.query(),
    {}
  );

  if (isLoading) return <Loading />;

  if (isError) {
    if (isTRPCResponseError(error)) return <Error message={error.message} />;
    console.error(error);
    return <Error message={`Contact the support to get help`} />;
  }

  return (
    <div>
      <h2 className="text-xl">Hi {props.user.name}</h2>
      <h3 className="mt-2 font-bold text-2xl">Your notes:</h3>
      <div className="mt-5 flex flex-col gap-5 mb-5">
        {data.notes.map((note) => (
          <div className="border shadow-lg p-3" key={note.id}>
            <div className="flex justify-end">
              <NoteDropdown id={note.id} />
            </div>
            <ReactMarkdown
              className="markdown"
              rehypePlugins={[rehypeRaw]}
              key={note.id}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
};

const NoteDropdown: React.FC<{ id: string }> = (props) => {
  const deleteNote = useMutation(["note.del"], api.note.del.mutate, {
    onSuccess: (res) => alert(res.message),
    onError: (err: TRPCResponseError) => {
      if (err.data?.zodError) return alert(formatZodError(err.data.zodError))
      alert(err.message)
    }
  })
  const onDelete = () => {
    if (!props.id) return alert("No id was provided by the note.");
    deleteNote.mutate({ id: props.id })
  }
  
  return (
    <div className="absolute">
      <Menu>
        <Menu.Button className="text-right">
          <img
            src={IconOptions}
            className="flex justify-center items-center w-6 h-6 cursor-pointer"
            alt="Note options"
          />
        </Menu.Button>
        <Menu.Items className="z-10 absolute right-0 flex flex-col gap-2 bg-gray-200 p-3 rounded">
          <Menu.Item>
            {({ active }) => (
              <Link
                className={`${
                  active && "bg-blue-500"
                } p-2 rounded whitespace-nowrap`}
                to={`/notes/edit/${props.id}`}
              >
                Edit
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onDelete}
                className={`${
                  active && "bg-blue-500"
                } p-2 rounded whitespace-nowrap`}
              >
                Delete
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export const Landing: React.FC = () => {
  return (
    <div className="pt-12 flex flex-col justify-center items-center w-full">
      <Link to="/signin">
        <h3 className="font-bold text-lg cursor-pointer">Sign in here!</h3>
      </Link>
    </div>
  );
};

export default App;
