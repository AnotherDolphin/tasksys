import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function withHeader(WrappedComponent, headerText) {
  return function WithHeader(props) {
    const { loggedInUser, setLoggedInUser } = useContext(UserContext);

    function handleLogout() {
      setLoggedInUser(null);
    }

    return (
      <>
        <header className="align" style={{display: "flex", gap: 10, alignItems: 'center', flexWrap: 'wrap'}}>
          <h1>{headerText}</h1>
          <div style={{flex: 1}}></div>
          <p style={{ fontSize: '1.5rem' }}>Welcome, {loggedInUser.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </header>
        <WrappedComponent {...props} />
      </>
    );
  };
}

export default withHeader;
