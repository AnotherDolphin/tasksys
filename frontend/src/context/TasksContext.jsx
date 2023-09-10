import React, { createContext, useState, useEffect } from "react";

export const TasksContext = createContext({
  tasks: [],
  addTask: () => {},
  removeTask: () => {},
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

  const addTask = (task) => {
    setTasks([...tasks, task]);
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
      // setTasks(tasks.map((task) => (task.id === taskId.id ? taskId : task)));
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, removeTask, updateStatus, reassginTask }}
    >
      {children}
    </TasksContext.Provider>
  );
};