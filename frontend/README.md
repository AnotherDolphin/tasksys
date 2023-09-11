### Tasksys frontend (React)

- `/` - Home page
    - if user is not logged in, displays login interface
    - if user is logged in, displays dashboard with tasks
        - using floating action button user can add a task
        - user can click on a task to view details
- `task/:id` - Task page
    - displays task details
    - lets task creator/assignee edit task status or reassign
    - changes are saved in real time and reflected on task history
    - user can click on back button to go back to dashboard
- When logged in, a header is displayed with the page's name, user's name and logout button

### Screenshots

![Login UI](https://i.postimg.cc/dV7xsr50/Screenshot-2023-09-11-181743.png)

![Dashboard page](https://i.postimg.cc/MphrvHLm/Screenshot-2023-09-11-181932.png)

![Task page](https://i.postimg.cc/MZD4dWcz/Screenshot-2023-09-11-182030.png)