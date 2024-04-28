# ConnectifyServer

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
##### 1. Send OTP to registered email
```http
  POST /api/users/sendmail
```

|  params                    | Type       | Description   |
| :------------------------- | :-------   | :-----------  | 
| `email`                    | `string`   | **Required**. |

##### 2. Match OTP For login
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

#### Make Friends

```http
  POST /api/friends/addfriend
```

| Body (application/json) | Type       | Description   |
| :---------------------- | :--------- | :------------ |
| `userId`                | `ObjectId` | **Required**. |
| `friendId`              | `ObjectId` | **Required**. |

#### Remove Friends

```http
  POST /api/friends/removefriend
```

| Body       | Type       | Description   |
| :--------  | :--------- | :------------ |
| `friendId` | `ObjectId` | **Required**. |

#### Accept Friend Request

```http
  POST /api/friends/acceptfriend
```

| Body       | Type       | Description   |
| :--------  | :--------- | :------------ |
| `friendId` | `ObjectId` | **Required**. |

#### Get All Friend Request For User 

```http
  GET /api/friends/getAllFriendRequest
```

| Parameter      | Type       | Description   |
| :--------  | :--------- | :------------ |
| `userId` | `ObjectId` | **Required**. |

#### Get All Friend Of User 

```http
  GET /api/friends/friendlist
```

| Parameter      | Type       | Description   |
| :--------  | :--------- | :------------ |
| `userId` | `ObjectId` | **Required**. |



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

#### Note: Also, you will need to update proxy in package.json of react app by localhost:${port_number}



