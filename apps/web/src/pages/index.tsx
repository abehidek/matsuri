import { useMutation, useQuery } from '@tanstack/react-query';
import { LogClient } from 'log-sdk';
import { authClient } from "auth-sdk";
import { OptionalLayout } from '../components/AuthLayout';
import { Link } from 'react-router-dom';
import { Button } from 'ui'
import { BaseLayout } from '../components/BaseLayout';

const logger = new LogClient({
  appName: "web",
});

const App: React.FC = () => {
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
    <BaseLayout title='Home' href='/'>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, facere quo pariatur, quae soluta iure praesentium dolorem accusamus inventore perspiciatis laboriosam, modi id veniam. Doloremque, aliquam officia? Laboriosam, ipsum quisquam.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Et pariatur similique aperiam illum doloremque delectus non, maxime distinctio velit iusto nam quibusdam. Officiis possimus dicta obcaecati eveniet beatae quasi accusamus.
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid pariatur voluptatibus excepturi enim debitis et possimus. Minus voluptatibus voluptatum accusantium iure debitis quo suscipit unde a officiis, dicta totam sint?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, earum molestias autem accusamus nihil expedita iste repudiandae labore sunt mollitia enim ducimus blanditiis accusantium libero iure suscipit placeat eveniet tempore!
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, facere quo pariatur, quae soluta iure praesentium dolorem accusamus inventore perspiciatis laboriosam, modi id veniam. Doloremque, aliquam officia? Laboriosam, ipsum quisquam.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Et pariatur similique aperiam illum doloremque delectus non, maxime distinctio velit iusto nam quibusdam. Officiis possimus dicta obcaecati eveniet beatae quasi accusamus.
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid pariatur voluptatibus excepturi enim debitis et possimus. Minus voluptatibus voluptatum accusantium iure debitis quo suscipit unde a officiis, dicta totam sint?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, earum molestias autem accusamus nihil expedita iste repudiandae labore sunt mollitia enim ducimus blanditiis accusantium libero iure suscipit placeat eveniet tempore!
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, facere quo pariatur, quae soluta iure praesentium dolorem accusamus inventore perspiciatis laboriosam, modi id veniam. Doloremque, aliquam officia? Laboriosam, ipsum quisquam.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Et pariatur similique aperiam illum doloremque delectus non, maxime distinctio velit iusto nam quibusdam. Officiis possimus dicta obcaecati eveniet beatae quasi accusamus.
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid pariatur voluptatibus excepturi enim debitis et possimus. Minus voluptatibus voluptatum accusantium iure debitis quo suscipit unde a officiis, dicta totam sint?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, earum molestias autem accusamus nihil expedita iste repudiandae labore sunt mollitia enim ducimus blanditiis accusantium libero iure suscipit placeat eveniet tempore!
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, quos. Fugiat, dolor accusamus tempore deserunt minus eveniet amet quas voluptate enim sapiente quidem voluptas, quaerat at soluta perspiciatis labore consequuntur?
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias architecto nostrum autem excepturi maxime. Recusandae animi eius aspernatur itaque quas alias molestiae, in et facere. Cum esse autem minus praesentium.
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, corrupti error. Ratione a magni temporibus similique? Ad excepturi deleniti ipsum. Reiciendis possimus et laboriosam nemo minima quisquam ab facere obcaecati!
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor sit, dolore minima qui, tempora, provident quibusdam quasi corporis ratione explicabo inventore atque consectetur earum odio vero. Aspernatur qui odio saepe.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perspiciatis quos modi cum ipsum unde tenetur soluta, explicabo at magnam suscipit quaerat nobis perferendis iste, ab ipsam officia quae, nisi deserunt.
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil expedita dolore, temporibus voluptatem quia dicta repellendus minus iusto autem atque corrupti quisquam nemo quas beatae eveniet dolorum dolor ullam fugit.

    </BaseLayout>
  )
}

export default App
