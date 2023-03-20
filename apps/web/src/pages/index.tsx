import { useMutation, useQuery } from '@tanstack/react-query';
import { LogClient } from 'log-sdk';
import { authClient } from "auth-sdk";
import { OptionalLayout } from '../components/AuthLayout';
import { Link } from 'react-router-dom';
import { Button } from 'ui'
import { api } from '../utils/trpc';

const logger = new LogClient({
  appName: "web",
});

const App: React.FC = () => {
  logger.log("render page!!", "index:render")
  // console.log("client environment variables:", env);

  // const test = useQuery(["getAll"], () => api.getAll.query("Browser input"))

  // if (test.isLoading) return <div>Loading...</div>

  // if (test.isError) {
  //   console.error(test.error)
  //   return <div>Error...</div>
  // }

  const me = useQuery(["me"], () => api.me.query())

  if (me.isLoading) return <div>Loading...</div>
  if (me.isError) {
    console.error(me.error)
    return <div>Error...</div>
  }

  const signOut = useMutation(["signOut"], () => {
    return authClient.signOut({})
  }, {
    onSuccess: (data) => {
      console.log("signOut Mut onSucess:", data)
      if (!data.ok) return alert(data.message)

      return alert(data.message)
    },
    onError: (err) => {
      console.error("signOut Mut onError:", err)
      alert("Something went wrong")
    }
  })

  return (
    <div>
      <h1 className='font-bold text-2xl'>Home</h1>
      {JSON.stringify(me)}
      <Button />
      <OptionalLayout>
        {(user) => (
          <div>
            {user
              ? (
                <div>
                  {JSON.stringify(user)}
                  <button onClick={() => signOut.mutate()}>Sign out</button>
                </div>
              )
              : (<Link to="/signin">Sign in</Link>)
            }
          </div>
        )}
      </OptionalLayout>
      {/* {JSON.stringify(test.data, null, 2)} */}
    </div>
  )
}

export default App
