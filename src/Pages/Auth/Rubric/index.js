import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

function RubricPage() {
  const [showModal, setShowModal] = useState(false);
  const [rubricList, setRubricList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    weight: "",
    target: "",
    minimum: "",
    maximum: "",
    metric: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:3000/rubric", formData);
      setFormData({
        name: "",
        description: "",
        weight: "",
        target: "",
        minimum: "",
        maximum: "",
        metric: "",
      });
      setShowModal(false);
      fetchRubricList();
    } catch (error) {
      console.error(error);
    }
  };

  const navigate = useNavigate();
  //   const signIn = useSignIn();

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const fetchRubricList = async () => {
    try {
      const response = await axios.get("http://localhost:3000/rubric");
      setRubricList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRubricList();
    console.log(rubricList);
  }, []);

  //   const handleEditRubric = (rubricId) => {
  //     navigate(`/rubrics/${rubricId}/edit`);
  //   };

  const handleDeleteRubric = async (rubricId) => {
    try {
      await axios.delete(`http://localhost:3000/rubric/${rubricId}`);
      setRubricList(rubricList.filter((rubric) => rubric.id !== rubricId));
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
              <h1 className="m-0">Assessment Rubric</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Assessment Rubric</li>
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
                  <h3 className="card-title"></h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleModalOpen}
                    >
                      + Add Assessment Rubric
                    </button>
                  </div>
                </div>
                {/* /.card-header */}
                <div className="card-body">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Weight</th>
                        <th>Target</th>
                        <th>Minimum</th>
                        <th>Maximum</th>
                        <th>Metric</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rubricList.map((rubric) => (
                        <tr key={rubric.id}>
                          <td>{rubric.name}</td>
                          <td>{rubric.description}</td>
                          <td>{rubric.weight.toLocaleString()}</td>
                          <td>{rubric.target.toLocaleString()}</td>
                          <td>{rubric.minimum.toLocaleString()}</td>
                          <td>{rubric.maximum.toLocaleString()}</td>
                          <td>{rubric.metric}</td>
                          <td>
                            {/* Edit Button */}
                            {/* <button
          type="button"
          className="btn btn-primary btn-sm mr-2"
          onClick={() => handleEditRubric(rubric.id)}
        >
          <i className="fas fa-edit"></i>
        </button> */}
                            {/* Delete Button */}
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteRubric(rubric.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* /.card-body */}
              </div>
              {/* /.card */}
            </div>
            {/* /.col */}
          </div>
          {/* /.row (main row) */}
        </div>
        {/* /.container-fluid */}
      </section>
      {/* /.content */}

      {/* Assessment Rubric Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Assessment Rubric</h4>
              <button
                type="button"
                className="close"
                onClick={handleModalClose}
              >
                &times;
              </button>
            </div>
            <div
              className="modal-body"
              style={{ height: "400px", overflowY: "auto" }}
            >
              {/* Add Assessment Rubric Form Here */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="weight">Weight:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="target">Target:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="target"
                    name="target"
                    value={formData.target}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="minimum">Minimum:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="minimum"
                    name="minimum"
                    value={formData.minimum}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="maximum">Maximum:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="maximum"
                    name="maximum"
                    value={formData.maximum}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="metric">Metric:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="metric"
                    name="metric"
                    value={formData.metric}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleModalClose}
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
          {/* /.modal-content */}
        </div>
        {/* /.modal-dialog */}
      </div>
      {/* /.modal */}
    </div>
  );
}
export default RubricPage;
