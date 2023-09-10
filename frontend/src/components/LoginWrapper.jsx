import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import UserSelector from "./UserSelector";
import TaskList from "./TaskList";

export default function LoginWrapper() {
  const { loggedInUser } = useContext(UserContext);
  return <div>{loggedInUser ? <TaskList /> : <UserSelector />}</div>;
}
