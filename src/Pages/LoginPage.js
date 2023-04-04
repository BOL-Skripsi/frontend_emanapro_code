import React, { useState } from "react";
import axios from "axios";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const signIn = useSignIn();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: email,
        password: password,
      });
      console.log(response.data);

      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: {
          userId: response.data.user.id,
          userUuid: response.data.user.uuid,
        },
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  function handleRegister() {
    navigate("/register");
  }
  function handleForgot() {
    navigate("/forgot");
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center h-100"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div className="login-box">
        <div className="login-logo">
          <a href="../../index2.html">
            <b>e-Manapro</b>
          </a>
        </div>
        {/* /.login-logo */}
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Sign in to start your session</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  onChange={(event) => setPassword(event.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                  </div>
                </div>
                {/* /.col */}
                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
                {/* /.col */}
              </div>
            </form>
            {/* /.social-auth-links */}
            <p className="mb-1">
              <a href="#" onClick={handleForgot}>
                Forgot my password
              </a>
            </p>
            <p className="mb-0">
              <a href="#" onClick={handleRegister} className="text-center">
                Register
              </a>
            </p>
          </div>
          {/* /.login-card-body */}
        </div>
      </div>
    </div>
  );
}

export default Login;
