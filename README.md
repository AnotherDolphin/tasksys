
## Task Management System

This is a simple task management system built using Node.js, Express.js, React.js and PostgreSQL. User can login with a username, create tasks, assign tasks to other users, update the status of the task and view the history of the task.

- Clone the repository using `git clone`

### Steps to run server (Node.js)

1. Install dependencies using `npm install`
2. Create a postgres database called `tasksys` and update the `db-client.js` file with your username and password
3. Run the DB commands in `up.pgsql` to create the tables
4. Start the server using `npm start` or a dev server using `npm run dev`
5. Run the tests using `npm test`

Find the API documenation in `API.md`

### Steps to run client (React)

1. navigate to the client folder using `cd frontend`
2. Install dependencies using `npm install`
3. Start the client using `npm start`
4. Build the client app using `npm run build`
5. Login using any username (no password required)
6. Create tasks, assign tasks, update status and view history

Find the Frontend guide in `frontend/README.md`
