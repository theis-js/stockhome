export type ApiError = Error & { code?: string };

export const createApiError = (
  code?: string,
  message: string = "Request failed",
): ApiError => {
  const error = new Error(message) as ApiError;
  error.code = code || "unknown-error";
  return error;
};
