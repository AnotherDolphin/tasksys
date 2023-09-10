import LoginWrapper from "./components/LoginWrapper";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
