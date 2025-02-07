
# API Documentation

## 1️⃣ HTTP Routes (REST API)

### Authentication

#### POST /api/v1/signup
- **Request**:
    - Body: 
        - `username`: string (required)
        - `email`: string (required)
        - `password`: string (required)
- **Response**:
    - Status: `201 Created`
    - Body: 
        - `userId`: string
        - `username`: string
        - `email`: string
        - `message`: "User created successfully"

#### POST /api/v1/signin
- **Request**:
    - Body: 
        - `email`: string (required)
        - `password`: string (required)
- **Response**:
    - Status: `200 OK`
    - Body: 
        - `token`: string (JWT token)

### Chat Room Management

#### POST /api/v1/chatroom
- **Request**:
    - Body: 
        - `name`: string (required)
        - `description`: string (optional)
- **Response**:
    - Status: `201 Created`
    - Body: 
        - `roomId`: string
        - `name`: string
        - `description`: string

#### GET /api/v1/chatrooms
- **Request**:
    - Headers: 
        - `Authorization`: Bearer `token`
- **Response**:
    - Status: `200 OK`
    - Body: 
        - `rooms`: array of objects
            - `roomId`: string
            - `name`: string
            - `description`: string

#### POST /api/v1/chatroom/:roomId/join
- **Request**:
    - Headers: 
        - `Authorization`: Bearer `token`
- **Response**:
    - Status: `200 OK`
    - Body: 
        - `message`: "Successfully joined the room"

#### POST /api/v1/chatroom/:roomId/leave
- **Request**:
    - Headers: 
        - `Authorization`: Bearer `token`
- **Response**:
    - Status: `200 OK`
    - Body: 
        - `message`: "Successfully left the room"

#### DELETE /api/v1/chatroom/:roomId
- **Request**:
    - Headers: 
        - `Authorization`: Bearer `AdminToken`
- **Response**:
    - Status: `200 OK`
    - Body: 
        - `message`: "Chat room deleted"

### Messaging

#### POST /api/v1/chatroom/:roomId/message
- **Request**:
    - Headers: 
        - `Authorization`: Bearer `token`
    - Body: 
        - `message`: string (required)
- **Response**:
    - Status: `201 Created`
    - Body: 
        - `messageId`: string
        - `roomId`: string
        - `message`: string

#### GET /api/v1/chatroom/:roomId/messages
- **Request**:
    - Headers: 
        - `Authorization`: Bearer `token`
- **Response**:
    - Status: `200 OK`
    - Body: 
        - `messages`: array of objects
            - `messageId`: string
            - `message`: string
            - `senderId`: string

#### DELETE /api/v1/chatroom/:roomId/message/:messageId
- **Request**:
    - Headers: 
        - `Authorization`: Bearer `AdminToken`
- **Response**:
    - Status: `200 OK`
    - Body: 
        - `message`: "Message deleted"

### User Management

#### GET /api/v1/chatroom/:roomId/users
- **Request**:
    - Headers: 
        - `Authorization`: Bearer `token`
- **Response**:
    - Status: `200 OK`
    - Body: 
        - `users`: array of objects
            - `userId`: string
            - `username`: string
            - `email`: string

#### GET /api/v1/user/:userId
- **Request**:
    - Headers: 
        - `Authorization`: Bearer `token`
- **Response**:
    - Status: `200 OK`
    - Body: 
        - `userId`: string
        - `username`: string
        - `email`: string

#### PUT /api/v1/user/:userId
- **Request**:
    - Headers: 
        - `Authorization`: Bearer `token`
    - Body: 
        - `username`: string (optional)
        - `email`: string (optional)
- **Response**:
    - Status: `200 OK`
    - Body: 
        - `message`: "Profile updated successfully"



### Server-Side (Receiving Events)

#### USER_JOINED
- **Response**:
    - `type`: `USER_JOINED`
    - `payload`: 
        - `roomId`: string
        - `userId`: string
        - `username`: string

#### USER_LEFT
- **Response**:
    - `type`: `USER_LEFT`
    - `payload`: 
        - `roomId`: string
        - `userId`: string

#### CHAT_MESSAGE
- **Response**:
    - `type`: `CHAT_MESSAGE`
    - `payload`: 
        - `roomId`: string
        - `message`: string
        - `senderId`: string

#### TYPING
- **Response**:
    - `type`: `TYPING`
    - `payload`: 
        - `roomId`: string
        - `userId`: string

#### STOP_TYPING
- **Response**:
    - `type`: `STOP_TYPING`
    - `payload`: 
        - `roomId`: string
        - `userId`: string

