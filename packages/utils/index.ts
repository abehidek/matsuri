export const hello = () => console.log("World")

export const $try = async <T>(
  promise: Promise<T>,
): Promise<[T, null] | [null, Error]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (throwable) {
    if (throwable instanceof Error) return [null, throwable];

    throw throwable;
  }
};
