import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Cookies from "js-cookie";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import Select from "react-select";
import axios from "axios";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function TaskPage() {
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [personalTasks, setPersonalTasks] = useState([]);
  const [detailTasks, setDetailTasks] = useState([]);
  const [detailTasksFile, setDetailTasksFile] = useState([]);
  const [newPersonalTasks, setNewPersonalTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [teamMemberData, setTeamMemberData] = useState([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDetailTaskModal, setShowDetailTaskModal] = useState(false);
  const [showAddTeamTaskModal, setShowAddTeamTaskModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDateTime, setNewTaskDueDateTime] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("");
  const [newTaskFile, setNewFileUpload] = useState();
  const [selectedTask, setSelectedTask] = useState(null);

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

  const fetchAllTasks = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/task/${userId}/personal`,
        config
      );
      setPersonalTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDetailTasks = async (taskId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/task/${taskId}`,
        config
      );
      setDetailTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDetailTasksFile = async (taskId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/task/${taskId}/file`,
        config
      );
      setDetailTasksFile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const columnsPersonal = [
    {
      name: "Task",
      selector: "task_name",
      sortable: true,
    },
    {
      name: "Description",
      selector: "description",
      sortable: true,
    },
    {
      name: "Priority",
      selector: "priority",
      sortable: true,
      cell: (row) => (
        <>
          <div>
            {row.priority ? (
              <Badge pill variant="primary" className="p-1" size="lg">
                {row.priority}
              </Badge>
            ) : (
              ""
            )}
          </div>
        </>
      ),
    },
    {
      name: "Start Date",
      selector: "start_time",
      sortable: true,
      cell: (row) => (
        <>
          <div>{row.start_time ? formatDate(row.start_time) : ""}</div>
        </>
      ),
    },
    {
      name: "Due Date",
      selector: "due_datetime",
      sortable: true,
      cell: (row) => (
        <>
          <div>{row.due_datetime ? formatDate(row.due_datetime) : ""}</div>
        </>
      ),
    },
    {
      name: "With Attachment",
      selector: "has_attachment",
      sortable: true,
      cell: (row) => (
        <>
          <div>{row.has_attachment.toUpperCase()}</div>
        </>
      ),
    },
    {
      name: "Status",
      selector: "status",
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
            onClick={() => handleDetailTaskClick(row)}
          >
            Detail
          </Button>
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

  const columnsTeam = [
    {
      name: "Task",
      selector: "name",
      sortable: true,
    },
    {
      name: "Description",
      selector: "description",
      sortable: true,
    },
    {
      name: "Assignee",
      selector: "assignee_name",
      sortable: true,
    },
    {
      name: "Due Date",
      selector: "due_date",
      sortable: true,
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
  };

  const handleSubmitTaskReview = async (event) => {
    event.preventDefault();
    // try {
    //   const config = {
    //     headers: {
    //       Authorization: `Bearer ${Cookies.get("_auth")}`,
    //       "content-type": "multipart/form-data",
    //     },
    //   };
    //   const formData = new FormData();
    //   formData.append("task_name", newTask);
    //   formData.append("description", newTaskDescription);
    //   formData.append("due_datetime", newTaskDueDateTime);
    //   formData.append("priority", newTaskPriority);
    //   formData.append("assign_to", userId);
    //   formData.append("status", "Proposed");
    //   formData.append("file", newTaskFile);
    //   await axios.post("http://localhost:3000/task/personal", formData, config);
    //   fetchPersonalTasks();
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const downloadFile = async (filename) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/task/download/${filename}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTeamTaskClick = (row) => {
    setSelectedTask(row);
    setShowAddTeamTaskModal(true);
  };
  const handleAddTaskClick = (row) => {
    setSelectedTask(row);
    setShowAddTaskModal(true);
  };
  const handleDetailTaskClick = (row) => {
    fetchDetailTasks(row.uuid);
    fetchDetailTasksFile(row.uuid);
    setSelectedTask(row);
    setShowDetailTaskModal(true);
  };
  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };
  const handleNewTaskDescriptionChange = (event) => {
    setNewTaskDescription(event.target.value);
  };
  const handleNewTaskDueDateTimeChange = (event) => {
    setNewTaskDueDateTime(event.target.value);
  };
  const handleNewTaskPriorityChange = (event) => {
    setNewTaskPriority(event.target.value);
  };
  const handleNewFileUploadChange = (event) => {
    setNewFileUpload(event.target.files[0]);
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Task Management</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Task Management</li>
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
          <Tabs defaultActiveKey="personal" id="task-tabs">
            <Tab eventKey="personal" title="Personal Task">
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-tools">
                        <div>
                          <button
                            className="btn btn-primary mr-2"
                            onClick={() => handleAddTaskClick()}
                          >
                            + Add Task
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <DataTable
                        columns={columnsPersonal}
                        data={personalTasks}
                        noHeader
                        pagination
                        customStyles={customStyles}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey="team" title="Team Task">
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-tools">
                        <div>
                          <button
                            className="btn btn-primary mr-2"
                            onClick={() => handleAddTeamTaskClick()}
                          >
                            + Add Team Task
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                    <DataTable
                        columns={columnsTeam}
                        data={teamTasks}
                        noHeader
                        pagination
                        customStyles={customStyles}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </section>
      <Modal
        show={showDetailTaskModal}
        onHide={() => setShowDetailTaskModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Detail of{" "}
            {selectedTask?.task_name && <span>{selectedTask.task_name}</span>}
          </Modal.Title>
          <Button variant="text" onClick={() => setShowDetailTaskModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitTaskReview}>
            <div className="card-body">
              <h5>Task Detail</h5>
              <table style={{ padding: "10px" }}>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>Task Name</strong>
                    </td>
                    <td style={{ verticalAlign: "top" }}>:</td>
                    <td style={{ paddingLeft: "5px" }}>
                      {detailTasks.task_name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>Description</strong>
                    </td>
                    <td style={{ verticalAlign: "top" }}>:</td>
                    <td style={{ paddingLeft: "5px" }}>
                      {detailTasks.description}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>Priority</strong>
                    </td>
                    <td style={{ verticalAlign: "top" }}>:</td>
                    <td style={{ paddingLeft: "5px" }}>
                      {detailTasks.priority}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>Start Date</strong>
                    </td>
                    <td style={{ verticalAlign: "top" }}>:</td>
                    <td style={{ paddingLeft: "5px" }}>
                      {detailTasks.start_time ? formatDate(detailTasks.start_time) : ''}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>Due Date</strong>
                    </td>
                    <td style={{ verticalAlign: "top" }}>:</td>
                    <td style={{ paddingLeft: "5px" }}>
                      {detailTasks.due_datetime ? formatDate(detailTasks.due_datetime) : ''}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>Attachment</strong>
                    </td>
                    <td style={{ verticalAlign: "top" }}>:</td>
                    {detailTasksFile.length > 0 ? (
                      <ul>
                        {detailTasksFile.map((file) => (
                          <li key={file.uuid}>
                            <a
                              onClick={() => downloadFile(file.file_name)}
                              style={{
                                color: "blue",
                                cursor: "pointer",
                                transition: "filter 0.2s ease",
                              }}
                            >
                              {file.file_name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No attachment"
                    )}
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>Status</strong>
                    </td>
                    <td style={{ verticalAlign: "top" }}>:</td>
                    <td style={{ paddingLeft: "5px" }}>{detailTasks.status}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="card-body">
              <h5>Task Answer</h5>

              <table style={{ padding: "10px" }}>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>Description</strong>
                    </td>
                    <td style={{ verticalAlign: "top" }}>:</td>
                    <td style={{ paddingLeft: "5px", width: "100%" }}>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter task answer description"
                        value={newTaskDescription}
                        style={{ width: "100%" }}
                        onChange={handleNewTaskDescriptionChange}
                        disabled={detailTasks.status === 'Proposed'}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: "top" }}>
                      <strong>File</strong>
                    </td>
                    <td style={{ verticalAlign: "top" }}>:</td>
                    <td style={{ paddingLeft: "5px", width: "100%" }}>
                      <Form.Control
                        type="file"
                        id="custom-file"
                        label="Choose file"
                        custom
                        multiple
                        onChange={handleNewFileUploadChange}
                        accept=".xlsx,.xls,.doc,.docx,.pdf,.zip,.rar,.ppt,.pptx"
                        disabled={detailTasks.status === 'Proposed'}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>
                      <Button
                        style={{ marginTop: "10px" }}
                        variant="primary"
                        type="submit"
                        disabled={detailTasks.status === 'Proposed'}
                      >
                        Submit
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal
        show={showAddTeamTaskModal}
        onHide={() => setShowAddTeamTaskModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Add Team Task</Modal.Title>
          <Button variant="text" onClick={() => setShowAddTeamTaskModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitTaskReview}>
            <Form.Group>
              <Form.Label>Task</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task"
                value={newTask}
                onChange={handleNewTaskChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter task description"
                value={newTaskDescription}
                onChange={handleNewTaskDescriptionChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newTaskDueDateTime}
                onChange={handleNewTaskDueDateTimeChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>With</Form.Label>
              <Select
                options={teamMemberData}
                placeholder="Select user"
                isMulti
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                value={newTaskPriority}
                onChange={handleNewTaskPriorityChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="fileUpload">
              <Form.Label>File Upload</Form.Label>
              <Form.Control
                type="file"
                id="custom-file"
                label="Choose file"
                custom
                multiple
                onChange={handleNewFileUploadChange}
                accept=".xlsx,.xls,.doc,.docx,.pdf,.zip,.rar,.ppt,.pptx"
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
    </div>
  );
}
export default TaskPage;
