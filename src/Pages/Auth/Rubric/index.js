import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import Select from "react-select";
import "./style.css";

function RubricPage() {
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [teamData, setTeamData] = useState([]);
  const [rubricData, setRubricData] = useState([]);
  const [showAddRubricModal, setShowAddRubricModal] = useState(false);
  const [showDetailRubricModal, setShowDetailRubricModal] = useState(false);
  const [newAssessmentCategory, setnewAssessmentCategory] = useState("");
  const [newAssessmentMetric, setnewAssessmentMetric] = useState("");
  const [newAssessmentDescription, setnewAssessmentDescription] = useState("");
  const [newAssessmentCriteria, setnewAssessmentCriteria] = useState("");
  const [newAssessmentWeight, setnewAssessmentWeight] = useState("");
  const [newAssessmentScoreSystem, setnewAssessmentScoreSystem] = useState("");
  const [newAssessmentDataSource, setnewAssessmentDataSource] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTeamRubric = async () => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/team/${orgId}/${userId}/rubric`,
        config
      );
      setTeamData(response.data.teams);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTeamRubricList = async (team_uuid) => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/rubric/${orgId}/${team_uuid}/list`,
        config
      );
      console.log(response.data?.competencyRubrics);
      setRubricData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTeamRubric();
  }, []);

  const columns = [
    {
      name: "Team",
      selector: "team_name",
      sortable: true,
    },
    {
      name: "Team Member",
      selector: "team_member_count",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.team_member_count} Member`}</div>
        </>
      ),
    },
    {
      name: "Assessment Rubric",
      selector: "assessment_rubric_amount",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.assessment_rubric_amount} Rubric/ ${row.assessment_rubric_amount_approved_except_not_approve} Approved`}</div>
        </>
      ),
    },
    {
      name: "HRD Review Status",
      selector: "assessment_rubric_status",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {/* <Button
            variant="primary"
            size="sm"
            onClick={() => handleProfileClick(row)}
          >
            Detail
          </Button> */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleDetailRubricClick(row)}
          >
            Detail
          </Button>
          <Button
            variant="primary"
            size="sm"
            style={{ marginLeft: 10 }}
            onClick={() => handleAddNewRubricClick(row)}
          >
            Add Rubric
          </Button>
        </>
      ),
      button: true,
      width: "200px",
      style: {
        width: "20%",
        minWidth: "200px",
        textAlign: "center",
      },
    },
  ];

  const columnsRubric = [
    {
      name: "Rubric Category",
      selector: "category",
      sortable: true,
      width: "150px",
      style: {
        width: "10%",
        minWidth: "150px",
        textAlign: "center",
      },
    },
    {
      name: "Performance Metric",
      selector: "performance_metric",
      sortable: true,
      cell: (row) => <div>{row.performance_metric}</div>,
      width: "200px",
      style: {
        width: "10%",
        minWidth: "200px",
        textAlign: "center",
      },
    },
    {
      name: "Description",
      selector: "description",
      sortable: true,
      cell: (row) => <div>{row.description}</div>,
      width: "150px",
      style: {
        width: "10%",
        minWidth: "150px",
        textAlign: "left",
      },
    },
    {
      name: "Weight",
      selector: "weight",
      sortable: true,
      width: "100px",
      style: {
        width: "10%",
        minWidth: "100px",
        textAlign: "center",
      },
    },
    {
      name: "Criteria",
      selector: "criteria",
      sortable: true,
      width: "150px",
      cell: (row) => <div>{row.criteria}</div>,
      style: {
        width: "10%",
        minWidth: "150px",
        textAlign: "left",
      },
    },
    {
      name: "Scoring System",
      selector: "score_system",
      sortable: true,
      width: "150px",
      cell: (row) => (
        <div>
          {row.score_system === "manual" ? "Score 5-to-1" : row.score_system}
        </div>
      ),
      style: {
        width: "10%",
        minWidth: "150px",
        textAlign: "center",
      },
    },
    {
      name: "HRD Approval Status",
      selector: "status_approval",
      sortable: true,
      cell: (row) => <div>{row.status_approval?.toUpperCase()}</div>,
      width: "150px",
      style: {
        width: "10%",
        minWidth: "150px",
        textAlign: "center",
      },
    },
    {
      name: "HRD Approval Status",
      selector: "feedback_and_improvement",
      sortable: true,
      cell: (row) => <div>{row.feedback_and_improvement}</div>,
      width: "150px",
      style: {
        width: "10%",
        minWidth: "150px",
        textAlign: "center",
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <div>
            {row.status_approval === "revision" ? (
              <Button
                variant="warning"
                size="sm"
                onClick={() => handleDetailRubricClick(row)}
              >
                Edit
              </Button>
            ) : (
              ""
            )}
            <Button
              variant="danger"
              size="sm"
              style={{ marginLeft: "10px" }}
              onClick={() => handleDetailRubricClick(row)}
            >
              Delete
            </Button>
          </div>
        </>
      ),
      button: true,
      width: "200px",
      style: {
        width: "20%",
        minWidth: "200px",
        textAlign: "center",
      },
    },
  ];

  const assessmentOption = [
    { value: "KPI", label: "KPI" },
    { value: "Competencies", label: "Competencies" },
  ];

  const scoreOption = [
    { value: "manual", label: "Manual 1-5 Score" },
    { value: "task", label: "Based On Task" },
    { value: "self", label: "Self Assessment" },
  ];

  const trackingOption = [
    { value: "KPI", label: "Manual" },
    { value: "attendance", label: "Attendance" },
    { value: "task_completion_rate", label: "Task Completion Rate" },
    { value: "task_score", label: "Task Score" },
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

  const customStylesRubric = {
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
        overflowWrap: "break-word",
      },
    },
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDetailRubricClick = (row) => {
    setSelectedTeam(row);
    fetchTeamRubricList(row.team_uuid);
    setShowDetailRubricModal(true);
  };

  const handleAddNewRubricClick = (row) => {
    setSelectedTeam(row);
    setShowAddRubricModal(true);
  };

  const handleAssessmentCategoryChange = (event) => {
    setnewAssessmentCategory(event.target.value);
  };

  const handleAssessmentMetricChange = (event) => {
    setnewAssessmentMetric(event.target.value);
  };

  const handleNewAssessmentDescriptionChange = (event) => {
    setnewAssessmentDescription(event.target.value);
  };

  const handleNewAssessmentCriteriaChange = (event) => {
    setnewAssessmentCriteria(event.target.value);
  };

  const handleNewAssessmentWeightChange = (event) => {
    setnewAssessmentWeight(event.target.value);
  };

  const handleNewAssessmentScoreSystemChange = (event) => {
    setnewAssessmentScoreSystem(event.target.value);
  };

  const handleNewAssessmentDataSourceChange = (event) => {
    setnewAssessmentDataSource(event.target.value);
  };

  const handleSubmitAddRubric = async (event) => {
    event.preventDefault();
    console.log(selectedTeam.team_uuid);
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `http://localhost:3000/rubric/`,
        {
          category: newAssessmentCategory,
          metric: newAssessmentMetric,
          description: newAssessmentDescription,
          criteria: newAssessmentCriteria,
          weight: newAssessmentWeight,
          score_system: newAssessmentScoreSystem,
          data_source: newAssessmentDataSource,
          team_id: selectedTeam.team_uuid,
        },
        config
      );
      fetchTeamRubric();
      setShowAddRubricModal(false);
      fetchTeamRubricList();
      setnewAssessmentCategory("");
      setnewAssessmentMetric("");
      setnewAssessmentDescription("");
      setnewAssessmentCriteria("");
      setnewAssessmentWeight("");
      setnewAssessmentScoreSystem("");
      setnewAssessmentDataSource("");
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTeamData = teamData.filter(
    (item) =>
      item.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.team_member_count.toString().includes(searchQuery) ||
      item.assessment_rubric_amount.toString().includes(searchQuery) ||
      item.assessment_rubric_amount_approved_except_not_approve
        .toString()
        .includes(searchQuery) ||
      item.assessment_rubric_status
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Assessment Rubric</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Assessment Rubric</li>
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
                <div className="card-header">
                  <div className="card-tools" style={{ width: "210px" }}>
                    <div>
                      <Form.Control
                        type="text"
                        placeholder="Search rubric or team name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns}
                    data={filteredTeamData}
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
        show={showAddRubricModal}
        onHide={() => setShowAddRubricModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Add Assessment Rubric to{" "}
            {selectedTeam?.team_name && <span>{selectedTeam.team_name}</span>}
          </Modal.Title>
          <Button variant="text" onClick={() => setShowAddRubricModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAddRubric}>
            <Form.Group>
              <Form.Label>Assessment Category</Form.Label>
              <Select
                onChange={(event) => setnewAssessmentCategory(event.value)}
                options={assessmentOption}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Metric</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter assessment metric"
                value={newAssessmentMetric}
                onChange={handleAssessmentMetricChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={newAssessmentDescription}
                onChange={handleNewAssessmentDescriptionChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Criteria</Form.Label>
              <Form.Control
                as="textarea"
                value={newAssessmentCriteria}
                onChange={handleNewAssessmentCriteriaChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="number"
                value={newAssessmentWeight}
                onChange={handleNewAssessmentWeightChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Score System</Form.Label>
              <Select
                onChange={(event) => setnewAssessmentScoreSystem(event.value)}
                options={scoreOption}
              />
            </Form.Group>
            {newAssessmentScoreSystem === "task" ? (
              <Form.Group>
                <Form.Label>Tracking Source</Form.Label>
                <Select
                  onChange={(event) => setnewAssessmentDataSource(event.value)}
                  options={trackingOption}
                />
              </Form.Group>
            ) : null}
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
      <Modal
        size="xl"
        show={showDetailRubricModal}
        onHide={() => setShowDetailRubricModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Assessment Rubric for{" "}
            {selectedTeam?.team_name && <span>{selectedTeam.team_name}</span>}
          </Modal.Title>
          <Button
            variant="text"
            onClick={() => setShowDetailRubricModal(false)}
          >
            X
          </Button>
        </Modal.Header>
        {/* <table className="table">
          <thead>
            <tr>
              <th style={{ verticalAlign: "middle" }}>Rubric Category</th>
              <th style={{ verticalAlign: "middle" }}>Performance Metric</th>
              <th style={{ verticalAlign: "middle" }}>Description</th>
              <th style={{ verticalAlign: "middle" }}>Weight</th>
              <th style={{ verticalAlign: "middle" }}>Criteria</th>
              <th style={{ verticalAlign: "middle" }}>Scoring System</th>
              <th style={{ verticalAlign: "middle" }}>Tracking Source</th>
              <th style={{ verticalAlign: "middle" }}>HRD Approval Status</th>
              <th style={{ verticalAlign: "middle" }}>HRD Comment</th>
            </tr>
          </thead>

          <tbody>
            {rubricData.map((row, index) => (
              <tr key={index}>
                <td style={{ marginLeft: "15px" }}>{row.category}</td>
                <td style={{ marginLeft: "15px" }}>{row.performance_metric}</td>
                <td style={{ marginLeft: "15px" }}>{row.description}</td>
                <td style={{ marginLeft: "15px" }}>{row.weight}</td>
                <td style={{ marginLeft: "15px" }}>{row.criteria}</td>
                <td style={{ marginLeft: "15px" }}>
                  {row.score_system === "manual" ? "5-point scale" : ""}
                </td>
                <td style={{ marginLeft: "15px" }}>
                  {row.data_source ? row.data_source : "Evaluation"}
                </td>
                <td style={{ marginLeft: "15px" }}>
                  {row.status_approval?.toUpperCase()}
                </td>
                <td style={{ marginLeft: "15px" }}>
                  {row.feedback_and_improvement}
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
        <Modal.Body>
          <DataTable
            columns={columnsRubric}
            data={rubricData}
            noHeader
            pagination
            customStyles={customStylesRubric}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default RubricPage;
