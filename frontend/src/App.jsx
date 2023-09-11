import LoginWrapper from "./components/LoginWrapper";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import TaskPage from "./components/TaskPage";
import { UserProvider } from "./context/UserContext";
import { TasksProvider } from "./context/TasksContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginWrapper />,
  },
  {
    path: "/tasks/:id",
    element: <TaskPage />,
  },
  {
    path: "*",
    element: <Navigate replace to={'/'} />,
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
