import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Cookies from "js-cookie";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import Select from "react-select";
import axios from "axios";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function TaskPage() {
  const auth = useAuthUser();
  const userId = auth().userUuid;
  const [currentTeam, setCurrentTeam] = useState([]);
  const [teamMember, setTeamMember] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);

  const fetchMyTeam = async () => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/team/${userId}/me`,
        config
      );
      fetchTeamMember(response.data.team);
      fetchTeamTasks(response.data.team);
      setCurrentTeam(response.data.team);
    } catch (error) {
      console.error(error);
    }
  };

  
  const fetchTeamMember = async (team) => {
    try {
      const teamId = team.team_id;
      // console.log(teamId);
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/team/${teamId}/${teamId}/member/list`,
        config
      );
      console.log(response.data.teams)
      setTeamMember(response.data.teams);
    } catch (error) {
      console.error(error);
    }
  };


  const fetchTeamTasks = async (team) => {
    try {
      const teamId = team.team_id;
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/task/${teamId}/team`,
        config
      );
      setTeamTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyTeam();
  }, []);

  const columnsMember = [
    {
      name: "Team Member Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Contact Information",
      selector: "email",
      sortable: true,
    }
  ];

  const columnsTeam = [
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
        border: "1px dotted black",
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        border: "1px dotted black",
      },
    },
  };
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Team</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Team</li>
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
          <Tabs defaultActiveKey="personal" id="task-tabs">
            <Tab eventKey="personal" title="Member">
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <DataTable
                        columns={columnsMember}
                        data={teamMember}
                        noHeader
                        pagination
                        customStyles={customStyles}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
              {/* <Tab eventKey="team" title="Team Task">
                <div className="row">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <DataTable
                          columns={columnsTeam}
                          data={teamTasks}
                          noHeader
                          pagination
                          customStyles={customStyles}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Tab> */}
          </Tabs>
        </div>
      </section>
    </div>
  );
}
export default TaskPage;
