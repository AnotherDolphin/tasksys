import React from "react";
import { useState, useEffect } from "react";

export default function TaskHistory(props) {
  const { users, task } = props;

  const [taskHistory, setTaskHistory] = useState([]);

  const getTaskHistory = async () => {
    const response = await fetch(
      `http://localhost:1200/tasks/${task.id}/history`
    );
    const data = await response.json();
    setTaskHistory(data);
  };

  useEffect(() => {
    getTaskHistory();
  }, [task]);

  const [showStatusChanges, setShowStatusChanges] = useState(true);
  const [showAssignmentChanges, setShowAssignmentChanges] = useState(true);
  const filteredTaskHistory = taskHistory.filter((change) => {
    if (change.from_status && !showStatusChanges) {
      return false;
    }
    if (change.assigned_by && !showAssignmentChanges) {
      return false;
    }
    return true;
  });

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <h3>Task History</h3>
      {filteredTaskHistory.length === 0 && <p>No history for this task</p>}
      <div style={{ display: "flex", marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={showStatusChanges}
            onChange={(event) => setShowStatusChanges(event.target.checked)}
          />
          Show status changes
        </label>
        <label>
          <input
            type="checkbox"
            checked={showAssignmentChanges}
            onChange={(event) => setShowAssignmentChanges(event.target.checked)}
          />
          Show assignment changes
        </label>
      </div>
      <div className="task-history">
        {filteredTaskHistory.map((change) => (
          <div key={change.id}>
            <p>{new Date(change.created_at).toLocaleString()}</p>
            {change.from_status && (
              <p>
                Task status changed from <strong>{change.from_status}</strong>{" "}
                to <strong>{change.to_status}</strong>
                <br />
                by {users.find((user) => user.id === change.user_id).username}
              </p>
            )}
            {change.assigned_by && (
              <p>
                Task reassigned from{" "}
                <strong>
                  {
                    users.find((user) => user.id === change.assigned_by)
                      .username
                  }
                </strong>{" "}
                to{" "}
                <strong>
                  {
                    users.find((user) => user.id === change.assigned_to)
                      .username
                  }
                </strong>
                <br />
                by {users.find((user) => user.id === change.user_id).username}
              </p>
            )}
          </div>
        ))}
        <div>
          <p>{new Date(task.created_at).toLocaleString()}</p>
          <p>
            {users.find((user) => user.id == task.created_by).username} created
            this task
          </p>
        </div>
      </div>
    </div>
  );
}
