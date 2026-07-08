export const returnErrorCode = (errorKey) => {
    if (!Array.isArray(errorKey) || errorKey.length < 2) {
        return false;
    }

    return {code: errorKey[0], message: errorKey[1], data: null};
};

export default returnErrorCode;