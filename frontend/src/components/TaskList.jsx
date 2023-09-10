import { useContext } from "react";
import Task from "./TaskItem";
import { Link } from "react-router-dom";
import { TasksContext } from "../context/TasksContext";
import withHeader from "../hoc/withHeader";

function TaskList() {
  const { tasks } = useContext(TasksContext);

  return (
    <div>
      <div className="tasklist align">
        {tasks.map((task) => (
          <Link to={`/tasks/${task.id}`}>
            <Task
              key={task.id}
              id={task.id}
              name={task.title}
              assigned_to={task.user}
              status={task.status}
              created_by={task.created_by}
              created_at={task.created_at}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default withHeader(TaskList, 'Task List');
