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
  const [assessmentDueDate, setAssessmentDueDate] = useState("");
  const [assessmentData, setAssessmentData] = useState([]);
  const [assessmentPastData, setAssessmentPastData] = useState([]);
  const [period, setPeriod] = useState(null);
  const [employeeScore, setEmployeeScore] = useState(3);
  const [showAddScoreModal, setShowAddScoreModal] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState([]);
  const [newScore, setNewScore] = useState("");
  const [newDescription, setNewDescription] = useState("");

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
    const tanggal = dateString
      ? date.toLocaleDateString("en-US", options)
      : "NOT STARTED";
    return tanggal;
  };

  const scoreOption = [
    { value: "5", label: "5" },
    { value: "4", label: "4" },
    { value: "3", label: "3" },
    { value: "2", label: "2" },
    { value: "1", label: "1" },
  ];

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

  const fetchRunningPeriod = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/kpi/running/${userId}`,
        config
      );
      console.log(response.data);
      setAssessmentDueDate(response.data.kpi_duedate);
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
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployeeAssessmentData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/kpi/employee/${userId}/self_assessment/`,
        config
      );
      setAssessmentData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmployeePastAssessmentData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/kpi/employee/${userId}/detail_assessment/`,
        config
      );
      setAssessmentPastData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchKpiPeriod();
    fetchRunningPeriod();
    fetchEmployeePerformanceData();
    fetchEmployeeAssessmentData();
    fetchEmployeePastAssessmentData();
  }, []);
  const handlePeriodChange = (event) => {};

  const handleAssessmentClick = (row) => {
    setSelectedKpi(row);
    console.log(row);
    setShowAddScoreModal(true);
  };

  const handleSubmitScoreKpi = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/kpi/assessment/${selectedKpi.assessment_uuid}/kpi`,
        {
          score: newScore,
          description: newDescription,
        },
        config
      );

      setNewScore("");
      setNewDescription("");
      setShowAddScoreModal(false);
      fetchEmployeePerformanceData();
      fetchEmployeeAssessmentData();
      fetchEmployeePastAssessmentData();
    } catch (error) {
      console.error(error);
    }
  };

  const columnsAssessment = [
    {
      name: "Performance Metric",
      selector: "performance_metric",
      sortable: true,
    },
    {
      name: "Score",
      width: "100px",
      selector: "score",
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

  const columnsPastData = [
    {
      name: "KPI Category",
      selector: "category",
      sortable: true,
      width: "150px",
    },
    {
      name: "Performance Metric",
      selector: "performance_metric",
      sortable: true,
    },
    {
      name: "Score System",
      selector: "score_system",
      sortable: true,
      width: "200px",
      cell: (row) => (
        <div>
          {row.score_system === "manual"
            ? "Score 5-to-1"
            : row.score_system === "self_assess"
            ? "Self Assessment"
            : row.score_system}
        </div>
      ),
    },
    {
      name: "Score",
      selector: "score",
      sortable: true,
      width: "100px",
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
                      HRD Open Assessment Till : {formatDate(assessmentDueDate)}
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
                          <h3 className="card-title">Need To Be Assess</h3>
                        </div>
                        <div
                          className="card-body"
                          style={{
                            maxHeight: "240px",
                            minHeight: "240px",
                            overflowY: "auto",
                          }}
                        >
                          <DataTable
                            columns={columnsAssessment}
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
                              My Performance Detail
                            </h3>
                          </div>
                        </div>
                        <div className="card-body">
                          <DataTable
                            columns={columnsPastData}
                            data={assessmentPastData}
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

      <Modal
        show={showAddScoreModal}
        onHide={() => setShowAddScoreModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Self Assessment {selectedKpi ? selectedKpi.performance_metric : ""}
          </Modal.Title>
          <Button variant="text" onClick={() => setShowAddScoreModal(false)}>
            X
          </Button>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmitScoreKpi}>
            {selectedKpi?.category === "KPI" ? (
              <>
                <Form.Group>
                  <Form.Label>Tracking Source</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter tracking source"
                    onChange={(event) => setNewDescription(event.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Score 5-to-1</Form.Label>
                  <Select
                    options={scoreOption}
                    placeholder="Select score"
                    onChange={(event) => setNewScore(event.value)}
                  />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group>
                  <Form.Label>Justification</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter Justification"
                    onChange={(event) => setNewDescription(event.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Score 5-to-1</Form.Label>
                  <Select
                    options={scoreOption}
                    placeholder="Select score"
                    onChange={(event) => setNewScore(event.value)}
                  />
                </Form.Group>
              </>
            )}
            <Button
              style={{ marginTop: "10px" }}
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* /.content */}
    </div>
  );
}

export default EmployeePage;
