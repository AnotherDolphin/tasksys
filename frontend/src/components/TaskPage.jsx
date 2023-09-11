import { UserContext } from "../context/UserContext";
import { TasksContext } from "../context/TasksContext";
import { useContext, useEffect, useState } from "react";
import Task from "./TaskItem";
import TaskHistory from "./TaskHistory";
import withHeader from "../hoc/withHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const statusOptions = [
  "ToDo",
  "InProgress",
  "Blocked",
  "InQA",
  "Done",
  "Deployed",
];

function TaskPage() {
  const { users, loggedInUser } = useContext(UserContext);
  const { tasks, updateStatus, reassginTask } = useContext(TasksContext);

  if (!tasks || !users || tasks.length < 1 || users.length < 1) return null;

  const taskId = window.location.pathname.split("/")[2];
  const task = tasks.find((task) => task.id === Number(taskId));

  // const [assignedTo, setAssignedTo] = useState(task.assigned_to);

  const handleSubmission = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className="tasklist align" style={{ height: "100%" }}>
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <FontAwesomeIcon
              cursor={"pointer"}
              icon={faArrowLeft}
              size="xl"
              onClick={() => (window.location.href = "/")}
            />
            <h3>Task</h3>
          </div>
          <Task
            key={task.id}
            id={task.id}
            name={task.title}
            assigned_to={
              users.find((user) => user.id === task.assigned_to)?.username ?? "Unassigned"
            }
            status={task.status}
            created_by={task.created_by}
            created_at={task.created_at}
          />
        </div>
        <form
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
          onSubmit={(e) => {
            handleSubmission(e);
          }}
        >
          <h3>Actions</h3>
          <label>
            Status&nbsp;&nbsp;&nbsp;&nbsp;
            <select
              value={task.status}
              onChange={(event) =>
                updateStatus(loggedInUser.id, task.id, event.target.value)
              }
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Assigned To:&nbsp;&nbsp;&nbsp;&nbsp;
            <select
              value={task.assigned_to}
              onChange={(event) => {
                reassginTask(loggedInUser.id, task.id, event.target.value);
              }}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </label>
        </form>
        <TaskHistory users={users} task={task} />
      </div>
    </div>
  );
}

export default withHeader(TaskPage, "Task Details");
