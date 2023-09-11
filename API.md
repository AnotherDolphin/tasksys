### Tasksys API Documentation

`'/'` root endpoint confirms whether DB connection is established

#### User API

| Endpoint           | Method | Description            |
| ------------------ | ------ | ---------------------- |
| `/users`           | GET    | Get all users          |
| `/users/:username` | GET    | Get a user by username |
| `/users`           | POST   | Create a new user      |

#### Task API

| Endpoint             | Method | Description                 |
| -------------------- | ------ | --------------------------- |
| `/tasks`             | GET    | Get all tasks               |
| `/tasks/:id`         | GET    | Get a task by id            |
| `/tasks`             | POST   | Create a new task           |
| `/tasks/:id/status`  | PUT    | Update status of a task     |
| `/tasks/:id/assign`  | PUT    | Assign a task to a user     |
| `/tasks/:id/history` | GET    | Get history of a task       |
| `/tasks/:id/delete`  | DELETE | Delete a task (for testing) |

#### Examples

For payload examples, check the `examples.rest` file and/or the `test/tasks.test.js` file.

#### Constraints

- A user can only assign a task to another user if they are the creator of the task, or if they are the current assignee of the task.
- A user can only update the status of a task if they are the creator of the task, or if they are the current assignee of the task.
- A user identifies themselves by their username in the client, and the frontend uses their id to make requests to the backend.
