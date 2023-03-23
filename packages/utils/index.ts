import { ZodError, typeToFlattenedError } from "zod";

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

export const formatZodError = (flattened: typeToFlattenedError<any, string>): string => {
  const flattenedFormErrors =  flattened.formErrors.join("\n");
  const flattenedFieldErrors =  Object.keys(flattened.fieldErrors).map(k => {
    return `${k.charAt(0).toUpperCase() + k.slice(1)}: ${flattened.fieldErrors[k]}.`
  }).join("\n");

  return flattenedFieldErrors + "\n" + flattenedFormErrors;
}
