import { useMutation, useQuery } from "@tanstack/react-query";
import { authClient } from "auth-sdk";
import { Link } from "react-router-dom";
import clsx from 'clsx';

type Props = {
  title: string;
  href: string;
  children: React.ReactNode;
};

type SidebarItem = {
  title: string;
  href: string;
} | {
  title: string;
  onClick: () => void;
};

export const Sidebar: React.FC<{ href: string }> = (props) => {
  const user = useQuery(["me"], () => authClient.me({}))

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

  const signInOrSignOut = user.data?.ok ? {
    title: "Sign Out",
    onClick: signOut.mutate
  } : {
    title: "Sign In",
    href: "/signin",
  } as const

  const sidebarItems: SidebarItem[] = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "New note",
      href: "/notes/new"
    },
    signInOrSignOut
  ]

  return (
    <div className="sticky top-[6rem]">
      <div className="flex flex-col gap-3">
        {sidebarItems.map(item =>
          <div key={item.title}>
            {"href" in item
              ? <Link
                className={clsx("rounded-md cursor-pointer w-full hover:bg-slate-300 py-1 px-4 flex", {
                  "bg-slate-100 font-bold": item.href === props.href
                })}
                to={item.href}
              >
                <p className="w-full whitespace-nowrap">{item.title}</p>
              </Link>
              : <div
                className="rounded-md cursor-pointer w-full hover:bg-slate-300 py-1 px-4 flex"
                onClick={item.onClick}
              >
                <p className="w-full whitespace-nowrap">{item.title}</p>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  )
}

export const BaseLayout: React.FC<Props> = (props) => {
  return (
    <div className="h-screen">
      <div className="mx-auto max-w-3xl flex gap-8 min-h-full items items-stretch mt-8">
        <div className="order-1 flex-[0_0_0px]">
          <Sidebar href={props.href} />
        </div>
        <main className="order-2 w-full mt-10">
          {props.children}
        </main>
        <div className="order-3 flex-[0_0_0px]">
          <h1 style={{
            writingMode: "vertical-lr"
          }} className="flex font-bold text-3xl sticky top-[6rem] whitespace-nowrap bg-black text-white p-1">{props.title}</h1>
        </div>
      </div>
    </div>
  )
}
