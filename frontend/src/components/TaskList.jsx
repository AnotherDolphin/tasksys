import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import Task from "./TaskItem";
import { TasksContext } from "../context/TasksContext";
import withHeader from "../hoc/withHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskForm from "./TaskForm";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function TaskList() {
  const { tasks } = useContext(TasksContext);
  const [showForm, setShowForm] = useState(false);
  const orderedTasks = tasks.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="tasklist align">
        {orderedTasks.map((task) => (
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
      <button className="add-button" onClick={handleAddClick}>
        <FontAwesomeIcon
          icon={faPlus}
          size="2xl"
          style={{ color: "#ffffff" }}
        />
      </button>
      {showForm && <TaskForm onClose={handleFormClose} />}
    </div>
  );
}

export default withHeader(TaskList, "Task List");
