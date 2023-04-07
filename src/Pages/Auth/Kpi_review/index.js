import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import Select from "react-select";
import DataTable from "react-data-table-component";

function EmployeePage() {
  const [kpiData, setKpiData] = useState([]);
  const [kpiTeamData, setKpiTeamData] = useState([]);
  const [newPeriod, setNewPeriod] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [showMemberKpiModal, setShowMemberKpiModal] = useState(false);
  const [showDetailKpiModal, setShowDetailKpiModal] = useState(false);
  const [showAddKpiModal, setShowAddKpiModal] = useState(false);
  const [showUpdateKpiModal, setShowUpdateKpiModal] = useState(false);
  const [selectedRubric, setSelectedRubric] = useState(null);

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
    return date.toLocaleDateString("en-US", options);
  };
  const year = new Date().getFullYear();
  const periodOptions = [
    { value: "Q1 " + year, label: "Q1 " + year },
    { value: "Q2 " + year, label: "Q2 " + year },
    { value: "Q3 " + year, label: "Q3 " + year },
    { value: "Q4 " + year, label: "Q4 " + year },
    { value: "Year " + year.toString(), label: "Year " + year.toString() },
    {
      value: "Year " + (year - 1).toString(),
      label: "Year " + (year - 1).toString(),
    },
  ];
  const fetchKpiData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(`http://localhost:3000/kpi/`, config);
      setKpiData(response.data);
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
        `http://localhost:3000/kpi/kpi_team_member/${teamId}`,
        config
      );
      setKpiTeamData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKpiData();
  }, []);

  const handleMemberKpiClick = (row) => {
    setSelectedRubric(row);
    console.log(row);
    setShowMemberKpiModal(true);
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
        `http://localhost:3000/kpi/period`,
        {
          kpi_period: newPeriod,
          kpi_startdate: newStartDate,
          kpi_duedate: newDueDate,
        },
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
        `http://localhost:3000/kpi/period/update`, {
          kpi_period: newPeriod
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
      name: "Action",
      cell: (row) => (
        <>
          {row.status_approval !== "approve" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleMemberKpiClick(row)}
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
                  <div className="card-tools">
                    <div>
                      <button
                        className="btn btn-primary mr-2"
                        onClick={handleAddKpiClick}
                      >
                        + Add KPI Period
                      </button>
                      <button
                        className="btn btn-primary mr-2"
                        onClick={handleUpdateKpiClick}
                      >
                        + Update KPI Assessment
                      </button>
                    </div>
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
              <Select
                onChange={handleNewPeriodChange}
                options={periodOptions}
              />
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
          <Modal.Title>Update KPI Assessment</Modal.Title>
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
          <Modal.Title>Team KPI Detail</Modal.Title>
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
        show={showMemberKpiModal}
        onHide={() => setShowMemberKpiModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            {" "}
            {selectedRubric?.name && (
              <span>{selectedRubric.name} Assessment Progress</span>
            )}
          </Modal.Title>
          <Button variant="text" onClick={() => setShowMemberKpiModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p>
            asdjalksdjlakjsdlakjsdlakjsdlkajsdlkajsdlkajsdlkajsdlkajsdlkajsdlkajsdlkajsdlkajsdlkjakdsjlakjsdlakjsdlk
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EmployeePage;
