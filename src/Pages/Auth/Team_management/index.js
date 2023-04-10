import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import Select from "react-select";

function TeamPage() {
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [teamData, setTeamData] = useState([]);
  const [thisTeamMember, setThisTeamMember] = useState([]);
  const [teamMemberData, setTeamMemberData] = useState([]);
  const [avaliableData, setAvailableData] = useState([]);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showDetailTeamModal, setShowDetailTeamModal] = useState(false);
  const [showAddTeamTaskModal, setShowAddTeamTaskModal] = useState(false);
  const [newTeamMemberName, setNewTeamMemberName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskAssignTo, setnewTaskAssignTo] = useState([]);
  const [newTaskDueDateTime, setNewTaskDueDateTime] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("");
  const [newTaskFile, setNewFileUpload] = useState([]);
  const [newTeamTask, setNewTeamTask] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeamList = async () => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/team/${orgId}/${userId}/list`,
        config
      );
      setTeamData(response.data.teams);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMemberList = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/team/avaliable`,
        config
      );
      const transformedData = response.data.teams.map((item) => ({
        value: item.uuid,
        label: item.name,
      }));
      setAvailableData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeamMemberList = async (teamId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/team/${teamId}/member`,
        config
      );
      const transformedData = response.data.teams.map((item) => ({
        value: item.uuid,
        label: item.name,
      }));
      setTeamMemberData(transformedData);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchThisTeamMemberList = async (teamId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/team/${teamId.uuid}/member/list`,
        config
      );
      setThisTeamMember(response.data.teams);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTeamList();
    fetchMemberList();
  }, []);

  const columns = [
    {
      name: "Team",
      selector: "name",
      sortable: true,
    },
    {
      name: "Description",
      selector: "description",
      sortable: true,
    },
    {
      name: "Manager",
      selector: "manager_name",
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
      name: "Action",
      cell: (row) => (
        <>
          <Button
            style={{ marginLeft: 10 }}
            variant="success"
            size="sm"
            onClick={() => handleDetailTeamClick(row)}
          >
            Detail
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            variant="warning"
            size="sm"
            onClick={() => handleAddTeamMemberClick(row)}
          >
            Add Member
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

  const columnsTeamDetail = [
    {
      name: "Team Member Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Contact Information",
      selector: "email",
      sortable: true,
    }
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
  

  const handleAddTeamClick = () => {
    setShowAddTeamModal(true);
  };

  const handleAddTeamTaskClick = (row) => {
    setSelectedTeam(row);
    setShowAddTeamTaskModal(true);
    fetchTeamMemberList(row.uuid); // Assuming row has an "id" property
  };

  const handleDetailTeamClick = (row) => {
    setSelectedTeam(row);
    fetchThisTeamMemberList(row);
    setShowDetailTeamModal(true);
  };

  const handleNewTeamNameChange = (event) => {
    setNewTeamName(event.target.value);
  };
  const handleNewTeamDescriptionChange = (event) => {
    setNewTeamDescription(event.target.value);
  };

  const handleNewTeamTaskChange = (event) => {
    setNewTeamTask(event.target.value);
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
    setNewFileUpload(event.target.value);
  };
  const handleAddTeamMemberClick = (row) => {
    setSelectedTeam(row);
    console.log(row);
    setShowAddTeamMemberModal(true);
  };

  const handleSubmitAddTeam = async (event) => {
    event.preventDefault();
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/team/${orgId}/`,
        {
          name: newTeamName,
          description: newTeamDescription,
          manager: userId,
        },
        config
      );
      fetchTeamList();
      setTeamData([...teamData, response.data.team]);
      setShowAddTeamModal(false);
      setNewTeamName("");
      setNewTeamDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitAddTeamTask = async (event) => {
    event.preventDefault();

    try {
      // perform any necessary validation on form data here

      // make API call to add task
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const teamId = selectedTeam.id;
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/team/${orgId}/task/${teamId}/add`,
        {
          task: newTeamTask,
          description: newTaskDescription,
          dueDateTime: newTaskDueDateTime,
          priority: newTaskPriority,
          file: newTaskFile,
        },
        config
      );

      // update state to reflect new task added to selected team
      const updatedTeams = teamData.map((team) =>
        team.id === selectedTeam.id
          ? { ...team, tasks: [...team.tasks, response.data.task] }
          : team
      );
      setTeamData(updatedTeams);
      setShowAddTeamTaskModal(false);
      setSelectedTeam(null);
      setNewTeamTask("");
      setNewTaskDescription("");
      setNewTaskDueDateTime("");
      setNewTaskPriority("");
      setNewFileUpload("");
    } catch (error) {
      console.error(error);
      // handle error state here
    }
  };
  const handleSubmitAddTeamMember = async (event) => {
    event.preventDefault();
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const teamId = selectedTeam.uuid;
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/team/${orgId}/newmember`,
        {
          user_id: newTeamMemberName,
          team_id: teamId,
        },
        config
      );
      fetchMemberList();
      fetchTeamList();
      setShowAddTeamMemberModal(false);
      setSelectedTeam(null);
      setNewTeamMemberName("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Team Management</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Team Management</li>
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
                        onClick={handleAddTeamClick}
                      >
                        + Add Team
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns}
                    data={teamData}
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
      <Modal show={showAddTeamModal} onHide={() => setShowAddTeamModal(false)}>
        <Modal.Header>
          <Modal.Title>Add Team</Modal.Title>
          <Button variant="text" onClick={() => setShowAddTeamModal(false)}>
            X
          </Button>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmitAddTeam}>
            <Form.Group>
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter team name"
                value={newTeamName}
                onChange={handleNewTeamNameChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Team Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter team description"
                value={newTeamDescription}
                onChange={handleNewTeamDescriptionChange}
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
        show={showDetailTeamModal}
        onHide={() => setShowDetailTeamModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Team Detail</Modal.Title>
          <Button variant="text" onClick={() => setShowDetailTeamModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <DataTable
            columns={columnsTeamDetail}
            data={thisTeamMember}
            noHeader
            pagination
            customStyles={customStyles}
          />
        </Modal.Body>
      </Modal>

      {/* Add Team Task Modal */}
      <Modal
        show={showAddTeamTaskModal}
        onHide={() => setShowAddTeamTaskModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Add Task to {selectedTeam?.name && <span>{selectedTeam.name}</span>}
          </Modal.Title>
          <Button variant="text" onClick={() => setShowAddTeamTaskModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAddTeamTask}>
            <Form.Group>
              <Form.Label>Task</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task"
                value={newTeamTask}
                onChange={handleNewTeamTaskChange}
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
              <Select options={teamMemberData} placeholder="Select user" />
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
        show={showAddTeamMemberModal}
        onHide={() => setShowAddTeamMemberModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Add Member to{" "}
            {selectedTeam?.name && <span>{selectedTeam.name}</span>}
          </Modal.Title>
          <Button
            variant="text"
            onClick={() => setShowAddTeamMemberModal(false)}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitAddTeamMember}>
            <Form.Group controlId="teamMemberName">
              <Form.Label>Member Name</Form.Label>
              <Select
                onChange={(event) => setNewTeamMemberName(event.value)}
                options={avaliableData}
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

export default TeamPage;
