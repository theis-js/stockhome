export const GENERAL_ERROR_CODE = {
    UNEXPECTED_SERVER_ERROR: ["EG001", "Unexpected server error"],
} as const;

export const USER_ERROR_CODE = {
    WRONG_USERNAME_PASSWORD: ["EU001", "Username or password is wrong"],
    USER_IS_DEACTIVATED: ["EU002", "User is deactivated"],
    INVALID_REQUEST_BODY: ["EU003", "Invalid request body. Username and password are required."],
    INVALID_PARAMETERS: ["EU004", "Invalid or missing parameters."],
    TOKEN_GENERATION_FAILED: ["EU005", "Failed to generate user token."],
    LOGIN_FAILED: ["EU006", "Failed to log in user."],
    PASSWORD_CHANGE_FAILED: ["EU007", "Failed to change password."],
    SETTINGS_NOT_UPDATED: ["EU008", "Settings could not be updated."],
    SETTINGS_NOT_FOUND: ["EU009", "Settings could not be retrieved."],
} as const;

export const STORAGE_ERROR_CODE = {
    INVALID_REQUEST_BODY: ["ES001", "Invalid request body"],
    INVALID_PARAMETERS: ["ES002", "Parameter storageUUID or/and parameter values are/is missing."],
    STORAGE_NOT_UPDATED: ["ES003", "Storage is not updated."],
    STORAGE_NOT_DELETED: ["ES004", "Storage is not deleted."],
    NO_STORAGE_LOCATIONS_FOUND: ["ES005", "No storage locations found"],
    STORAGE_NOT_CREATED: ["ES006", "Storage is not created."],
} as const;

export const PRODUCT_ERROR_CODE = {
    PRODUCT_NOT_CREATED: ["EP001", "Error while creating product"],
    NO_PRODUCTS_FOUND: ["EP002", "No products found"],
    PRODUCT_NOT_FOUND: ["EP003", "Product not found"],
    PRODUCT_AMOUNT_NOT_UPDATED: ["EP004", "Error while updating product amount"],
    PRODUCT_NOT_UPDATED: ["EP005", "Error while updating product"],
    PRODUCT_NOT_DELETED: ["EP006", "Error while deleting product"],
    INVALID_REQUEST_BODY: ["EP007", "Invalid request body. Name is required."],
    INVALID_PARAMETERS: ["EP008", "Invalid or missing parameters."],
} as const;