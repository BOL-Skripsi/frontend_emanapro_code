import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import Cookies from "js-cookie";

const SideNav = () => {
  const auth = useAuthUser();
  const userId = auth().userId;
  const [selectedOrg, setSelectedOrg] = useState("");
  const [roles, setRoles] = useState([]);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      setSelectedOrg(orgId);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${Cookies.get("_auth")}`,
          },
        };
        const response = await axios.get(
          `http://localhost:3000/organization/${userId}/${orgId}/roles`,
          config
        );
        setRoles(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  const getMenuItems = () => {
    const menus = {
      owner: [
        { path: "/", name: "Dashboard", icon: "fas fa-tachometer-alt" },
        { path: "/rubric", name: "Assessment Rubric", icon: "fas fa-file-alt" },
        { path: "/kpi", name: "KPI", icon: "fas fa-chart-line" },
        { path: "/team", name: "Team", icon: "fas fa-users" },
        { path: "/task", name: "Task", icon: "fas fa-check-double" },
        {
          path: "/task-checking",
          name: "Task Checking",
          icon: "fas fa-tasks",
        },
        { path: "/employee", name: "Employee", icon: "fas fa-user-tie" }
      ],
      manager: [
        { path: "/", name: "Dashboard", icon: "fas fa-tachometer-alt" },
        { path: "/rubric", name: "Assessment Rubric", icon: "fas fa-file-alt" },
        { path: "/kpi", name: "KPI", icon: "fas fa-chart-line" },
        { path: "/team", name: "Team", icon: "fas fa-users" },
        { path: "/task", name: "Task", icon: "fas fa-check-double" },
      ],
      hrd: [
        { path: "/", name: "Dashboard", icon: "fas fa-tachometer-alt" },
        { path: "/rubric", name: "Assessment Rubric", icon: "fas fa-file-alt" },
        { path: "/kpi", name: "KPI", icon: "fas fa-chart-line" },
        {
          path: "/task-checking",
          name: "Task Checking",
          icon: "fas fa-tasks",
        },
        { path: "/employee", name: "Employee", icon: "fas fa-user-tie" },
      ],
      employee: [
        { path: "/", name: "Dashboard", icon: "fas fa-tachometer-alt" },
        { path: "/kpi", name: "KPI", icon: "fas fa-chart-line" },
        { path: "/task", name: "Task", icon: "fas fa-check-double" },
        { path: "/team", name: "Team", icon: "fas fa-users" },
      ],
    };
    console.log(roles);
    const userRole = roles?.organization_role; // get the first role of the user
    if (!userRole) return []; // if no role, return empty array

    const userMenus = menus[userRole.toLowerCase()];
    return userMenus || [];
  };

  const menuItems = getMenuItems();

  return (
    <div>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="index3.html" className="brand-link">
          <span className="brand-text font-weight-light">E-Performance</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {menuItems.map((menu) => (
                <li className="nav-item" key={menu.path}>
                  <NavLink
                    exact
                    to={menu.path}
                    className={`nav-link ${
                      activeLink === menu.path && "active"
                    }`}
                    onClick={() => setActiveLink(menu.path)}
                  >
                    <i className={`${menu.icon} nav-icon`} />
                    <p>{menu.name}</p>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
};
export default SideNav;
