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
  const [teamTasks, setTeamTasks] = useState([]);
  const [detailTasks, setDetailTasks] = useState([]);
  const [taskReply, setTaskReply] = useState([]);
  const [detailTasksFile, setDetailTasksFile] = useState([]);
  const [assignToData, setassignToData] = useState([]);
  // const [newPersonalTasks, setNewPersonalTasks] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [teamMemberData, setTeamMemberData] = useState([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDetailTaskModal, setShowDetailTaskModal] = useState(false);
  const [showDetailTaskTeamModal, setShowDetailTaskTeamModal] = useState(false);
  const [showAddTeamTaskModal, setShowAddTeamTaskModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTaskAssign, setNewTaskAssign] = useState("");
  const [newTaskAssignTo, setNewTaskAssignTo] = useState([]);
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

  const statusOptions = [
    { value: "approve", label: "Approve" },
    { value: "not approve", label: "Not Approve" },
  ];

  const statusTaskOptions = [
    { value: "complete", label: "Complete" },
    { value: "revision", label: "Revision" },
  ];

  const fetchMyTeamMember = async () => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/team/${userId}/myjuridiction`,
        config
      );
      const groupedOptions = response.data.reduce((acc, curr) => {
        const team = acc.find((option) => option.label === curr.team_name);
        if (team) {
          team.options.push({ value: curr.user_id, label: curr.user_name });
        } else {
          acc.push({
            label: curr.team_name,
            options: [{ value: curr.user_id, label: curr.user_name }],
          });
        }
        return acc;
      }, []);
      setTeamMemberData(groupedOptions);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyJuridictionPersonalTasks = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/task/${userId}/personal/manager`,
        config
      );
      console.log(response.data);
      setPersonalTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyJuridictionTeamTasks = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/task/${userId}/team/manager`,
        config
      );
      console.log(response.data);
      setTeamTasks(response.data);
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
        `${process.env.REACT_APP_BASE_URL}/task/reply/${taskId}`,
        config
      );
      setTaskReply(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeamTaskReply = async (taskInfo) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/task/team/reply`,{
          attachment_name : taskInfo.attachment_name,
          description : taskInfo.description,
          due_datetime : taskInfo.due_datetime,
          task_name : taskInfo.task_name,
          priority : taskInfo.priority,
          status : taskInfo.status
        },
        config
      );
      setTaskReply(response.data);
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
        `${process.env.REACT_APP_BASE_URL}/task/${taskId}`,
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
        `${process.env.REACT_APP_BASE_URL}/task/${taskId}/file`,
        config
      );
      setDetailTasksFile(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyTeamMember();
    fetchMyJuridictionPersonalTasks();
    fetchMyJuridictionTeamTasks();
  }, []);

  const columnsPersonal = [
    {
      name: "Task Name",
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
          <div style={{ fontSize: "16px" }}>
            {row.priority ? (
              <Badge
                pill
                bg={
                  row.priority === "High"
                    ? "danger"
                    : row.priority === "Medium"
                    ? "warning"
                    : "info"
                }
                className="p-1"
                size="lg"
              >
                <strong>{row.priority}</strong>
              </Badge>
            ) : (
              ""
            )}
          </div>
        </>
      ),
    },
    {
      name: "Assign To",
      selector: "user_name",
      sortable: true,
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
      selector: "has_files",
      sortable: true,
      cell: (row) => (
        <>
          <div>{row.has_files?.toUpperCase()}</div>
        </>
      ),
    },
    {
      name: "Approval Status",
      selector: "status",
      sortable: true,
      cell: (row) => (
        <>
          <div style={{ fontSize: "16px" }}>
            {row.status ? (
              <Badge
                pill
                bg={row.status === "not approve" ? "danger" : "info"}
                className="p-1"
                size="lg"
              >
                <strong>{row.status?.toUpperCase()}</strong>
              </Badge>
            ) : (
              ""
            )}
          </div>
        </>
      ),
    },
    {
      name: "Task Status",
      selector: "last_reply_status",
      sortable: true,
      cell: (row) => (
        <>
          <div style={{ fontSize: "16px" }}>
            {row.priority ? (
              <Badge
                pill
                bg={
                  row.last_reply_status === "Not Started"
                    ? "secondary"
                    : row.last_reply_status === "No Reply"
                    ? "warning"
                    : "success"
                }
                className="p-1"
                size="lg"
              >
                <strong>{row.last_reply_status?.toUpperCase()}</strong>
              </Badge>
            ) : (
              ""
            )}
          </div>
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
      name: "Team Name",
      selector: "team_name",
      sortable: true,
    },
    {
      name: "Task Name",
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
          <div style={{ fontSize: "16px" }}>
            {row.priority ? (
              <Badge
                pill
                bg={
                  row.priority === "High"
                    ? "danger"
                    : row.priority === "Medium"
                    ? "warning"
                    : "info"
                }
                className="p-1"
                size="lg"
              >
                <strong>{row.priority}</strong>
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
      name: "With Attachment",
      selector: "attachment",
      sortable: true,
      cell: (row) => (
        <>
          <div>{row.attachment?.toUpperCase()}</div>
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
            onClick={() => handleDetailTaskTeamClick(row)}
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
      formData.append("assign_to", newTaskAssign);
      formData.append("status", "approve");
      formData.append("file", newTaskFile);
      console.log(formData);
      await axios.post(`${process.env.REACT_APP_BASE_URL}/task/personal`, formData, config);
      fetchMyJuridictionPersonalTasks();
      setShowAddTaskModal(false);
      setNewTask("");
      setNewTaskDescription("");
      setNewTaskDueDateTime("");
      setNewTaskPriority("");
      setNewTaskAssign("");
      setNewFileUpload("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewCommentChange = (event) => {
    console.log(event.target.value);
    setNewComment(event.target.value);
  };
  const handleNewStatusChange = (event) => {
    setNewStatus(event.value);
  };

  const handleSubmitApproval = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/task/${selectedTask.uuid}/approval`,
        {
          comment: newComment,
          status: newStatus,
        }
      );
      setShowDetailTaskModal(false);

      fetchMyJuridictionPersonalTasks();
      setNewComment("");
      setNewStatus("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitTeamTask = async (event) => {
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
      formData.append("assign_to", JSON.stringify(newTaskAssignTo));
      formData.append("status", "approve");
      formData.append("file", newTaskFile);
      await axios.post(`${process.env.REACT_APP_BASE_URL}/task/team`, formData, config);
      fetchMyJuridictionPersonalTasks();
      setShowAddTeamTaskModal(false);
      setNewTask("");
      setNewTaskDescription("");
      setNewTaskDueDateTime("");
      setNewTaskPriority("");
      setNewTaskAssignTo("");
      setNewFileUpload("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleManagerReply = async (event) => {
    event.preventDefault();
    try {
      console.log(newComment);
      const taskId = selectedTask.uuid;
      await axios.put(`${process.env.REACT_APP_BASE_URL}/task/${taskId}/manager_reply`, {
        description: newComment,
        status: newStatus,
      });
      setShowDetailTaskModal(false);
      setNewComment("");
      setNewStatus("");
      fetchMyJuridictionPersonalTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const downloadFile = async (filename) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/task/download/${filename}`,
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
    setNewTask("");
    setNewTaskDescription("");
    setNewTaskDueDateTime("");
    setNewTaskPriority("");
    setNewTaskAssignTo("");
    setNewFileUpload("");
    setShowAddTeamTaskModal(true);
  };
  const handleAddTaskClick = (row) => {
    setSelectedTask(row);
    setNewTask("");
    setNewTaskDescription("");
    setNewTaskDueDateTime("");
    setNewTaskPriority("");
    setNewTaskAssign("");
    setNewFileUpload("");
    setShowAddTaskModal(true);
  };
  const handleDetailTaskClick = (row) => {
    fetchDetailTasks(row.uuid);
    fetchDetailTasksFile(row.uuid);
    fetchTaskReply(row.uuid);
    setSelectedTask(row);
    setShowDetailTaskModal(true);
  };

  const handleDetailTaskTeamClick = (row) => {
    fetchTeamTaskReply(row);
    setSelectedTask(row);
    setShowDetailTaskTeamModal(true);
  };

  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };
  const handleNewTaskAssignChange = (event) => {
    setNewTaskAssign(event.value);
  };
  const handleNewTaskAssignToChange = (event) => {
    setNewTaskAssignTo(event);
  };
  const handleNewTaskDescriptionChange = (event) => {
    console.log(event);
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
              <Form.Label>Assign To</Form.Label>
              <Select
                options={teamMemberData}
                placeholder="Select user"
                onChange={handleNewTaskAssignChange}
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
            <table style={{ padding: "10px", paddingLeft: "5px" }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Task Name</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {detailTasks.task_name}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Description</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {detailTasks.description}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Priority</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {detailTasks.priority ? (
                      <Badge
                        pill
                        bg={
                          detailTasks.priority === "High"
                            ? "danger"
                            : detailTasks.priority === "Medium"
                            ? "warning"
                            : "info"
                        }
                        className="p-1"
                        size="lg"
                      >
                        <strong>{detailTasks.priority}</strong>
                      </Badge>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
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
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
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
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Attachment</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
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
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Status</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {detailTasks.status ? (
                      <Badge
                        pill
                        bg={
                          detailTasks.status === "not approve"
                            ? "danger"
                            : "info"
                        }
                        className="p-1"
                        size="lg"
                      >
                        <strong>{detailTasks.status?.toUpperCase()}</strong>
                      </Badge>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {detailTasks.status === "approve" ? (
            <div className="card-body">
              <h5>Task Reply</h5>
              <Form onSubmit={handleManagerReply}>
                <table style={{ padding: "10px" }}>
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
                              <strong>{selectedTask?.user_name}</strong>
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
                    {taskReply.length > 0 &&
                    taskReply[Object.keys(taskReply).length - 1]
                      ?.reply_status !== "complete" ? (
                      <>
                        <tr>
                          <td
                            style={{ paddingLeft: "5px", paddingTop: "30px" }}
                          >
                            <b>Comment</b>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ paddingLeft: "5px", width: "100%" }}
                            colSpan={"4"}
                          >
                            <Form.Control
                              as="textarea"
                              required
                              placeholder="Enter task answer description"
                              value={newComment}
                              style={{ width: "100%" }}
                              onChange={handleNewCommentChange}
                              disabled={detailTasks.status === "Proposed"}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingLeft: "5px", paddingTop: "5px" }}>
                            <b>Status</b>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ paddingLeft: "5px", width: "100%" }}
                            colSpan={"3"}
                          >
                            <Select
                              onChange={(event) => handleNewStatusChange(event)}
                              options={statusTaskOptions}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <Button
                              style={{ marginLeft: "5px", marginTop: "10px" }}
                              variant="primary"
                              type="submit"
                              disabled={detailTasks.status === "Proposed"}
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
                            : "Waiting for reply"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Form>
            </div>
          ) : detailTasks.status === "approve" ? (
            <div className="card-body">
              <Form onSubmit={handleSubmitApproval}>
                <h5>Task Approval</h5>
                <table style={{ padding: "10px" }} width={"100%"}>
                  <tbody>
                    <tr>
                      <td style={{ paddingLeft: "5px", width: "100%" }}>
                        <strong>Comment</strong>
                      </td>
                    </tr>
                    <tr>
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
                      <td style={{ paddingLeft: "5px", paddingTop: "5px" }}>
                        <b>Status</b>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: "5px", width: "100%" }}>
                        <Select
                          onChange={(event) => handleNewStatusChange(event)}
                          options={statusOptions}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: "5px", width: "100%" }}>
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
          ) : (
            <div className="card-body">
              <h5>Your Approval</h5>
              <div>{detailTasks.manager_comment}</div>
            </div>
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
              <Form.Label>Assign To</Form.Label>
              <Select
                options={teamMemberData}
                placeholder="Select user"
                value={newTaskAssignTo}
                onChange={handleNewTaskAssignToChange}
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

      <Modal
        show={showDetailTaskTeamModal}
        onHide={() => setShowDetailTaskTeamModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Detail of{" "}
            {selectedTask?.task_name && <span>{selectedTask.task_name}</span>}
          </Modal.Title>
          <Button
            variant="text"
            onClick={() => setShowDetailTaskTeamModal(false)}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="card-body">
            <h5>Team Task Detail</h5>
            <table style={{ padding: "10px", paddingLeft: "5px" }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Task Name</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {selectedTask?.task_name}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Description</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {selectedTask?.description}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Priority</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {selectedTask?.priority ? (
                      <Badge
                        pill
                        bg={
                          selectedTask?.priority === "High"
                            ? "danger"
                            : selectedTask?.priority === "Medium"
                            ? "warning"
                            : "info"
                        }
                        className="p-1"
                        size="lg"
                      >
                        <strong>{selectedTask?.priority}</strong>
                      </Badge>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Due Date</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {selectedTask?.due_datetime
                      ? formatDate(selectedTask.due_datetime)
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Start Date</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {selectedTask?.start_time
                      ? formatDate(selectedTask.start_time)
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Attachment</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td style={{ paddingLeft: "5px" }}>
                    {selectedTask?.attachment_name ? (
                      <>
                        <a
                          onClick={() =>
                            downloadFile(selectedTask.attachment_name)
                          }
                          style={{
                            color: "blue",
                            cursor: "pointer",
                            transition: "filter 0.2s ease",
                          }}
                        >
                          {selectedTask.attachment_name}
                        </a>
                      </>
                    ) : (
                      "No attachment"
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: "top", paddingLeft: "5px" }}>
                    <strong>Assign To</strong>
                  </td>
                  <td style={{ verticalAlign: "top" }}>:</td>
                  <td>
                    <ul>
                      {selectedTask?.assign_to.split(",")?.map((e, index) => 
                        <>
                        <li key={index}>
                          {e.trim()}
                        </li>
                        </>
                      )}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-body">
            <h5>Task Reply</h5>
            <Form onSubmit={handleManagerReply}>
              <table style={{ padding: "10px" }}>
                <tbody>
                  {/* {teamTaskReply.length > 0 ? (
                    teamTaskReply.map((data) => (
                      <>
                        <tr>
                          <td
                            style={{
                              verticalAlign: "top",
                              width: "20%",
                              paddingLeft: "5px",
                            }}
                          >
                            <strong>{selectedTask?.user_name}</strong>
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
                  {taskReply.length > 0 ? (
                    <>
                      <tr>
                        <td style={{ paddingLeft: "5px", paddingTop: "30px" }}>
                          <b>Comment</b>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ paddingLeft: "5px", width: "100%" }}
                          colSpan={"4"}
                        >
                          <Form.Control
                            as="textarea"
                            required
                            placeholder="Enter task answer description"
                            value={newComment}
                            style={{ width: "100%" }}
                            onChange={handleNewCommentChange}
                            disabled={detailTasks.status === "Proposed"}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingLeft: "5px", paddingTop: "5px" }}>
                          <b>Status</b>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{ paddingLeft: "5px", width: "100%" }}
                          colSpan={"3"}
                        >
                          <Select
                            onChange={(event) => handleNewStatusChange(event)}
                            options={statusTaskOptions}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <Button
                            style={{ marginLeft: "5px", marginTop: "10px" }}
                            variant="primary"
                            type="submit"
                            disabled={detailTasks.status === "Proposed"}
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
                        Waiting for reply
                      </td>
                    </tr>
                  )} */}
                </tbody>
              </table>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default TaskPage;
