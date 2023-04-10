import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import Cookies from "js-cookie";
import ReactSpeedometer from "react-d3-speedometer";
import Select from "react-select";
import DataTable from "react-data-table-component";

const Home = () => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7); // Add 7 hours to the date
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    };
    return date.toLocaleDateString("en-US", options);
  };
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [roles, setRoles] = useState([]);
  const [allKpiData, setAllKpiData] = useState([
    { team_name: "BACKEND DEV", manager_name: "Dixon", team_kpi_score: 4.34 },
    { team_name: "BACKEND DEV", manager_name: "Dixon", team_kpi_score: 4.34 },
    { team_name: "BACKEND DEV", manager_name: "Dixon", team_kpi_score: 4.34 },
    { team_name: "BACKEND DEV", manager_name: "Dixon", team_kpi_score: 4.34 },
  ]);
  const [activeLink, setActiveLink] = useState("");
  const [period, setPeriod] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [hrdPerformanceData, setHrdPerformanceData] = useState([]);
  const [hrdRubricData, setHrdRubricData] = useState([]);
  const [hrdScore, setHrdScore] = useState(0);


  const [managerPerformanceData, setManagerPerformanceData] = useState([]);
  const [managerTaskData, setManagerTaskData] = useState([]);
  const [managerAssessmentData, setManagerAssessmentData] = useState([]);
  const [managerScore, setManagerScore] = useState(0);


  const [employeePerformanceData, setEmployeePerformanceData] = useState([]);
  const [employeeOngoingData, setEmployeeOngoingData] = useState([]);
  const [employeeTaskData, setEmployeeTaskData] = useState([]);
  const [employeeScore, setEmployeeScore] = useState(0);

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

  const fetchKpiPeriod = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/kpi/period/`,
        config
      );
      const transformedData = response.data.map((item) => ({
        value: item.uuid,
        label: item.kpi_period,
      }));
      setPeriod(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHrdPerformanceData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/dashboard/hrd/kpi/`,
        config
      );
      const averageScore =
        response.data.reduce((total, item) => {
          return total + parseFloat(item.final_score);
        }, 0) / response.data.length;
      setHrdScore(averageScore);
      setHrdPerformanceData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHrdRubricData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/dashboard/hrd/rubric`,
        config
      );
      setHrdRubricData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchManagerPerformanceData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/dashboard/manager/kpi/${userId}`,
        config
      );
      const averageScore =
        response.data.reduce((total, item) => {
          return total + parseFloat(item.final_score);
        }, 0) / response.data.length;
      setManagerScore(averageScore);
      setManagerPerformanceData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchManagerTaskData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/dashboard/manager/task/${userId}`,
        config
      );
      setManagerTaskData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchManagerAssessmentData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/dashboard/manager/assessment/${userId}`,
        config
      );
      setManagerAssessmentData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployeePerformanceData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/dashboard/employee/kpi/${userId}`,
        config
      );
      const averageScore =
        response.data.reduce((total, item) => {
          return total + parseFloat(item.final_score);
        }, 0) / response.data.length;
      setEmployeeScore(averageScore);
      setEmployeePerformanceData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployeeOngoingData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/dashboard/employee/ongoing/${userId}`,
        config
      );
      setEmployeeOngoingData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployeeMyTaskData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/dashboard/employee/task/${userId}`,
        config
      );
      setEmployeeTaskData(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchHrdPerformanceData();
    fetchHrdRubricData();
    fetchManagerPerformanceData();
    fetchManagerTaskData();
    fetchManagerAssessmentData();
    fetchEmployeePerformanceData();
    fetchEmployeeOngoingData();
    fetchEmployeeMyTaskData();
    fetchKpiPeriod();
    fetchData();
  }, [userId]);

  const renderManagerCard = () => {

    const handlePeriodChange = (selectedOption) => {
      // setScore(Math.floor(Math.random() * 5) + 1);
    };

    const columns = [
      {
        name: "Team Name",
        selector: "name",
        sortable: true,
      },
      {
        name: "Final Score",
        selector: "final_score",
        sortable: true,
      },
    ];

    const columnsTask = [
      {
        name: "Task Name",
        selector: "team_name",
        sortable: true,
      },
      {
        name: "Task Category",
        selector: "manager_name",
        sortable: true,
      },
      {
        name: "Assign To",
        selector: "manager_name",
        sortable: true,
      },
      {
        name: "Due Date",
        selector: "team_kpi_score",
        sortable: true,
      },
    ];

    const columnsAssessment = [
      {
        name: "Team Name",
        selector: "team_name",
        sortable: true,
      },
      {
        name: "Assessment Progress",
        selector: "manager_name",
        sortable: true,
      },
      {
        name: "Final Score",
        selector: "team_kpi_score",
        sortable: true,
      },
    ];

    const customStyles = {
      headCells: {
        style: {
          border: "1px dotted black",
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      cells: {
        style: {
          border: "1px dotted black",
        },
      },
    };

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div
              className="card-header"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "60px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 className="card-title" style={{ margin: "0" }}>
                  My Team Performance
                </h3>
              </div>
              <div style={{ paddingLeft: "20px", width: "200px" }}>
                <Select
                  value={period}
                  onChange={handlePeriodChange}
                  options={period}
                />
              </div>
            </div>

            <div className="card-body">
              <div className="row">
                <div
                  className="col-lg-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ReactSpeedometer
                    maxValue={5}
                    width={250}
                    height={250}
                    value={managerScore}
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
                <div
                  className="col-lg-9"
                  style={{ maxHeight: "250px", overflowY: "auto" }}
                >
                  <DataTable
                    columns={columns}
                    data={managerPerformanceData}
                    noHeader
                    pagination
                    customStyles={customStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="card">
            <div
              className="card-header"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "60px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 className="card-title" style={{ margin: "0" }}>
                  Task To Approve
                </h3>
              </div>
              <div style={{ paddingLeft: "18px", width: "200px" }}>
                <NavLink
                  to="/rubric_review"
                  className="btn btn-primary"
                  activeClassName="active"
                  onClick={() => setActiveLink("rubric_review")}
                >
                  View Task Management
                </NavLink>
              </div>
            </div>
            <div className="card-body">
              <DataTable
                columns={columnsTask}
                data={allKpiData}
                noHeader
                pagination
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="card">
            <div
              className="card-header"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "60px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 className="card-title" style={{ margin: "0" }}>
                  Assessment Progress
                </h3>
              </div>
              <div style={{ paddingLeft: "30px", width: "200px" }}>
                <Select
                  value={period}
                  onChange={handlePeriodChange}
                  options={period}
                />
              </div>
              <div style={{ paddingLeft: "30px", width: "200px" }}>
                <NavLink
                  to="/kpi_review"
                  className="btn btn-primary"
                  activeClassName="active"
                  onClick={() => setActiveLink("kpi_review")}
                >
                  View KPI Assessment
                </NavLink>
              </div>
            </div>
            <div className="card-body">
              <DataTable
                columns={columnsAssessment}
                data={allKpiData}
                noHeader
                pagination
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHrdCard = () => {
   
    const handlePeriodChange = (selectedOption) => {
      // setScore(Math.floor(Math.random() * 5) + 1);
    };

    const columns = [
      {
        name: "Team Name",
        selector: "name",
        sortable: true,
      },
      {
        name: "Manager",
        selector: "manager_name",
        sortable: true,
      },
      {
        name: "Final Score",
        selector: "final_score",
        sortable: true,
      },
    ];

    const columnsRubric = [
      {
        name: "Rubric Metric",
        selector: "rubric_name",
        sortable: true,
      },
      {
        name: "Proposed By",
        selector: "manager_name",
        sortable: true,
      },
      {
        name: "Affected Team",
        selector: "team_name",
        sortable: true,
      },
    ];

    const customStyles = {
      headCells: {
        style: {
          border: "1px dotted black",
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      cells: {
        style: {
          border: "1px dotted black",
        },
      },
    };

    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div
              className="card-header"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "60px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 className="card-title" style={{ margin: "0" }}>
                  All Team Performance
                </h3>
              </div>
              <div style={{ paddingLeft: "20px", width: "200px" }}>
                <Select
                  value={period}
                  onChange={handlePeriodChange}
                  options={period}
                />
              </div>
            </div>

            <div className="card-body">
              <div className="row">
                <div
                  className="col-lg-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ReactSpeedometer
                    maxValue={5}
                    width={250}
                    height={250}
                    value={hrdScore}
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
                <div
                  className="col-lg-9"
                  style={{ maxHeight: "250px", overflowY: "auto" }}
                >
                  <DataTable
                    columns={columns}
                    data={hrdPerformanceData}
                    noHeader
                    pagination
                    customStyles={customStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="card">
            <div
              className="card-header"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "60px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 className="card-title" style={{ margin: "0" }}>
                  Rubric To Review
                </h3>
              </div>
              <div style={{ paddingLeft: "45px", width: "200px" }}>
                <NavLink
                  to="/rubric_review"
                  className="btn btn-primary"
                  activeClassName="active"
                  onClick={() => setActiveLink("rubric_review")}
                >
                  View Rubric Review
                </NavLink>
              </div>
            </div>
            <div className="card-body">
              <DataTable
                columns={columnsRubric}
                data={hrdRubricData}
                noHeader
                pagination
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmployeeCard = () => {
    const columns = [
      {
        name: "Task Name",
        selector: "task_name",
        sortable: true,
      },
      {
        name: "Task Category",
        selector: "task_category",
        sortable: true,
      },
      {
        name: "Overdue On",
        selector: "due_datetime",
        sortable: true,
        cell: (row) => (
          <>
            <div>{formatDate(row.due_datetime)}</div>
          </>
        ),
      },
    ];

    const columnsTask = [
      {
        name: "Task Name",
        selector: "task_name",
        sortable: true,
      },
      {
        name: "Task Category",
        selector: "task_category",
        sortable: true,
      },
      {
        name: "Overdue On",
        selector: "due_datetime",
        sortable: true,
        cell: (row) => (
          <>
            <div>{formatDate(row.due_datetime)}</div>
          </>
        ),
      },
    ];

    const customStyles = {
      headCells: {
        style: {
          border: "1px dotted black",
          fontSize: "14px",
          fontWeight: "bold",
        },
      },
      cells: {
        style: {
          border: "1px dotted black",
        },
      },
    };

    const handlePeriodChange = (selectedOption) => {
      // setScore(Math.floor(Math.random() * 5) + 1);
    };

    return (
      <div className="row">
        <div className="col-lg-4">
          <div className="card">
            <div
              className="card-header"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "60px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3 className="card-title" style={{ margin: "0" }}>
                  My Performance
                </h3>
              </div>
              <div style={{ width: "120px" }}>
                <Select
                  value={period}
                  onChange={handlePeriodChange}
                  options={period}
                />
              </div>
            </div>

            <div className="card-body text-center" style={{ height: "250px" }}>
              <ReactSpeedometer
                maxValue={5}
                width={250}
                value={employeeScore}
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
        <div className="col-lg-8">
          <div className="card">
            <div
              className="card-header d-flex justify-content-between align-items-center"
              style={{ height: "60px" }}
            >
              <h3 className="card-title">Ongoing Task</h3>
            </div>
            <div
              className="card-body"
              style={{ maxHeight: "250px", overflowY: "auto" }}
            >
              <DataTable
                columns={columns}
                data={employeeOngoingData}
                noHeader
                pagination
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">My Tasks</h3>
            </div>
            <div className="card-body">
              <DataTable
                columns={columnsTask}
                data={employeeTaskData}
                noHeader
                pagination
                customStyles={customStyles}
              />
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
                  {roles.organization_role === "hrd" && renderHrdCard()}
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
