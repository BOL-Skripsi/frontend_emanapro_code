import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import "./style.css";

function RubricPage() {
  const [rubricData, setRubricData] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [showDetailRubricModal, setShowDetailRubricModal] = useState(false);
  const [selectedRubric, setSelectedRubric] = useState(null);

  const fetchAllRubric = async () => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/rubric/`, config);
      setRubricData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllRubric();
  }, []);

  const columns = [
    {
      name: "Rubric Category",
      selector: "category",
      sortable: true,
    },
    {
      name: "Rubric Metric",
      selector: "performance_metric",
      sortable: true,
    },
    {
      name: "Rubric Weight",
      selector: "weight",
      sortable: true,
    },
    {
      name: "Proposed By Manager",
      selector: "manager_name",
      sortable: true,
    },
    {
      name: "Affected Team",
      selector: "team_name",
      sortable: true,
    },
    {
      name: "Approval Status",
      selector: "status_approval",
      sortable: true,
      cell: (row) => <div>{row.status_approval?.toUpperCase()}</div>,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {row.status_approval !== "approve" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDetailRubricClick(row)}
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

  const handleDetailRubricClick = (row) => {
    setSelectedRubric(row);
    setShowDetailRubricModal(true);
  };
  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };
  const handleNewStatusChange = (event) => {
    setNewStatus(event.value);
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    console.log(selectedRubric);
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/rubric/${selectedRubric.uuid}/review`,
        {
          comment: newComment,
          status_approval: newStatus,
        },
        config
      );
      setShowDetailRubricModal(false);
      setNewComment("");
      setNewStatus("");
      fetchAllRubric();
    } catch (error) {
      console.error(error);
    }
  };

  const statusOptions = [
    { value: "approve", label: "Approve" },
    { value: "revision", label: "Revision" },
    { value: "not approve", label: "Not Approve" },
  ];

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Assessment Rubric Review</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">
                  Assessment Rubric Review
                </li>
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
                    data={rubricData}
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
        // size="xl"
        show={showDetailRubricModal}
        onHide={() => setShowDetailRubricModal(false)}
        dialogClassName="modal-90w"
      >
        <Modal.Header>
          <Modal.Title>
            Assessment Rubric for{" "}
            {selectedRubric?.team_name && (
              <span>{selectedRubric.performance_metric}</span>
            )}
          </Modal.Title>
          <Button
            variant="text"
            onClick={() => setShowDetailRubricModal(false)}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="card-body">
            <h5>Proposed Assessment Rubric</h5>
            <table>
              <tbody>
                <tr>
                  <th style={{ verticalAlign: "top" }}>Rubric Category</th>
                  <td style={{ verticalAlign: "top" }}>{selectedRubric?.category}</td>
                </tr>
                <tr>
                  <th style={{ verticalAlign: "top" }}>Performance Metric</th>
                  <td style={{ verticalAlign: "top" }}>{selectedRubric?.performance_metric}</td>
                </tr>
                <tr>
                  <th style={{ verticalAlign: "top" }}>Description</th>
                  <td style={{ verticalAlign: "top" }}>{selectedRubric?.description}</td>
                </tr>
                <tr>
                  <th style={{ verticalAlign: "top" }}>Criteria</th>
                  <td style={{ verticalAlign: "top" }}>{selectedRubric?.criteria}</td>
                </tr>
                <tr>
                  <th style={{ verticalAlign: "top" }}>Score System</th>
                  <td style={{ verticalAlign: "top" }}>
                    {selectedRubric?.score_system === "manual"
                      ? "Score 5-to-1"
                      : selectedRubric?.score_system}
                  </td>
                </tr>
                <tr>
                  <th style={{ verticalAlign: "top" }}>Data Source</th>
                  <td style={{ verticalAlign: "top" }}>{selectedRubric?.data_source}</td>
                </tr>
                <tr>
                  <th style={{ verticalAlign: "top" }}>Status Approval</th>
                  <td style={{ verticalAlign: "top" }}>{selectedRubric?.status_approval?.toUpperCase()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-body">
            <Form onSubmit={handleSubmitReview}>
              <h5>Review Answer</h5>
              <table style={{ padding: "10px" }}>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>Comment</strong>
                    </td>
                    <td style={{ paddingLeft: "5px", width: "100%" }}>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter review comment"
                        style={{ width: "100%" }}
                        value={newComment}
                        onChange={handleNewCommentChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>Status</strong>
                    </td>
                    <td style={{ paddingLeft: "5px", width: "100%" }}>
                      <Select
                        onChange={(event) => handleNewStatusChange(event)}
                        options={statusOptions}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <Button
                        style={{ marginTop: "10px" }}
                        variant="primary"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default RubricPage;
