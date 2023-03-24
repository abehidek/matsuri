export const Loading: React.FC = () => {
  return (
    <div className="text-center flex flex-col gap-3 items-center justify-center w-full h-full">
      <div
        className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export const LoadingPage: React.FC = () => (
  <div className="w-full h-screen">
    <Loading />
  </div>
)
