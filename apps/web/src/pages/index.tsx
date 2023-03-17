import { env } from 'env'
import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/trpc';
import { LogClient } from 'log-sdk';

const logger = new LogClient({
  appName: "web",
});

const App: React.FC = () => {
  logger.log("render page!!", "index:render")
  console.log("client environment variables:", env);

  const test = useQuery(["getAll"], () => api.getAll.query("Browser input"))

  if (test.isLoading) return <div>Loading...</div>

  if (test.isError) {
    console.error(test.error)
    return <div>Error...</div>
  }

  return (
    <div>
      <h1>Web App</h1>
      {JSON.stringify(test.data, null, 2)}
    </div>
  )
}

export default App
