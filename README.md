# Simple-CRUD-API
NodeJS CRUD API

## Run the Project

1. Clone the repository with the following command:
```bash
git clone https://github.com/BondPV/simple-CRUD-api.git
```
2. Open the project directory.
3. Install all required packages by running the following command: 
``` bash
npm install
```
4. Use the following commands:

Launches the development version of the API with nodemon for automatic reloading on file changes.
``` bash
start:dev
```
Compiles TypeScript files into the dist folder for production and runs them with Node.js.
``` bash
start:prod:
```
Starts a multi-threaded server using Node.js Cluster API, balancing load across instances.
```bash
start:multi
```
Runs tests using Jest.
```bash
test
```

## Details

The implemented endpoint is `api/users`:
- **GET** `api/users`: Retrieves all user records from the database.
- **GET** `api/users/{userId}`: Fetches a specific user record by ID.
- **POST** `api/users`: Creates a new user record.
- **PUT** `api/users/{userId}`: Updates an existing user record.
- **DELETE** `api/users/{userId}`: Removes a user record.

User records consist of the following properties:
- `id`: Unique identifier (UUID) generated on the server side.
- `username`: User's name (string, required).
- `age`: User's age (number, required).
- `hobbies`: User's hobbies (array of strings or empty array, required).  

Requests to non-existing endpoints will be handled with a `404 Not Found` response.  
Errors on the server side will be handled with a `500 Internal Server Error` response.  
