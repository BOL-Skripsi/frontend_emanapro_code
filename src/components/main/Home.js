import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import Cookies from "js-cookie";
import ReactSpeedometer from "react-d3-speedometer";
import Select from "react-select";

const Home = () => {
  const periods = [
    { value: "Q1 2023", label: "Q1 2023" },
    { value: "Q2 2023", label: "Q2 2023" },
    { value: "Q3 2023", label: "Q3 2023" },
    { value: "Q4 2023", label: "Q4 2023" },
  ];
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [roles, setRoles] = useState([]);
  const [activeLink, setActiveLink] = useState("");
  const [period, setPeriod] = useState(periods[0]);
  const [score, setScore] = useState(3);

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
        <div className="col-lg-6">
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
      </div>
    );
  };

  const renderEmployeeCard = () => {
    const handlePeriodChange = (selectedOption) => {
      setPeriod(selectedOption);
      setScore(Math.floor(Math.random() * 5) + 1);
    };

    return (
      <div className="row">
        <div className="col-lg-3">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center"  style={{ height: "60px" }}>
              <h3 className="card-title">Your Performance Score</h3>
              <Select
                value={period}
                onChange={handlePeriodChange}
                options={periods}
              />
            </div>

            <div className="card-body text-center" style={{ height: "250px" }}>
              <ReactSpeedometer
                maxValue={5}
                width={250}
                value={score}
                needleHeightRatio={0.7}
                valueFormat=".2"
                needleColor="black"
                segments={5}
                segmentColors={[
                  "#ff0000",
                  "#ffa700",
                  "#fff400",
                  "#a3ff00",
                  "#2cba00",
                ]}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="card">
            <div  className="card-header d-flex justify-content-between align-items-center" style={{ height: "60px" }}>
              <h3 className="card-title">News & Notification</h3>
            </div>
            <div className="card-body" style={{ height: "250px" }}></div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">My Tasks</h3>
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
      </div>
    );
  };

  return (
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
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                {/* <div className="card-header">
                  <div className="card-tools">
                    <div>
                    </div>
                  </div>
                </div> */}
                <div className="card-body">
                  {roles.organization_role === "manager" && renderManagerCard()}
                  {roles.organization_role === "employee" &&
                    renderEmployeeCard()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
