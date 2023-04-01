import React from "react";
import Header from "./main/Header";
import SideNav from "./main/SideNav";
import Footer from "./main/Footer";
import Home from "./main/Home";
import Kpi from "../Pages/Auth/Kpi/index";
import Rubric from "../Pages/Auth/Rubric/index";
import Team from "../Pages/Auth/Team/index";
import Task from "../Pages/Auth/Task/index";
import TaskChecking from "../Pages/Auth/Task-Checking/index";
import Employee from "../Pages/Auth/Employee/index";

function AuthLayout(props) {
  let content;

  switch (props.page) {
    case "kpi":
      content = <Kpi />;
      break;
    case "rubric":
      content = <Rubric />;
      break;
    case "team":
      content = <Team />;
      break;
    case "task":
      content = <Task />;
      break;
    case "task-checking":
      content = <TaskChecking />;
      break;
    case "employee":
      content = <Employee />;
      break;
    default:
      content = <Home />;
  }

  return (
    <>
      <Header />
      <SideNav />
      {content}
      <Footer />
    </>
  );
}

export default AuthLayout;
