type ErrorProps = {
  message: string;
  action?: React.ReactNode;
};

export const Error: React.FC<ErrorProps> = (props) => {
  return (
    <div className="text-center flex flex-col gap-3 items-center justify-center w-full h-full">
      <h1 className="font-bold text-xl">Something wront happened!</h1>
      <h3 className="text-lg">{props.message}</h3>
      <div>
        {props.action}
      </div>
    </div>
  )
}
