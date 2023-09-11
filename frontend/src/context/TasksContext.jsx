import React, { createContext, useState, useEffect } from "react";

export const TasksContext = createContext({
  tasks: [],
  removeTask: () => {},
  postTask: (userId, title, description) => {},
  updateStatus: (userId, taskId, newStatus) => {},
  reassginTask: (userId, taskId, newUserId) => {},
});

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:1200/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const postTask = async (userId, title, description) => {
    try {
      const response = await fetch("http://localhost:1200/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, user: userId }),
      });
      const data = await response.json();
      fetchTasks();
      alert("Task created!");
    } catch (error) {
      console.error(error);
    }
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const updateStatus = async (userId, taskId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:1200/tasks/${taskId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            user: userId,
          }),
        }
      );
      const data = await response.json();
      fetchTasks();
      // alert("Status updated!");
    } catch (error) {
      console.error(error);
    }
  };

  const reassginTask = async (userId, taskId, newUserId) => {
    try {
      const response = await fetch(
        `http://localhost:1200/tasks/${taskId}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: userId,
            newUser: newUserId,
          }),
        }
      );
      const data = await response.json();
      fetchTasks();
      // alert("Task reassigned!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        postTask,
        removeTask,
        updateStatus,
        reassginTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
