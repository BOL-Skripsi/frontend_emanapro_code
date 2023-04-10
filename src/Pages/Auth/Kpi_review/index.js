import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import Select from "react-select";
import DataTable from "react-data-table-component";

function EmployeePage() {
  const periods = [
    { value: "Q1 2023", label: "Q1 2023" },
    { value: "Q2 2023", label: "Q2 2023" },
    { value: "Q3 2023", label: "Q3 2023" },
    { value: "Q4 2023", label: "Q4 2023" },
  ];

  const [kpiData, setKpiData] = useState([]);
  const [kpiDetailData, setKpiDetailData] = useState([]);
  const [kpiTeamData, setKpiTeamData] = useState([]);
  const [newPeriod, setNewPeriod] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [showMemberKpiModal, setShowMemberKpiModal] = useState(false);
  const [showMemberKpiDetailModal, setShowMemberKpiDetailModal] =
    useState(false);
  const [showDetailKpiModal, setShowDetailKpiModal] = useState(false);
  const [showAddKpiModal, setShowAddKpiModal] = useState(false);
  const [showUpdateKpiModal, setShowUpdateKpiModal] = useState(false);
  const [selectedRubric, setSelectedRubric] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [period, setPeriod] = useState("");
  const [periodOptions, setPeriodOptions] = useState("");

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
  const fetchKpiData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/kpi/`,
        config
      );
      setKpiData(response.data);
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
      console.log(response.data);
      const transformedData = response.data.map((item) => ({
        value: item.uuid,
        label: item.kpi_period,
      }));
      setPeriodOptions(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchKpiTeamData = async (teamId) => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/kpi/kpi_team_member/${teamId}`,
        config
      );
      setKpiTeamData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchKpiAssessmentData = async (data) => {
    try {
      console.log(data);
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/kpi/assessment/${data.team_member}/detail`,
        config
      );
      setKpiDetailData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKpiPeriod();
    fetchKpiData();
  }, []);

  const handlePeriodChange = (selectedOption) => {
    setPeriod(selectedOption);
  };
  const handleMemberKpiClick = (row) => {
    setSelectedRubric(row);
    console.log(row);
    setShowMemberKpiModal(true);
  };

  const handleMemberKpiDetailClick = (row) => {
    setSelectedDetail(row);
    fetchKpiAssessmentData(row);
    setShowMemberKpiDetailModal(true);
  };

  const handleDetailKpiClick = (row) => {
    setSelectedRubric(row);
    fetchKpiTeamData(row.team_uuid);
    setShowDetailKpiModal(true);
  };

  const handleAddKpiClick = (row) => {
    setSelectedRubric(row);
    setShowAddKpiModal(true);
  };

  const handleUpdateKpiClick = (row) => {
    setSelectedRubric(row);
    setShowUpdateKpiModal(true);
  };

  const handleNewPeriodChange = (event) => {
    setNewPeriod(event.value);
  };

  const handleNewStartDateChange = (event) => {
    setNewStartDate(event.target.value);
  };

  const handleNewDueDateChange = (event) => {
    setNewDueDate(event.target.value);
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
        `${process.env.REACT_APP_BASE_URL}/kpi/period`,
        {
          kpi_period: newPeriod,
          kpi_startdate: newStartDate,
          kpi_duedate: newDueDate,
        }
      );
      setShowAddKpiModal(false);
      setNewPeriod("");
      // fetchAllRubric();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitUpdateKpi = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/kpi/period/update`,
        {
          kpi_period: newPeriod,
        },
        config
      );
      setShowUpdateKpiModal(false);
      setNewPeriod("");
      // fetchAllRubric();
    } catch (error) {
      console.error(error);
    }
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
      name: "KPI Assessment",
      selector: "team_members_count",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.num_members} Member / ${row.num_assessed} Assess`}</div>
        </>
      ),
    },
    {
      name: "KPI Period",
      selector: "kpi_period",
      sortable: true,
    },
    {
      name: "Team KPI Score",
      selector: "final_score",
      sortable: true,
    },
    {
      name: "Assessment Due Date",
      selector: "assessment_period_due_date",
      sortable: true,
      cell: (row) => (
        <>
          <div>{formatDate(row.kpi_duedate)}</div>
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
      name: "Team Member Name",
      selector: "user_name",
      sortable: true,
    },
    {
      name: "Assessment Progress",
      selector: "assessment_count",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.assessment_count} / ${row.rubric_count} Assessment`}</div>
        </>
      ),
    },
    {
      name: "Final Score",
      selector: "final_score",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {row.status_approval !== "approve" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleMemberKpiDetailClick(row)}
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
  const columnsRubric = [
    {
      name: "Rubric Category",
      selector: "category",
      sortable: true,
    },
    {
      name: "Performance Metric",
      selector: "performance_metric",
      sortable: true,
      cell: (row) => <div>{row.performance_metric}</div>,
    },
    {
      name: "Description",
      selector: "description",
      sortable: true,
      cell: (row) => <div>{row.description}</div>,
    },
    {
      name: "Weight",
      selector: "weight",
      sortable: true,
    },
    {
      name: "Criteria",
      selector: "criteria",
      sortable: true,
      cell: (row) => <div>{row.criteria}</div>,
    },
    {
      name: "Score System",
      selector: "criteria",
      sortable: true,
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
              <h1 className="m-0">KPI Review</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">KPI Review</li>
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
                  <div className="card-tools d-flex">
                    <div style={{ width: "150px" }}>
                      <Select
                        value={period}
                        onChange={handlePeriodChange}
                        options={periodOptions}
                        style={{ flex: "2" }}
                      />
                    </div>
                    <div style={{ paddingLeft: "10px" }}>
                      <button
                        className="btn btn-primary mr-2"
                        onClick={handleAddKpiClick}
                        style={{ flex: "1" }}
                      >
                        + Add KPI Period
                      </button>
                    </div>
                    <button
                      className="btn btn-primary mr-2"
                      onClick={handleUpdateKpiClick}
                    >
                      + Update Assessment Data
                    </button>
                  </div>
                </div>

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
      <Modal show={showAddKpiModal} onHide={() => setShowAddKpiModal(false)}>
        <Modal.Header>
          <Modal.Title>Add KPI Assessment Due Date</Modal.Title>
          <Button variant="text" onClick={() => setShowAddKpiModal(false)}>
            X
          </Button>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmitKpi}>
            <Form.Group>
              <Form.Label>KPI Period</Form.Label>
              <Select onChange={handleNewPeriodChange} options={periods} />
            </Form.Group>
            <Form.Group>
              <Form.Label>KPI Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                placeholder="Enter employee name"
                value={newStartDate}
                onChange={handleNewStartDateChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>KPI Due Date</Form.Label>
              <Form.Control
                type="datetime-local"
                placeholder="Enter employee name"
                value={newDueDate}
                onChange={handleNewDueDateChange}
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
        </Modal.Body>
      </Modal>

      <Modal
        show={showUpdateKpiModal}
        onHide={() => setShowUpdateKpiModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Update KPI Assessment Data</Modal.Title>
          <Button variant="text" onClick={() => setShowUpdateKpiModal(false)}>
            X
          </Button>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmitUpdateKpi}>
            <Form.Group>
              <Form.Label>KPI Period</Form.Label>
              <Select
                onChange={handleNewPeriodChange}
                options={periodOptions}
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
        </Modal.Body>
      </Modal>

      <Modal
        size="xl"
        show={showDetailKpiModal}
        onHide={() => setShowDetailKpiModal(false)}
      >
        <Modal.Header>
          <Modal.Title>KPI Detail</Modal.Title>
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
        show={showMemberKpiDetailModal}
        onHide={() => setShowMemberKpiDetailModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            {" "}
            {selectedDetail?.user_name && (
              <span>{selectedDetail.user_name} Assessment Detail</span>
            )}
          </Modal.Title>
          <Button
            variant="text"
            onClick={() => setShowMemberKpiDetailModal(false)}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <DataTable
            columns={columnsRubric}
            data={kpiDetailData}
            noHeader
            pagination
            customStyles={customStyles}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EmployeePage;
