# Task Management API

This is a simple Task Management API built using Express.js and MySQL. The API allows users to manage tasks and users, including creating, updating, deleting, and searching for tasks and users. Additionally, it provides an endpoint to fetch zmanim (Jewish prayer times) using the Hebcal API.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Tasks](#tasks)
  - [Users](#users)
  - [Zmanim](#zmanim)
- [Configuration](#configuration)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-management-api.git
   cd task-management-api```
2. Install dependencies:
      ```npm install```
3. Set up your MySQL database and update the config/config.js file with your database credentials.

4. Run the server:
   ```npm start```
   
## Usage
The API will be running on http://localhost:3000 by default. You can use tools like Postman or curl to interact with the API.

## API Endpoints
### Tasks
Mark a Task as Completed
POST /tasks/complete

#### Request Body:
   ```json
   {
    "userId": "123", 
    "taskName": "Complete API documentation"
   }
   ```
#### Response:
```json
  {
   "success": true, 
    "data": { /* task data */ }, 
    "message": "Task marked as completed successfully"
  }
```

### Search Tasks
GET /tasks/search

#### Query Parameters:

userId (optional)

startDate (optional)

endDate (optional)

#### Response:

```json
{
  "success": true,
  "data": [ /* array of tasks */ ],
  "count": 5,
  "query": {
    "userId": "123",
    "startDate": "2023-10-01",
    "endDate": "2023-10-31"
}
```

### Search Tasks with User Information

GET /tasks/searchWithUser

#### Query Parameters:

userId (optional)

startDate (optional)

endDate (optional)

#### Response:
```json
{
  "success": true,
  "data": [ /* array of tasks with user info */ ],
  "count": 5,
  "query": {
    "userId": "123",
    "startDate": "2023-10-01",
    "endDate": "2023-10-31"
  }
}
```

### Delete a Task
DELETE /tasks/delete

#### Request Body:
```json
{
  "userId": "123",
  "taskId": "456"
}
```

#### Response:
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```









