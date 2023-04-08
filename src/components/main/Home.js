import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import Cookies from "js-cookie";
const Home = () => {
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [roles, setRoles] = useState([]);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${Cookies.get("_auth")}`,
          },
        };
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/organization/${userId}/${orgId}/roles`,
          config
        );
        setRoles(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete project proposal",
      description:
        "Write a proposal for the new project by the end of the week",
      team: "Marketing",
    },
    {
      id: 2,
      title: "Update website content",
      description: "Update the website with new product information and images",
      team: "Web Development",
    },
    {
      id: 3,
      title: "Prepare for meeting",
      description: "Prepare presentation slides for the upcoming meeting",
      team: "Sales",
    },
  ]);

  const renderManagerCard = () => {
    return (
      <div className="row">
        {/* <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Task List To Approve</h3>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {tasks.map((task) => (
                  <li key={task.id} className="list-group-item">
                    <div className="row">
                      <div className="col-md-8">
                        <h5>{task.title}</h5>
                        <p>{task.description}</p>
                        <p>Assigned to: {task.team}</p>
                      </div>
                      <div className="col-md-4 text-right">
                        <button className="btn btn-primary">Approve</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">News</h3>
            </div>
            <div className="card-body">
              <p className="card-text">HRD Has Set New Period For KPI</p>
              <a
                href="#"
                className="btn btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                Learn More
              </a>
            </div>
          </div>
        </div> */}
      </div>
    );
  };

  const renderEmployeeCard = () => {
    return (
      <div className="col-lg-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Completed Tasks</h3>
          </div>
          <div className="card-body">
            <p>View your completed tasks and progress.</p>
            <NavLink
              to="/completed-tasks"
              className="btn btn-primary"
              activeClassName="active"
            >
              View Completed Tasks
            </NavLink>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Dashboard</h1>
              </div>
              {/* /.col */}
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </div>
          {/* /.container-fluid */}
        </div>
        {/* /.content-header */}
        {/* Main content */}
        <section className="content">
          <div className="container-fluid">
            {/* Small boxes (Stat box) */}
            <div className="row">
              {roles.organization_role === "manager" && renderManagerCard()}
              {roles.organization_role === "employee" && renderEmployeeCard()}
            </div>
            {/* /.row (main row) */}
          </div>
          {/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
    </div>
  );
};

export default Home;
