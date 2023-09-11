import React, { useState } from "react";
import "../TaskForm.css";
import { TasksContext } from "../context/TasksContext";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

function TaskForm({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const {loggedInUser} = useContext(UserContext);
  const { postTask } = useContext(TasksContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    postTask(loggedInUser.id, title, description);
    onClose();
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <label htmlFor="description">Description:</label>
          <textarea
            rows={3}
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={{ resize: "none" }} // Add this line
          />
          <button type="submit">Add Task</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
