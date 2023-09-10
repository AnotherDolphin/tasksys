import LoginWrapper from "./components/LoginWrapper";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TaskDetails from "./components/TaskDetails";
import { UserProvider } from "./context/UserContext";
import { TasksProvider } from "./context/TasksContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginWrapper />,
  },
  {
    path: "/tasks/:id",
    element: <TaskDetails />,
  },
]);

function App() {
  return (
    <UserProvider>
      <TasksProvider>
        {/* <LoginWrapper /> */}
        <RouterProvider router={router} />
      </TasksProvider>
    </UserProvider>
  );
}

export default App;
