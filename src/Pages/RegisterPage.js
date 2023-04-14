import React, { useState } from "react";
import axios from "axios";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signIn = useSignIn();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
      });
      navigate("/");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  function handleLogin() {
    navigate("/login");
  }

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      <div className="register-box">
        <div className="register-logo">
          <a href="../../index2.html">
          <b>e-Manapro</b>
          </a>
        </div>
        <div className="card">
          <div className="card-body register-card-body">
            <p className="login-box-msg">Register a new user</p>
            <form onSubmit={handleRegister}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-user" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Retype password"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Register
                  </button>
                </div>
              </div>
            </form>
            <p className="mb-0">
              Already registered?{" "}
              <a href="#" onClick={handleLogin} className="text-center">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
