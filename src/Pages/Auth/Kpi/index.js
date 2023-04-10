import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import ReactSpeedometer from "react-d3-speedometer";
import Select from "react-select";
import DataTable from "react-data-table-component";

function EmployeePage() {
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [assessmentData, setAssessmentData] = useState([]);
  const [period, setPeriod] = useState(null);
  const [employeeScore, setEmployeeScore] = useState(3);

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
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchEmployeePerformanceData();
    fetchKpiPeriod();
  }, []);
  const handlePeriodChange = (event) => {
  };

  const handleAssessmentClick = (event) => {
  };

  const columns = [
    {
      name: "Performance Metric",
      selector: "user_name",
      sortable: true,
    },
    {
      name: "Score System",
      selector: "email",
      sortable: true,
    },
    {
      name: "Score",
      selector: "manager_name",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Button
            style={{ marginLeft: 10 }}
            variant="primary"
            size="sm"
            onClick={() => handleAssessmentClick(row)}
          >
            Detail
          </Button>
        </>
      ),
      button: true,
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
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">KPI</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">KPI</li>
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
                <div
                  className="card-header"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "60px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 className="card-title">
                      HRD Open Assessment Till : due date
                    </h3>
                  </div>
                  <div style={{ paddingLeft: "20px", width: "200px" }}>
                    <div className="card-tools">
                      <Select
                        value={period}
                        onChange={handlePeriodChange}
                        options={period}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">My Performance Score</h3>
                        </div>
                        <div
                          className="card-body"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ReactSpeedometer
                            maxValue={5}
                            width={250}
                            height={200}
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
                    <div className="col-md-8">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Self Assessment</h3>
                        </div>
                        <div
                          className="card-body"
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          <DataTable
                            columns={columns}
                            data={assessmentData}
                            noHeader
                            pagination
                            customStyles={customStyles}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
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
                              My Past Performance Score
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
                          <DataTable
                            columns={columns}
                            data={assessmentData}
                            noHeader
                            pagination
                            customStyles={customStyles}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /.content */}
    </div>
  );
}

export default EmployeePage;
