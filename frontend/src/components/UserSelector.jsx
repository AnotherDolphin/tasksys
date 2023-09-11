import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function UserSelector() {
  const { users, login } = useContext(UserContext);
  const [username, setUsername] = useState("");

  return (
    <div className="login-wrapper">
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: 24,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {users.map((user) => {
          return (
            <button key={user.id} onClick={() => login(user.username)}>
              {user.username}
            </button>
          );
        })}
      </div>
      Or enter your username:
      <form
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
        onSubmit={(e) => {
          e.preventDefault();
          login(username);
        }}
      >
        <label style={{ alignSelf: "center" }}>
          Username:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <button type="submit">Login</button>
        <p style={{ opacity: 0.7 }}>
          entering a new username will create a user account
        </p>
      </form>
    </div>
  );
}
