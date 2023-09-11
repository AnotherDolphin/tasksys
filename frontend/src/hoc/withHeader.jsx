import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function withHeader(WrappedComponent, headerText) {
  return function WithHeader(props) {
    const { loggedInUser, logout } = useContext(UserContext);

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
          <button onClick={logout}>Logout</button>
        </header>
        <WrappedComponent {...props} />
      </>
    );
  };
}

export default withHeader;
