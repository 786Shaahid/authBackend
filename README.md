# authBackend
hosted link https://authbackend-74z0.onrender.com
# 

### Description

- Sign Up for a user
- Sign In for a user
- CRUD operations on an Asset
- Dashboard to see uploaded pictures

## API Reference

#### URL = https://authbackend-74z0.onrender.com
#### URL= http://localhost:8080 (for Local )

#### Create User

```http
  POST /api/users/signup
```

| Body (application/json) | Type     | Description   |
| :---------------------- | :------- | :------------ |
| `name`                  | `string` | **Required**. |
| `email`                 | `string` | **Unique**. |
| `password`              | `string` | **Password**. |

#### Login

```http
  POST/api/users/signin
```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `email`    | `string` | **Required**. |
| `password` | `string` | **Required**. |

#### Login with OTP using email
## 1. Send OTP to registered email
```http
  POST /api/users/sendmail
```

|  params                    | Type       | Description   |
| :------------------------- | :-------   | :-----------  | 
| `email`                    | `string`   | **Required**. |

## 2. Match OTP For login
```http
  POST /api/users/singinotp
```

|  params                    | Type       | Description   |
| :------------------------- | :-------   | :-----------  | 
| `email`                    | `string`   | **Required**. |

#### Suggestions to make friends

```http
  POST /api/users/getall
```

| Parameter | Type       | Description   |
| :-------- | :--------- | :------------ |
| `userId` | `ObjectId` | **Required**. |


#### Login with Google

```http
  GET /api/users/auth/google/callback
```
#### Login with Facebook

```http
  GET /api/users/auth/facebook/callback
```

#### logout

```http
  GET /api/users/logout
```

| Parameter | Type       | Description   |
| :-------- | :--------- | :------------ |
| `userId`  | `ObjectId` | **Required**. |

#### Update an asset by asset Id

```http
  POST /api/friends/addfriend
```

| Body (application/json) | params    | Type       | Description   |
| :---------------------- | :-------- | :--------- | :------------ |
| `userID`                | `` | `ObjectId` | **Required**. |

#### Delete an asset by asset Id

```http
  DELETE /api/v1/asset/update/:assetId
```

| Parameter | Type       | Description   |
| :-------- | :--------- | :------------ |
| `assetId` | `ObjectId` | **Required**. |



## Environment Variables

To run this project locally, you will need to add the following environment variables to your .env file created in root directory of your project
- DB_URL
- ACCESS_SECRETE_TOKEN_KEY
- REFRESH_SECRETE_TOKEN_KEY
- GMAIL_ACCOUNT
- GMAIL_PASSWORD
- CLIENT_ID
- CLIENT_SECRET
- CALLBACK_URL
- FACEBOOK_APPID
- FACEBOOK_APP_SECRET
- FACEBOOK_CALLBACKURL
- SESSION_SECRET_KEY
- SOCKET_PORT
- PORT

#### Note: Also, you will need to update proxy in vite.config() by localhost:${port_number}

## Screenshots

### Mongo DB record for an asset

![App Screenshot](./screenshots/assetDbRecord.jpg)

### Mongo DB record for an asset soft delete

![App Screenshot](./screenshots/assetSoftDeleteDbRecord.jpg)

### Asset Folder Name as the uploaded folder in AWS S3 Bucket

![App Screenshot](./screenshots/assetBucketRecord.jpg)

## cURL - Refer Api Reference as well

### create a user

```bash
  curl --location 'https://asset-management-0au6.onrender.com/api/v1/user/create' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=****' \
--data-urlencode 'email=******' \
--data-urlencode 'password=*****'
```

### login a user

```bash
  curl --location 'https://asset-management-0au6.onrender.com/api/v1/auth/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=**********' \
--data-urlencode 'password=*******'
```

### create an asset

```bash
 curl --location 'https://asset-management-0au6.onrender.com/api/v1/asset/create/647a68e7be01b54e1ab9dd10' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2E2OGU3YmUwMWI1NGUxYWI5ZGQxHCIsImlhdCI6MTY4NTkxNDc4N30.M1jrZBHBrA7uiqOFydbjZ7hHgMhSEZ0bfJA6Tv6i79Q' \
--form 'folder=@"/D:/Assinments - Company/Terra/Test.zip"' \
--form 'name="hisham"' \
--form 'tags="dasd"' \
--form 'category="asda"'
```
