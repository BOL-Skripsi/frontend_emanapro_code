import React, { useState } from "react";
import Cookies from "js-cookie";
import { Button, Form } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import axios from "axios";

function ChangePage() {
  const auth = useAuthUser();
  const userId = auth().userUuid;

  const [formState, setFormState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    error: null,
    success: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value, error: null, success: null });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = formState;

    if (newPassword !== confirmPassword) {
      setFormState({
        ...formState,
        success: null,
        error: "New password and confirmation password do not match.",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/${userId}/password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("_auth")}`,
          },
        }
      );
      setFormState({
        ...formState,
        success: "Change Password Success",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        error: null,
      });
      console.log(response.data);
    } catch (error) {
      setFormState({
        ...formState,
        success: null,
        error: error.response?.data?.message || "An error occurred.",
      });
      console.error(error);
    }
  };

  const { oldPassword, newPassword, confirmPassword, error, success } =
    formState;

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Change Password</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Change Password</li>
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
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="old-password">Old Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="old-password"
                        name="oldPassword"
                        value={oldPassword}
                        placeholder="Input Your Old Password"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="new-password">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="new-password"
                        name="newPassword"
                        value={newPassword}
                        placeholder="Input Your New Password"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirm-password">
                        Retype New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Re-Input Your New Password"
                        className="form-control"
                        id="confirm-password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && (
                      <div className="alert alert-success">{success}</div>
                    )}
                    <button type="submit" className="btn btn-primary">
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ChangePage;
