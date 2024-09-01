import React, { useState, useEffect } from "react";
import "./adminDashboard.css";
import Aside from "./Aside";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [detailsReport, setDetailsReport] = useState([
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
    { id: 16 },
    { id: 17 },
    { id: 18 },
    { id: 19 },
    { id: 20 },
  ]);
  const [projectData, setProjectData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5; // Number of items to display per page

  const navigate = useNavigate();
  const [totalAmountSpentBYRot, setAmountSpendByRot] = useState(0);
  const [totalAmountSpentBYIN, setAmountSpendByIN] = useState(0);
  const [totalAmountHourBYIN, setAmountHourByIN] = useState(0);
  const [totalAmountHourBYRot, setAmountHourByRot] = useState(0);

  const fetchDetailsReport = async () => {
    try {
      const response = await fetch(
        "https://server.rcmys.in/api/v1/club/getAll"
      );
      const data = await response.json();
      setDetailsReport(data);
    } catch (error) {
      console.error("Error fetching details report:", error);
    }
  };

  const handleDeleteClub = async (id) => {
    try {
      await fetch(`https://server.rcmys.in/api/v1/club/deleteClub/${id}`, {
        method: "DELETE",
      });
      fetchDetailsReport();
    } catch (error) {
      console.error("Error deleting club:", error);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(
        "https://server.rcmys.in/api/v1/projects/getAll"
      );
      const data = await response.json();
      const rotaractClubs = data.filter((club) => club.clubType === "Rotaract");
      const interactClubs = data.filter((club) => club.clubType === "Interact");
      let totalRotaractSpend = 0;
      let totalRotaractHour = 0;
      let totalIntractHour = 0;
      let totalIntractSpend = 0;
      if (rotaractClubs.length) {
        totalRotaractSpend = rotaractClubs.reduce((acc, cur) => {
          return acc + parseInt(cur.totalAmountSpent);
        }, 0);
        totalRotaractHour = rotaractClubs.reduce(
          (acc, cur) => acc + parseInt(cur.totalManHourSpent),
          0
        );
      }
      if (interactClubs.length) {
        totalIntractHour = interactClubs.reduce(
          (acc, cur) => acc + parseInt(cur.totalAmountSpent),
          0
        );
        totalIntractSpend = interactClubs.reduce(
          (acc, cur) => acc + parseInt(cur.totalManHourSpent),
          0
        );
      }
      setAmountHourByRot(totalRotaractHour);
      setAmountHourByIN(totalIntractHour);

      setAmountSpendByIN(totalIntractSpend);
      setAmountSpendByRot(totalRotaractSpend);

      setProjectData(data);
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    fetchDetailsReport();
  }, []);

  // Pagination logic
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = detailsReport.slice(indexOfFirstTodo, indexOfLastTodo);

  const nextPage = () => {
    if (currentPage < Math.ceil(detailsReport.length / todosPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <React.Fragment>
      <nav className="navbar">
        <div className="navbar-brand">
          <a href="#">Dashboard</a>
        </div>
        <div className="navbar-search">
          <input type="text" placeholder="Search..." />
        </div>
      </nav>
      <div className="container">
        <Aside />
        <main className="overview ">
          <h1 className="heading">overview</h1>
          <div className="overview-container">
            <div className="overDetails">
              <img src="/assets/project.png" alt="" />
              <h1>{projectData.length}</h1>
              <h4>total projects</h4>
            </div>
            <div className="overDetails">
              <img src="/assets/dollors.svg" alt="" />
              <h1>{totalAmountSpentBYRot}</h1>
              <h4>total amount spent in rotaract</h4>
            </div>
            <div className="overDetails">
              <img src="/assets/dollors.svg" alt="" />
              <h1>{totalAmountSpentBYIN}</h1>
              <h4>total amount spent in interact</h4>
            </div>
            <div className="overDetails">
              <img src="/assets/time.png" alt="" />
              <h1>{totalAmountHourBYRot}</h1>
              <h4>total man hour spent in rotaract</h4>
            </div>
            <div className="overDetails">
              <img src="/assets/time.png" alt="" />
              <h1>{totalAmountHourBYIN}</h1>
              <h4>total man hour spent in interact</h4>
            </div>
          </div>
          <div className="details-report-section">
            <div className="heading-section">
              <div className="heading-section-left">
                <span className="material-symbols-outlined">lab_profile</span>
                <h1 className="heading">details report</h1>
              </div>
              <div className="btns">
                <button onClick={() => navigate("/addclub")}>
                  <span className="material-symbols-outlined">add</span>add club
                </button>
                <button>
                  <span className="material-symbols-outlined">upgrade</span>
                  export
                </button>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>club name </th>
                  <th>club id</th>
                  <th>month</th>
                  <th>
                    <input type="month" placeholder="enter month" />
                  </th>
                  <th>
                    <input
                      type="search"
                      style={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: "none",
                        outline: "none",
                      }}
                      placeholder="search.."
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTodos.map((eachDetail) => {
                  const { _id, clubName, clubID, month, id } = eachDetail;
                  return (
                    <tr key={_id}>
                      <td>{clubName}</td>
                      <td>{clubID}</td>
                      <td>{month}</td>
                      <td>{id}</td>
                      <td>
                        <button className="update">update</button>
                      </td>
                      <td>
                        <button
                          className="delete"
                          onClick={() => {
                            handleDeleteClub(_id);
                            toast.error(`${clubName} deleted!`, {
                              position: "top-right",
                              autoClose: 2000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                            });
                          }}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-end">
              {currentPage === 1 ? null : (
                <button onClick={prevPage} className="uppercase">
                  Previous
                </button>
              )}
              <span className="mx-4"> Page {currentPage} </span>
              {currentPage ===
              Math.ceil(detailsReport.length / todosPerPage) ? null : (
                <button onClick={nextPage} className="uppercase">
                  Next
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
}
