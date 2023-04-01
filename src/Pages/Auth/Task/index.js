import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "js-cookie";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function TaskPage() {
  const [currentTasks, setCurrentTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { id } = "71152531-e247-467f-8839-b78c14d7f71e";

  const fetchCurrentTasks = async () => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/tasks/${orgId}/current`,
        config
      );
      setCurrentTasks(response.data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCompletedTasks = async () => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/tasks/${orgId}/completed`,
        config
      );
      setCompletedTasks(response.data.tasks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCurrentTasks();
    fetchCompletedTasks();
  }, []);

  const columns = [
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:3000/tasks/${id}`, newTask);
      setNewTask({
        taskName: "",
        description: "",
        assignee: "",
        dueDate: "",
        status: "",
      });
      fetchCurrentTasks();
      fetchCompletedTasks();
    } catch (error) {
      console.error(error);
    }
    setShowForm(false);
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
          <Tabs defaultActiveKey="current" id="task-tabs">
            <Tab eventKey="current" title="Current Task">
              {/* Small boxes (Stat box) */}
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-tools">
                        {showForm ? (
                          <button
                            className="btn btn-secondary mr-2"
                            onClick={() => setShowForm(false)}
                          >
                            Cancel
                          </button>
                        ) : (
                          <div>
                            <button
                              className="btn btn-primary mr-2"
                              onClick={() => setShowForm(true)}
                            >
                              + Add Task
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card-body">
                      {showForm ? (
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <label>Task Name:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={newTask.taskName}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  taskName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Description:</label>
                            <textarea
                              name="description"
                              className="form-control"
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  description: e.target.value,
                                })
                              }
                            ></textarea>
                          </div>
                          <div className="form-group">
                            <label>Assignee:</label>
                            <input
                              type="text"
                              className="form-control"
                              name="assignee"
                              value={newTask.assignee}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  assignee: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Due Date:</label>
                            <input
                              type="date"
                              className="form-control"
                              name="due_date"
                              value={newTask.dueDate}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  dueDate: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label>Status:</label>
                            <select
                              className="form-control"
                              name="status"
                              value={newTask.status}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  status: e.target.value,
                                })
                              }
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="done">Done</option>
                            </select>
                          </div>
                          <button type="submit" className="btn btn-primary">
                            Save
                          </button>
                        </form>
                      ) : (
                        <DataTable
                          columns={columns}
                          data={currentTasks}
                          noHeader
                          pagination
                          customStyles={customStyles}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey="completed" title="Complete Task">
              {/* Small boxes (Stat box) */}
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-tools"></div>
                    </div>
                    <div className="card-body">
                      <DataTable
                        columns={columns}
                        data={completedTasks}
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
    </div>
  );
}
export default TaskPage;
