import { env } from 'env'

const App: React.FC = () => {
  console.log("environment variables:", env);
  return (
    <div>
      <h1>Web App</h1>
    </div>
  )
}

export default App
