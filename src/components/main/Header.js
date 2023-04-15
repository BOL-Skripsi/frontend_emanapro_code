import React, { useState, useEffect } from "react";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Pusher from "pusher-js";
import { useAuthUser } from "react-auth-kit";
import Cookies from "js-cookie";
import axios from "axios";

function Header() {
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [roles, setRoles] = useState([]);
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [notif, setNotif] = useState([]);
  const [count, setCount] = useState(0);
  const [activeLink, setActiveLink] = useState("");
  function logout() {
    signOut();
    navigate("/login");
  }

  const fetchData = async () => {
    const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      console.log(auth().userChange);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/organization/${userId}/${orgId}/roles`,
        config
      );
      setRoles(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotifData = async () => {
    const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      console.log(auth().userChange);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/dashboard/notif/${userId}`,
        config
      );
      setCount((response.data ? Object.keys(response.data).length : 0));
      setNotif(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const pusher = new Pusher("7362041596af022ff4f1", {
      cluster: "ap1",
      encrypted: true,
    });
    console.log(pusher)
    console.log(roles.organization_role)
    const channel = pusher.subscribe(`${roles.organization_role}-channel`);
    channel.bind("broadcast-event", (data) => {
      console.log(data);
    });
    console.log(channel)
  }, [userId]);

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
        </ul>
      </nav>
    </div>
  );
}

export default Header;
