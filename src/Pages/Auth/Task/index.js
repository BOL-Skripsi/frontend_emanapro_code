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
  const [taskReply, setTaskReply] = useState([]);
  const [currentTeam, setCurrentTeam] = useState([]);
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
  const [newTaskReplyFile, setNewReplyFileUpload] = useState();
  const [newTaskReplyDescription, setNewTaskReplyDescription] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

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

  const fetchMyTeam = async () => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/team/${userId}/me`,
        config
      );
      console.log(response.data.team);
      setCurrentTeam(response.data.team);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPersonalTasks = async () => {
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

  const fetchTaskReply = async (taskId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/task/reply/${taskId}`,
        config
      );
      setTaskReply(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeamTasks = async () => {
    try {
      console.log(currentTeam);
      const teamId = "";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/task/${teamId}/team`,
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
    fetchMyTeam();
    fetchPersonalTasks();
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
      name: "Approval Status",
      selector: "status",
      sortable: true,
      cell: (row) => (
        <>
          <div>{row.status?.toUpperCase()}</div>
        </>
      ),
    },
    {
      name: "Task Status",
      selector: "last_reply_status",
      sortable: true,
      cell: (row) => (
        <>
          <div>{row.last_reply_status?.toUpperCase()}</div>
        </>
      ),
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

  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const handleSubmitPersonalTask = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
          "content-type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      formData.append("task_name", newTask);
      formData.append("description", newTaskDescription);
      formData.append("due_datetime", newTaskDueDateTime);
      formData.append("priority", newTaskPriority);
      formData.append("assign_to", userId);
      formData.append("status", "proposed");
      formData.append("file", newTaskFile);
      await axios.post("http://localhost:3000/task/personal", formData, config);
      fetchPersonalTasks();
      setNewTask("");
      setNewTaskDescription("");
      setNewTaskDueDateTime("");
      setNewTaskPriority("");
      setNewFileUpload("");
      setShowAddTaskModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitTeamTask = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:3000/tasks/${userId}`);
      fetchPersonalTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitStartTask = async (event) => {
    event.preventDefault();
    try {
      const taskId = selectedTask.uuid;
      const currentDate = new Date();
      const isoDate =
        currentDate.getFullYear() +
        "-" +
        (currentDate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        currentDate.getDate().toString().padStart(2, "0") +
        "T" +
        currentDate.getHours().toString().padStart(2, "0") +
        ":" +
        currentDate.getMinutes().toString().padStart(2, "0");
      await axios.put(`http://localhost:3000/task/${userId}/${taskId}/start`, {
        start_time: isoDate,
      });
      fetchPersonalTasks();
      setShowDetailTaskModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitReplyTask = async (event) => {
    event.preventDefault();
    try {
      const taskId = selectedTask.uuid;
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
          "content-type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      formData.append("description", newTaskReplyDescription);
      formData.append("file", newTaskReplyFile);
      await axios.post(
        `http://localhost:3000/task/${userId}/${taskId}/reply`,
        formData,
        config
      );
      fetchPersonalTasks();
      setShowDetailTaskModal(false);
      setNewTaskReplyDescription("");
      setNewReplyFileUpload("");
    } catch (error) {
      console.error(error);
    }
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
    fetchTeamTasks();
    setShowAddTeamTaskModal(true);
  };
  const handleAddTaskClick = (row) => {
    setSelectedTask(row);
    setShowAddTaskModal(true);
  };
  const handleDetailTaskClick = (row) => {
    fetchDetailTasks(row.uuid);
    fetchDetailTasksFile(row.uuid);
    fetchTaskReply(row.uuid);
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
    setNewTaskPriority(event);
  };
  const handleNewFileUploadChange = (event) => {
    setNewFileUpload(event.target.files[0]);
  };

  const handleNewTaskReplyDescriptionChange = (event) => {
    setNewTaskReplyDescription(event.target.value);
  };
  const handleNewReplyFileUploadChange = (event) => {
    setNewReplyFileUpload(event.target.files[0]);
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Task</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Task</li>
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
            {console.log(currentTeam)}
            {Object.keys(currentTeam).length > 0 && (
              <Tab eventKey="team" title="Team Task">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      {/* <div className="card-header">
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
                      </div> */}
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
            )}
          </Tabs>
        </div>
      </section>
      <Modal show={showAddTaskModal} onHide={() => setShowAddTaskModal(false)}>
        <Modal.Header>
          <Modal.Title>Add Personal Task</Modal.Title>
          <Button variant="text" onClick={() => setShowAddTaskModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitPersonalTask}>
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
              <Form.Label>Priority</Form.Label>
              <Select
                onChange={(event) => handleNewTaskPriorityChange(event.value)}
                options={priorityOptions}
              />
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
                  <td style={{ paddingLeft: "5px" }}>{detailTasks.priority}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top" }}>
                    <strong>Due Date</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {detailTasks.due_datetime
                      ? formatDate(detailTasks.due_datetime)
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top" }}>
                    <strong>Start Date</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {detailTasks.start_time
                      ? formatDate(detailTasks.start_time)
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top" }}>
                    <strong>Attachment</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    {detailTasksFile.length > 0 ? (
                      <>
                        {detailTasksFile.map((file) => (
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
                        ))}
                      </>
                    ) : (
                      "No attachment"
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top" }}>
                    <strong>Status</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {detailTasks.status?.toUpperCase()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {!detailTasks.start_time && detailTasks.status === "approve" ? (
            <Form onSubmit={handleSubmitStartTask}>
              <div className="card-body">
                <h5>Manager Approval</h5>
                <div>{detailTasks.manager_comment}</div>
              </div>
              <div className="card-body">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={detailTasks.status === "proposed"}
                  style={{ width: "100%" }}
                >
                  Start Task
                </Button>
              </div>
            </Form>
          ) : (
            ""
          )}
          {detailTasks.start_time && detailTasks.status !== "not approve" ? (
            <div>
              <div className="card-body">
                <h5>Manager Approval</h5>
                <div>{detailTasks.manager_comment}</div>
              </div>
              <div className="card-body">
                <h5>Task Reply</h5>
                <Form onSubmit={handleSubmitReplyTask}>
                  <table
                    style={{
                      padding: "10px",
                      width: "100%",
                    }}
                  >
                    <tbody>
                      {taskReply.length > 0 ? (
                        taskReply.map((data) => (
                          <>
                            <tr>
                              <td
                                style={{
                                  verticalAlign: "top",
                                  width: "20%",
                                  paddingLeft: "5px",
                                }}
                              >
                                <strong>Your Reply</strong>
                              </td>
                              <td
                                style={{
                                  verticalAlign: "top",
                                }}
                                width="1%"
                              >
                                :
                              </td>
                              <td
                                style={{
                                  paddingLeft: "5px",
                                  width: "80%",
                                }}
                                colSpan={"3"}
                              >
                                {data.reply_comment}
                              </td>
                            </tr>
                            <tr>
                              <td></td>
                              <td></td>
                              <td style={{ paddingLeft: "5px" }}>
                                <a
                                  onClick={() => downloadFile(data.file_name)}
                                  style={{
                                    color: "blue",
                                    cursor: "pointer",
                                    transition: "filter 0.2s ease",
                                  }}
                                >
                                  {data.file_name}
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  verticalAlign: "top",
                                  width: "20%",
                                  paddingLeft: "5px",
                                }}
                              >
                                <strong>Manager</strong>
                              </td>
                              <td
                                style={{
                                  verticalAlign: "top",
                                }}
                                width="1%"
                              >
                                :
                              </td>
                              <td
                                style={{
                                  paddingLeft: "5px",
                                  width: "80%",
                                }}
                                colSpan={"3"}
                              >
                                {data.revision_comment}
                              </td>
                            </tr>
                            <tr>
                              <td></td>
                              <td></td>
                              <td style={{ paddingLeft: "5px", color: "red" }}>
                                {data.reply_status?.toUpperCase()}
                              </td>
                            </tr>
                          </>
                        ))
                      ) : (
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      )}
                      {taskReply[Object.keys(taskReply).length - 1]
                        ?.reply_status !== "complete" && taskReply[Object.keys(taskReply).length - 1]
                        ?.reply_status ? (
                        <>
                          <tr>
                            <td
                              style={{
                                paddingLeft: "5px",
                                verticalAlign: "top",
                              }}
                              colSpan={"3"}
                            >
                              <strong>Comment</strong>
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{ paddingLeft: "5px", width: "100%" }}
                              colSpan={"3"}
                            >
                              <Form.Control
                                as="textarea"
                                placeholder="Enter task reply description"
                                style={{ width: "100%" }}
                                onChange={handleNewTaskReplyDescriptionChange}
                                disabled={detailTasks.status === "proposed"}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{ paddingLeft: "5px", width: "100%" }}
                              colSpan={"3"}
                            >
                              <Form.Control
                                type="file"
                                id="custom-file"
                                label="Choose file"
                                custom
                                multiple
                                onChange={handleNewReplyFileUploadChange}
                                accept=".xlsx,.xls,.doc,.docx,.pdf,.zip,.rar,.ppt,.pptx"
                                disabled={detailTasks.status === "proposed"}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={"3"} style={{ paddingLeft: "5px" }}>
                              <Button
                                style={{ marginTop: "10px" }}
                                variant="primary"
                                type="submit"
                                disabled={detailTasks.status === "proposed"}
                              >
                                Submit
                              </Button>
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td
                            colSpan={"3"}
                            style={{ textAlign: "center", width: "100%" }}
                          >
                            {taskReply[Object.keys(taskReply).length - 1]
                              ?.reply_status === "complete"
                              ? ""
                              : "Waiting for manager reply"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Form>
              </div>
            </div>
          ) : detailTasks.status === "not approve" ? (
            <div className="card-body">
              <h5>Manager Approval</h5>
              <div>{detailTasks.manager_comment}</div>
            </div>
          ) : (
            ""
          )}
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
          <Form onSubmit={handleSubmitTeamTask}>
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
              <Select
                onChange={(event) => setNewTaskPriority(event.value)}
                options={priorityOptions}
              />
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
