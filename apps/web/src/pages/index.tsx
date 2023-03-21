import { useMutation, useQuery } from '@tanstack/react-query';
import { LogClient } from 'log-sdk';
import { authClient } from "auth-sdk";
import { OptionalLayout, User } from '../components/AuthLayout';
import { BaseLayout } from '../components/BaseLayout';
import { Link } from 'fsr';

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
  return (
    <div>
      <h3>Your notes</h3>
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
