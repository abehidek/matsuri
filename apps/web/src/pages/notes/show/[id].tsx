import { useParams } from "react-router-dom";
import { AuthLayout } from "../../../components/AuthLayout";
import { BaseLayout } from "../../../components/BaseLayout";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useQuery } from "@tanstack/react-query";
import { api, isTRPCResponseError } from "../../../utils/trpc";
import { Loading } from "../../../components/Loading";
import { Error } from "../../../components/Error";

const ShowNote: React.FC<{ id: string }> = (props) => {
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

  return (
    <div>
      <ReactMarkdown
        className="markdown"
        rehypePlugins={[rehypeRaw]}
      >
        {data.note.content}
      </ReactMarkdown>
    </div>
  )
}

const ShowNotePage: React.FC = () => {
  const { id } = useParams();

  return (
    <BaseLayout href={`/notes/show`} title="Show">
      <AuthLayout>
        {(_user) => (
          <>{id ? <ShowNote id={id} /> : "No note was found to be show"}</>
        )}
      </AuthLayout>
    </BaseLayout>
  );
};

export default ShowNotePage;
