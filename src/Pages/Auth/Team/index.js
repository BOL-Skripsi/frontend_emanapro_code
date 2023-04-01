import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Cookies from "js-cookie";
function TeamPage() {
  const [teamData, setTeamData] = useState([]);
  const [newTeam, setNewTeam] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { id } = "71152531-e247-467f-8839-b78c14d7f71e";
  const fetchTeamList = async () => {
    try {
      const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/team/${orgId}/list`,
        config
      );
      setTeamData(response.data.teams);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTeamList();
  }, []);

  const columns = [
    {
      name: "Team",
      selector: "name",
      sortable: true,
    },
    {
      name: "Description",
      selector: "description",
      sortable: true,
    },
    {
      name: "Manager",
      selector: "manager_name",
      sortable: true,
    },
    {
      name: "Team Member",
      selector: "team_member_count",
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
      await axios.post(`http://localhost:3000/team/${id}`, newTeam);
      setNewTeam({
        teamName: "",
        description: "",
      });
      fetchTeamList();
    } catch (error) {
      console.error(error);
    }
    setShowForm(false);
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Team</h1>
            </div>
            {/* /.col */}
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
                          + Add Team
                        </button>
                        <button
                          className="btn btn-primary mr-2"
                          onClick={() => setShowForm(true)}
                        >
                          + Add Team Member
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-body">
                  {showForm ? (
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Team Name:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={newTeam.teamName}
                        />
                      </div>
                      <div className="form-group">
                        <label>Description:</label>
                        <textarea
                          name="description"
                          className="form-control"
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
                    </form>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={teamData}
                      noHeader
                      pagination
                      customStyles={customStyles}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TeamPage;
