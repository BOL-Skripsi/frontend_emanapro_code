import React, { Component, useState } from "react";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
function Header() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");
  function logout() {
    signOut();
    navigate("/login");
  }

  return (
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#">
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          {/* Notifications Dropdown Menu */}
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-bell" />
              <span className="badge badge-warning navbar-badge">1</span>
            </a>
            <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span className="dropdown-item dropdown-header">
                0 Notifications
              </span>
              {/* <a href="#" className="dropdown-item">
                <i className="fas fa-file mr-2" /> Manager Membuat Rubric Baru
              </a> */}
              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item dropdown-footer">
                See All Notifications
              </a>
            </div>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link" data-toggle="dropdown" href="#">
              <i className="far fa-user" />
            </a>
            <div className="dropdown-menu dropdown-menu-md dropdown-menu-right">
              <NavLink
                to={"/change_password"}
                className={`nav-link ${
                  activeLink === "change_password" && "active"
                }`}
                onClick={() => setActiveLink("change_password")}
              >
                Change Password
              </NavLink>
              <a
                className="nav-link"
                data-widget="control-sidebar"
                onClick={logout}
                data-controlsidebar-slide="true"
                href="#"
                role="button"
              >
                {" "}
                Logout
              </a>
            </div>
          </li>
          {/* <li className="nav-item">
            <a
              className="nav-link"
              data-widget="control-sidebar"
              onClick={logout}
              data-controlsidebar-slide="true"
              href="#"
              role="button"
            >
              <i className="fas fa-sign-out-alt"></i>
            </a>
          </li> */}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
