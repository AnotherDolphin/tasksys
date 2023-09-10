import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function Task({ id, name, status, assigned_to, created_by, created_at }) {
  const { loggedInUser, users } = useContext(UserContext);
  
  if (!users || !loggedInUser) return null;

  return (
    <div className="task">
      <p>
        <strong>#{id}</strong>
      </p>
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Created by:</strong>{" "}
        {users.find((user) => user.id === created_by).username}
      </p>
      <p>
        <strong>On</strong>{" "}
        {new Date(created_at).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <p>
        <strong>Assigned to:</strong> {assigned_to ?? "No one yet"}
      </p>
    </div>
  );
}

export default Task;
