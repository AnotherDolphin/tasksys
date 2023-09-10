import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function UserSelector() {
  const { users, login } = useContext(UserContext);
  const [username, setUsername] = useState("");

  return (
    <div className="login-wrapper">
      <div style={{ display: "flex", gap: "1rem" }}>
        {users.map((user) => {
          return (
            <button key={user.id} onClick={() => login(user.username)}>
              {user.username}
            </button>
          );
        })}
      </div>
      Or register a new user:
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(username);
        }}
      >
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
