import React, { useState } from "react";
import DataTable from "react-data-table-component";

function EmployeePage() {
  const [employeeData, setEmployeeData] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      managerName: "Jane Doe",
      teamName: "Sales",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      managerName: "Bob Johnson",
      teamName: "Marketing",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      managerName: "Jane Doe",
      teamName: "IT",
    },
  ]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    managerName: "",
    teamName: "",
  });
  const [showForm, setShowForm] = useState(false);

  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
    },
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Manager Name",
      selector: "managerName",
      sortable: true,
    },
    {
      name: "Team Name",
      selector: "teamName",
      sortable: true,
    },
  ];

  const customStyles = {
    header: {
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newId = employeeData.length + 1;
    setEmployeeData([...employeeData, { id: newId, ...newEmployee }]);
    setNewEmployee({ name: "", email: "", managerName: "", teamName: "" });
    setShowForm(false);
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Employee</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Employee</li>
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
          {/* Small boxes (Stat box) */}
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title"></h3>
                  <div className="card-tools">
                    {showForm ? (
                      <button
                        className="btn btn-secondary mr-2"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => setShowForm(true)}
                      >
                        + Add Employee
                      </button>
                    )}
                  </div>
                </div>
                <div className="card-body">
                  {showForm ? (
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={newEmployee.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Email:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          value={newEmployee.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Manager Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="managerName"
                          value={newEmployee.managerName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Team Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="teamName"
                          value={newEmployee.teamName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
                    </form>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={employeeData}
                      noHeader
                      pagination
                      customStyles={customStyles}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EmployeePage;
