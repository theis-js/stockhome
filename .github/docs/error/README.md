# Errors

Here you will find all Error codes and its meaning. Error or status codes that are starting with an s are success codes.

## Error codes

### `eu006`

**Meaning:** There is an error while changing the password. _HTTP-Code: **406**_

**Solution:** Make sure that you have entered the correct previous password and that the double check passwords are matching.

### `eu004`

**Meaning:** There is an error while updating the settings. _HTTP-Code: **500**_

**Solution:** This error should not occur in the frontend. If so, please create an issue in this repository.

### `eu005`

**Meaning:** There is an error while fetching the app settings. _HTTP-Code: **500**_

**Solution:** This error should not occur in the frontend. If so, please create an issue in this repository.

### `eu001`

**Meaning:** Username or password is wrong. _HTTP-Code: **404**_

**Solution:** Check the username and password and try again.

### `eu002`

**Meaning:** The user is deactivated. _HTTP-Code: **403**_

**Solution:** Contact an admin to reactivate the account.

### `eu003`

**Meaning:** There is an error while updating the last login timestamp. _HTTP-Code: **500**_

**Solution:** This error should not occur in the frontend. If so, please create an issue in this repository.

### `ep001`

**Meaning:** There is an error while creating a product. _HTTP-Code: **406**_

**Solution:** Verify that all required fields are provided and valid, then try again.

### `ep002`

**Meaning:** There is an error while fetching products. _HTTP-Code: **406**_

**Solution:** Try again later. If the error persists, create an issue in this repository.

### `ep003`

**Meaning:** There is an error while fetching a product. _HTTP-Code: **406**_

**Solution:** Ensure the product exists and try again.

### `ep004`

**Meaning:** There is an error while updating the product amount. _HTTP-Code: **406**_

**Solution:** Check the amount value and try again.

### `ep005`

**Meaning:** There is an error while updating a product. _HTTP-Code: **406**_

**Solution:** Verify the product data and try again.

### `ep006`

**Meaning:** There is an error while deleting products. _HTTP-Code: **500**_

**Solution:** Try again later. If the error persists, create an issue in this repository.

### `es001`

**Meaning:** There is an error while fetching storage locations. _HTTP-Code: **500**_

**Solution:** Try again later. If the error persists, create an issue in this repository.

### `es000`

**Meaning:** The request body is invalid. _HTTP-Code: **400**_

**Solution:** Provide a storage name. The description is optional.

### `es002`

**Meaning:** There is an error while creating a storage location. _HTTP-Code: **500**_

**Solution:** Try again later. If the error persists, create an issue in this repository.

### `es003`

**Meaning:** There is an error while updating a storage location. _HTTP-Code: **500**_

**Solution:** Try again later. If the error persists, create an issue in this repository.

### `es004`

**Meaning:** There is an error while deleting a storage location. _HTTP-Code: **500**_

**Solution:** Try again later. If the error persists, create an issue in this repository.
