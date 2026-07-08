import type { ErrorCode } from "../misc/types.ts";

export const returnErrorCode = (errorKey: ErrorCode) => {
  if (!Array.isArray(errorKey) || errorKey.length < 2) {
    return false;
  }

  return {
    success: false,
    code: errorKey[0],
    data: null,
    message: errorKey[1],
  };
};
