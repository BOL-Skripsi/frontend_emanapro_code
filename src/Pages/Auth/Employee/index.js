import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import Select from "react-select";

function EmployeePage() {
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [employeeData, setEmployeeData] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("employee");
  const [selectedEmployee, setSelectedEmployee] = useState(null);



  const fetchEmployeeList = async () => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/organization/${orgId}/employee`,
        config
      );
      console.log(response.data);
      setEmployeeData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployeeList();
  }, []);

  const columns = [
    {
      name: "Employee Name",
      selector: "user_name",
      sortable: true,
    },
    {
      name: "Employee Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Employee Manager",
      selector: "manager_name",
      sortable: true,
    },
    {
      name: "Member Of Team",
      selector: "team_name",
      sortable: true,
    },
    // {
    //   name: "Action",
    //   cell: (row) => (
    //     <>
    //       <Button
    //         variant="primary"
    //         size="sm"
    //         onClick={() => handleProfileClick(row)}
    //       >
    //         Profile
    //       </Button>
    //     </>
    //   ),
    //   button: true,
    //   style: {
    //     width: "20%",
    //     minWidth: "200px",
    //     textAlign: "center",
    //   },
    // },
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

  const handleProfileClick = () => {
    setShowProfileModal(true);
  };

  const handleAddNewUserClick = () => {
    setShowAddUserModal(true);
  };

  const handleNewUserNameChange = (event) => {
    setNewUserName(event.target.value);
  };
  const handleNewUserEmailChange = (event) => {
    setNewUserEmail(event.target.value);
  };
  const handleNewUserRoleChange = (event) => {
    console.log(event.target.value)
    setNewUserRole(event.target.value);
  };
  const handleSubmitInvite = async (event) => {
    event.preventDefault();
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `http://localhost:3000/organization/${orgId}/invite/${newUserRole}`,
        {
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
        },
        config
      );
      setShowAddUserModal(false);
      fetchEmployeeList();
      setNewUserName("");
      setNewUserEmail("");
      setNewUserRole("");
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
              <h1 className="m-0">Employee Management</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Employee Management</li>
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
                        onClick={handleAddNewUserClick}
                      >
                        + Add Employee
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns}
                    data={employeeData}
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
      <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)}>
        <Modal.Header>
          <Modal.Title>Add Employee</Modal.Title>
          <Button variant="text" onClick={() => setShowAddUserModal(false)}>
            X
          </Button>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmitInvite}>
            <Form.Group>
              <Form.Label>Employee Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter employee name"
                value={newUserName}
                onChange={handleNewUserNameChange}
              />
            </Form.Group>
            <Form.Group >
              <Form.Label>Employee Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter employee email"
                value={newUserEmail}
                onChange={handleNewUserEmailChange}
              />
            </Form.Group>
            <Form.Group >
              <Form.Label>Employee Role</Form.Label>
              <Form.Control
                as="select"
                value={newUserRole}
                onChange={handleNewUserRoleChange}
              >
                <option value="employee">Employee</option>
                <option value="hrd">HRD</option>
                <option value="manager">Manager</option>
              </Form.Control>
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

      {/* Add Team Task Modal */}
      {/* <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            Add Task to {selectedEmployee?.name && <span>{selectedEmployee.name}</span>}
          </Modal.Title>
          <Button variant="text" onClick={() => setShowProfileModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body> */}
          {/* <Form onSubmit={handleSubmitProfile}>
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
              <Select
                options={teamMemberData}
                placeholder="Select user"
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
          </Form> */}
        {/* </Modal.Body>
      </Modal> */}
    </div>
  );
}

export default EmployeePage;
