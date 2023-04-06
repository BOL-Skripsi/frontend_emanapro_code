import React from "react";
import Header from "./main/Header";
import SideNav from "./main/SideNav";
import Footer from "./main/Footer";
import Home from "./main/Home";
import Kpi from "../Pages/Auth/Kpi/index";
import KpiReview from "../Pages/Auth/Kpi_review/index";
import KpiAssessment from "../Pages/Auth/Kpi_assessment/index";
import Rubric from "../Pages/Auth/Rubric/index";
import RubricReview from "../Pages/Auth/Rubric_review/index";
import Team from "../Pages/Auth/Team/index";
import TeamManagement from "../Pages/Auth/Team_management/index";
import Task from "../Pages/Auth/Task/index";
import TaskManagement from "../Pages/Auth/Task_management/index";
import TaskChecking from "../Pages/Auth/Task-Checking/index";
import Employee from "../Pages/Auth/Employee/index";
import Change from "../Pages/Auth/Change_password/index";

function AuthLayout(props) {
  let content;

  switch (props.page) {
    case "kpi":
      content = <Kpi />;
      break;
    case "kpi_review":
      content = <KpiReview />;
      break;
    case "kpi_assessment":
      content = <KpiAssessment />;
      break;
    case "rubric":
      content = <Rubric />;
      break;
    case "rubric_review":
      content = <RubricReview />;
      break;
    case "team":
      content = <Team />;
      break;
    case "team_management":
      content = <TeamManagement />;
      break;
    case "task":
      content = <Task />;
      break;
    case "task_management":
      content = <TaskManagement />;
      break;
    case "task-checking":
      content = <TaskChecking />;
      break;
    case "employee":
      content = <Employee />;
      break;
    case "change_password":
      content = <Change />;
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
