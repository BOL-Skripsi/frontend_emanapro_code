import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import Select from "react-select";
import DataTable from "react-data-table-component";

function EmployeePage() {
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [kpiData, setKpiData] = useState([]);
  const [kpiTeamData, setKpiTeamData] = useState([]);
  const [kpiCategoryTeamData, setKpiCategoryTeamData] = useState([]);
  const [kpiTeamMemberData, setKpiTeamMemberData] = useState([]);
  const [newPeriod, setNewPeriod] = useState("");
  const [newScore, setNewScore] = useState("");
  const [showMemberKpiModal, setShowMemberKpiModal] = useState(false);
  const [showDetailKpiModal, setShowDetailKpiModal] = useState(false);
  const [showDetailCategoryKpiModal, setShowDetailCategoryKpiModal] =
    useState(false);
  const [showDetailAssessmentKpiModal, setShowDetailAssessmentKpiModal] =
    useState(false);
  const [showAddKpiModal, setShowAddKpiModal] = useState(false);
  const full = true;
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [selectedCategoryKpi, setSelectedCategoryKpi] = useState(null);
  const [selectedAssessmentKpi, setSelectedAssessmentKpi] = useState(null);
  const [newScoreDescription, setNewScoreDescription] = useState("");
  const scoreOption = [
    { value: "5", label: "5" },
    { value: "4", label: "4" },
    { value: "3", label: "3" },
    { value: "2", label: "2" },
    { value: "1", label: "1" },
  ];
  let i = 1;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
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
  const fetchKpiData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/kpi/open/${userId}`,
        config
      );
      setKpiData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchKpiTeamData = async (userId, duedateId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/kpi/open/${userId}/${duedateId}/list`,
        config
      );
      setKpiTeamData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchKpiAssessmentForm = async (userId, duedateId, category) => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/kpi/open/${userId}/${duedateId}/${category}/form`,
        config
      );
      setKpiCategoryTeamData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKpiData();
  }, []);

  const handleMemberKpiClick = (row) => {
    fetchKpiAssessmentForm(
      row.user_id,
      row.assessment_due_date_uuid,
      row.category
    );
    setShowMemberKpiModal(true);
  };

  const handleDetailKpiClick = (row) => {
    setSelectedRubric(row);
    fetchKpiTeamData(row.user_id, row.assessment_due_date_uuid);
    setShowDetailKpiModal(true);
  };

  const handleDetailCategoryKpiClick = (row) => {
    setSelectedCategoryKpi(row);
    fetchKpiAssessmentForm(
      row.user_id,
      row.assessment_due_date_uuid,
      row.category
    );
    setShowDetailCategoryKpiModal(true);
  };

  const handleDetailAssessmentKpiClick = (row) => {
    setSelectedAssessmentKpi(row);
    setShowDetailAssessmentKpiModal(true);
  };

  const handleAddKpiClick = (row) => {
    setSelectedRubric(row);
    setShowAddKpiModal(true);
  };

  const handleNewPeriodChange = (event) => {
    setNewPeriod(event.target.value);
  };

  const handleNewScoreDescriptionChange = (event) => {
    setNewScoreDescription(event.target.value);
  };

  const handleSubmitKpi = async (event) => {
    event.preventDefault();
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `http://localhost:3000/kpi/period`,
        {
          kpi_duedate: newPeriod,
        },
        config
      );
      setShowAddKpiModal(false);
      setNewPeriod("");
      // fetchKpiAssessmentForm()
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitAssessmentManual = async (event) => {
    event.preventDefault();
    try {
      const assessmentId = selectedAssessmentKpi.uuid;
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `http://localhost:3000/kpi/assessment/${assessmentId}/`,
        {
          score: newScore,
          uraian: newScoreDescription,
        },
        config
      );
      fetchKpiTeamData(
        selectedAssessmentKpi.user_id,
        selectedAssessmentKpi.assessment_duedate
      );
      setShowDetailAssessmentKpiModal(false);
      setNewScore("");
      setNewScoreDescription("");
      fetchKpiAssessmentForm(
        selectedAssessmentKpi.user_id,
        selectedAssessmentKpi.assessment_duedate,
        selectedAssessmentKpi.category
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitAssessmentChangeScore = async (event) => {
    event.preventDefault();
    try {
      const assessmentId = selectedAssessmentKpi.uuid;
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `http://localhost:3000/kpi/assessment/${assessmentId}/change_score`,
        {
          score: newScore,
        },
        config
      );
      fetchKpiTeamData(
        selectedAssessmentKpi.user_id,
        selectedAssessmentKpi.assessment_duedate
      );
      setShowDetailAssessmentKpiModal(false);
      setNewScore("");
      setNewScoreDescription("");
      fetchKpiAssessmentForm(
        selectedAssessmentKpi.user_id,
        selectedAssessmentKpi.assessment_duedate,
        selectedAssessmentKpi.category
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitAssessmentAcceptScore = async (event) => {
    event.preventDefault();
    try {
      // // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${Cookies.get("_auth")}`,
      //   },
      // };
      // const response = await axios.post(
      //   `http://localhost:3000/kpi/period`,
      //   {
      //     kpi_duedate: newPeriod,
      //   },
      //   config
      // );
      // setShowAddKpiModal(false);
      // setNewPeriod("");
      // // fetchAllRubric();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      name: "Team Member Name",
      selector: "user_name",
      sortable: true,
    },
    {
      name: "Team Name",
      selector: "team_name",
      sortable: true,
    },
    {
      name: "Assessment Progress",
      selector: "team_members_count",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.num_rubrics} Rubric / ${row.num_assessments_with_score} Assess`}</div>
        </>
      ),
    },
    {
      name: "Assessment Period",
      selector: "assessment_period",
      sortable: true,
      cell: (row) => (
        <>
          <div>
            {row.kpi_period?.toUpperCase()
              ? row.kpi_period.toUpperCase()
              : "NO PERIOD"}
          </div>
        </>
      ),
    },
    {
      name: "Final Score",
      selector: "final_score",
      sortable: true,
      cell: (row) => (
        <>
          <div>
            {row.final_score}
          </div>
        </>
      ),
    },
    {
      name: "Assessment Due Date",
      selector: "assessment_period_due_date",
      sortable: true,
      cell: (row) => (
        <>
          <div>{formatDate(row.assessment_due_date)}</div>
        </>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {row.status_approval !== "approve" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDetailKpiClick(row)}
            >
              Detail
            </Button>
          )}
        </>
      ),
      button: true,
      width: "100px",
      style: {
        width: "20%",
        minWidth: "100px",
        textAlign: "center",
      },
    },
  ];

  const columnsDetail = [
    {
      name: "Assessment Category",
      selector: "category",
      sortable: true,
    },
    {
      name: "Assessment Progress",
      selector: "num_assessments_with_score",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.num_assessments_with_score} / ${row.num_rubrics} Assess`}</div>
        </>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {row.status_approval !== "approve" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDetailCategoryKpiClick(row)}
            >
              Detail
            </Button>
          )}
        </>
      ),
      button: true,
      width: "100px",
      style: {
        width: "20%",
        minWidth: "100px",
        textAlign: "center",
      },
    },
  ];

  const columnsDetailCategoryKPI = [
    {
      name: "Key Performance Indicator(KPI)",
      selector: "performance_metric",
      sortable: true,
    },
    {
      name: "Program Kerja",
      selector: "description",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.description}`}</div>
        </>
      ),
    },
    {
      name: "Measurement",
      selector: "criteria",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.criteria}`}</div>
        </>
      ),
    },
    {
      name: "Weight %",
      selector: "weight",
      sortable: true,
    },
    {
      name: "Tracking Source",
      selector: "data_source",
      sortable: true,
      cell: (row) => (
        <div>
          {row.data_source}
        </div>
      ),
    },
    {
      name: "Description of performance results",
      selector: "uraian_kinerja",
      sortable: true,
      cell: (row) => (
        <div>
          {row.uraian_kinerja}
        </div>
      ),
    },
    {
      name: "Score",
      selector: "score",
      sortable: true,
    },
    {
      name: "Score System",
      selector: "score_system",
      sortable: true,
      cell: (row) => (
        <div>
          {row.score_system === "manual"
            ? "Score 5-to-1"
            : row.score_system === "self_assess"
            ? "Self Assessment"
            : ""}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div>
            {new Date(row.kpi_duedate) < new Date() ? (
              ""
            ) : row.score_system === "manual" && row.score === null ? (
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDetailAssessmentKpiClick(row)}
                  style={{ width: "80px" }}
                >
                  Assess
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  style={{ width: "80px", marginTop: "5px" }}
                  onClick={() => handleDetailAssessmentKpiClick(row)}
                >
                  Detail
                </Button>
              </div>
            )}
          </div>
        </>
      ),
      button: true,
      width: "100px",
      style: {
        width: "20%",
        minWidth: "100px",
        textAlign: "center",
      },
    },
  ];

  const columnsDetailCategoryCompetencies = [
    {
      name: "Competencies",
      selector: "performance_metric",
      sortable: true,
    },
    {
      name: "Weight %",
      selector: "weight",
      sortable: true,
    },
    {
      name: "Behavior Designation",
      selector: "criteria",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.criteria}`}</div>
        </>
      ),
    },
    {
      name: "Score",
      selector: "score",
      sortable: true,
    },
    {
      name: "Score System",
      selector: "score_system",
      sortable: true,
      cell: (row) => (
        <div>
          {row.score_system === "manual"
            ? "Score 5-to-1"
            : row.score_system === "self_assess"
            ? "Self Assessment"
            : ""}
        </div>
      ),
    },
    {
      name: "Justification",
      selector: "uraian_kinerja",
      cell: (row) => (
        <>
          <div>{`${row?.uraian_kinerja ? row.uraian_kinerja : ""}`}</div>
        </>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div>
            {new Date(row.kpi_duedate) < new Date() ? (
              ""
            ) : row.score_system === "manual" && row.score === null ? (
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDetailAssessmentKpiClick(row)}
                  style={{ width: "80px" }}
                >
                  Assess
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  style={{ width: "80px", marginTop: "5px" }}
                  onClick={() => handleDetailAssessmentKpiClick(row)}
                >
                  Detail
                </Button>
              </div>
            )}
          </div>
        </>
      ),
      button: true,
      width: "100px",
      style: {
        width: "20%",
        minWidth: "100px",
        textAlign: "center",
      },
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
              <h1 className="m-0">KPI Assessment</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">KPI Assessment</li>
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
                <div className="card-body">
                  <DataTable
                    columns={columns}
                    data={kpiData}
                    noHeader
                    pagination
                    customStyles={customStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal
        size="xl"
        show={showDetailKpiModal}
        onHide={() => setShowDetailKpiModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Assessment</Modal.Title>
          <Button variant="text" onClick={() => setShowDetailKpiModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <DataTable
            columns={columnsDetail}
            data={kpiTeamData}
            noHeader
            pagination
            customStyles={customStyles}
          />
        </Modal.Body>
      </Modal>

      <Modal
        size="xl"
        show={showDetailCategoryKpiModal}
        onHide={() => setShowDetailCategoryKpiModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Assessment</Modal.Title>
          <Button
            variant="text"
            onClick={() => setShowDetailCategoryKpiModal(false)}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          {selectedCategoryKpi?.category === "KPI" ? (
            <DataTable
              columns={columnsDetailCategoryKPI}
              data={kpiCategoryTeamData}
              noHeader
              pagination
              customStyles={customStyles}
            />
          ) : (
            <DataTable
              columns={columnsDetailCategoryCompetencies}
              data={kpiCategoryTeamData}
              noHeader
              pagination
              customStyles={customStyles}
            />
          )}
        </Modal.Body>
      </Modal>
      {/* 
      <Modal
        size="xl"
        fullscreen={full}
        show={showMemberKpiModal}
        onHide={() => setShowMemberKpiModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            {" "}
            {selectedRubric?.user_name && (
              <span>{selectedRubric.user_name} Assessment</span>
            )}
          </Modal.Title>
          <Button variant="text" onClick={() => setShowMemberKpiModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAssessment}>
            <div className="card-body">
              <div>
                <table border={"1"} cellPadding={"5"} width={"100%"}>
                  <thead>
                    <tr>
                      <th rowSpan={"2"} style={{ textAlign: "center" }}></th>
                      <th rowSpan={"2"} style={{ textAlign: "center" }}>
                        No.
                      </th>
                      <th rowSpan={"2"} style={{ textAlign: "center" }}>
                        Key Responsibilities
                      </th>
                      <th colSpan={"2"} style={{ textAlign: "center" }}>
                        Key Performance Indicator(KPI)
                      </th>
                      <th rowSpan={"2"} style={{ textAlign: "center" }}>
                        Weight %
                      </th>
                      <th rowSpan={"2"} style={{ textAlign: "center" }}>
                        Tracking Source
                      </th>
                      <th colSpan={"2"} style={{ textAlign: "center" }}>
                        Assessment
                      </th>
                    </tr>
                    <tr>
                      <th style={{ textAlign: "center" }}>Work Order</th>
                      <th style={{ textAlign: "center" }} width={"250px"}>
                        Measurement
                      </th>
                      <th style={{ textAlign: "center" }}>
                        A Brief Description of Work Results
                      </th>
                      <th style={{ textAlign: "center" }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpiTeamMemberData.map((data) => (
                      <tr>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td style={{ textAlign: "center" }}></td>
                        <td>{data.performance_metric}</td>
                        <td>{data.description}</td>
                        <td>{data.criteria}</td>
                        <td>{data.weight}</td>
                        <td>{data.data_source}</td>
                        <td>{data.uraian_kinerja}</td>
                        <td width={"150px"}>
                          {data.score === "manual" ? (
                            data.score
                          ) : (
                            <Select
                              options={scoreOption}
                              placeholder="Select score"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ paddingTop: "10px" }}>
                <Button type="submit">Submit</Button>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal> */}

      <Modal
        show={showDetailAssessmentKpiModal}
        onHide={() => setShowDetailAssessmentKpiModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Score{" "}
            {selectedAssessmentKpi
              ? selectedAssessmentKpi.performance_metric
              : ""}
          </Modal.Title>
          <Button
            variant="text"
            onClick={() => setShowDetailAssessmentKpiModal(false)}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          {selectedAssessmentKpi?.score_system === "manual" ? (
            <>
              <Form onSubmit={handleSubmitAssessmentManual}>
                <Form.Group>
                  <Form.Label>Score 5-to-1</Form.Label>
                  <Select
                    options={scoreOption}
                    placeholder="Select score"
                    onChange={(event) => setNewScore(event.value)}
                  />
                </Form.Group>
                {selectedAssessmentKpi?.category === "Competencies" ? (
                  <Form.Group>
                    <Form.Label>Description of performance results</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter description of performance results"
                      value={newScoreDescription}
                      onChange={handleNewScoreDescriptionChange}
                    />
                  </Form.Group>
                ) : (
                  <Form.Group>
                    <Form.Label>Justification</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter justification"
                      value={newScoreDescription}
                      onChange={handleNewScoreDescriptionChange}
                    />
                  </Form.Group>
                )}
                <Button
                  style={{ marginTop: "10px" }}
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </>
          ) : selectedAssessmentKpi?.score_system === "self_assess" &&
            selectedAssessmentKpi.data_source === "" ? (
            <>
              <Form onSubmit={handleSubmitAssessmentChangeScore}>
                <Form.Group>
                  <Form.Label>Change Score</Form.Label>
                  <Select
                    options={scoreOption}
                    placeholder="Select score"
                    onChange={(event) => setNewScore(event.value)}
                  />
                </Form.Group>
                <Button
                  style={{ marginTop: "10px" }}
                  variant="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </>
          ) : (
            <Form onSubmit={handleSubmitAssessmentAcceptScore}>
              Task List And Score
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EmployeePage;
