# A User
## POST /users
Creates a User
### Request data
#### Body
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@wolox.com.ar",
  "password": "johndoepwd"
}
```
### Response data
#### Status: 201
#### Headers
```json
{
  "contentType": "application/json"
}
```
#### Body
```json
{
  "id": 1
}
```
## GET /users/:id
Retrives user by given id
### Request data
### Response data
#### Status: 200
#### Headers
```json
{
  "contentType": "application/json"
}
```
#### Body
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@wolox.com.ar"
}
```
