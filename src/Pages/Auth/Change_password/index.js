import React, { useState } from "react";
import Cookies from "js-cookie";
import { Button, Form } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import axios from "axios";
function ChangePage() {
  const auth = useAuthUser();
  const userId = auth().userUuid;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // validate input
    if (newPassword !== confirmPassword) {
      setSuccess(null)
      setError("New password and confirmation password do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/auth/${userId}/password`,
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
      console.log(response.data);
      setSuccess('Change Password Success');
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError(null)
    } catch (error) {
      setSuccess(null)
      console.error(error);
      setError(error.response?.data?.message || "An error occurred.");
    }
  };

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
                        value={oldPassword}
                        placeholder="Input Your Old Password"
                        onChange={(event) => setOldPassword(event.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="new-password">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="new-password"
                        placeholder="Input Your New Password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
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
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        required
                      />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
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
