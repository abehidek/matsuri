import { api } from '../utils/trpc';
import { OptionalLayout, User } from '../components/AuthLayout';
import { BaseLayout } from '../components/BaseLayout';
import { Link } from 'fsr';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '../components/Loading';
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw';
import { Error } from '../components/Error';
import { TRPCError } from "@trpc/server";

const App: React.FC = () => {
  return (
    <BaseLayout title='Home' href='/'>
      <OptionalLayout>
        {(user) => {
          return user ? <MyNotes user={user} /> : <Landing />
        }}
      </OptionalLayout>
    </BaseLayout>
  )
}

type MyNotesProps = {
  user: User
};

export const MyNotes: React.FC<MyNotesProps> = (props) => {
  const { data, error, isError, isLoading } = useQuery(["note.all"], () => api.note.all.query(), {})

  if (isLoading) return <Loading />

  if (isError) {
    if (error instanceof TRPCError) return <Error message={error.message} />
    console.error(error);
    return <Error message={`Contact the support to get help`} />
  }
  
  return (
    <div>
      <h2 className='text-xl'>Hi {props.user.name}</h2>
      <h3 className='mt-2 font-bold text-2xl'>Your notes:</h3>
      <div className='mt-5 flex flex-col gap-5 mb-5'>
        {data.notes.map(note => (
          <ReactMarkdown className='markdown border shadow-lg p-3' rehypePlugins={[rehypeRaw]} key={note.id}>
            {note.content}
          </ReactMarkdown>
        ))}
      </div>
    </div>
  )
}

export const Landing: React.FC = () => {
  return (
    <div className='pt-12 flex flex-col justify-center items-center w-full'>
      <Link to="/signin">
        <h3 className='font-bold text-lg cursor-pointer'>Sign in here!</h3>
      </Link>
    </div>
  )
}

export default App
