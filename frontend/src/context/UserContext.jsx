import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({
  users: [],
  loggedInUser: null,
  login: () => {},
  logout: () => {},
});

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) || null
  );


  const getAllUsers = () => {
    fetch("http://localhost:1200/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error(error));
  };

  const register = (username) => {
    fetch("http://localhost:1200/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => setLoggedInUser(data))
      .catch((error) => console.error(error));
  };

  const login = (username) => {
    const user = users.find((user) => user.username === username);
    if (user) {
      setLoggedInUser(user);
    } else {
      register(username);
    }
  };

  const logout = () => {
    // window.location.href = "/";4
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
    // return home
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (loggedInUser)
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  }, [loggedInUser]);

  return (
    <UserContext.Provider
      value={{
        users,
        loggedInUser,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
