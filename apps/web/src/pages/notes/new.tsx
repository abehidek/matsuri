import { env } from "env";
import { BaseLayout } from "../../components/BaseLayout"

const NewNote: React.FC = () => {
  return (
    <BaseLayout href="/notes/new" title="New">
      <h3>Add a new note</h3>
    </BaseLayout>
  )
}

export default NewNote;
