import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function withHeader(WrappedComponent, headerText) {
  return function WithHeader(props) {
    const { loggedInUser, logout } = useContext(UserContext);
    const navigate = useNavigate();
    console.log("no user");
    useEffect(() => {
      if (!loggedInUser) {
        alert("You must be logged in to view this page");
        navigate("/");
      }
    }, []);
    if (!loggedInUser) return null;

    return (
      <>
        <header
          className="align"
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <h1>{headerText}</h1>
          <div style={{ flex: 1 }}></div>
          <p style={{ fontSize: "1.5rem" }}>
            Welcome, {loggedInUser.username}!
          </p>
          <button
            onClick={() => {
              navigate("/");
              logout();
            }}
          >
            Logout
          </button>
        </header>
        <WrappedComponent {...props} />
      </>
    );
  };
}

export default withHeader;
