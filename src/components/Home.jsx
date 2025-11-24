// frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import { getTasks } from "../api";
import Header from "../assets/Header";
import Footer from "../assets/Footer";
import "./Home.css";

const normalizeId = (id) => String(id).trim();

const Home = () => {
  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskIds, setNewTaskIds] = useState({}); // track NEW tasks

  // Fetch tasks and mark new ones
  const fetchTasks = async () => {
    try {
      const data = await getTasks(token);
      setTasks(data);
      setFilteredTasks(data);

      const seenTasks = JSON.parse(localStorage.getItem("seenTasks") || "[]");
      const newTasks = {};
      data.forEach((t) => {
        const id = normalizeId(t._id);
        if (!seenTasks.includes(id)) newTasks[id] = true;
      });
      setNewTaskIds(newTasks);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(value.toLowerCase()) ||
        (t.assignedUser && t.assignedUser.toLowerCase().includes(value.toLowerCase())) ||
        (t.project?.projectTitle && t.project.projectTitle.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredTasks(filtered);
  };

  // Open task modal and remove NEW badge
  const handleOpenTask = (task) => {
    setSelectedTask(task);

    const id = normalizeId(task._id);
    setNewTaskIds((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    // Mark task as seen in local storage
    const seenTasks = JSON.parse(localStorage.getItem("seenTasks") || "[]");
    if (!seenTasks.includes(id)) {
      seenTasks.push(id);
      localStorage.setItem("seenTasks", JSON.stringify(seenTasks));
    }
  };

  // Auto-remove NEW badge after 10 seconds
  useEffect(() => {
    const timers = Object.keys(newTaskIds).map((id) =>
      setTimeout(() => {
        setNewTaskIds((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        const seenTasks = JSON.parse(localStorage.getItem("seenTasks") || "[]");
        if (!seenTasks.includes(id)) {
          seenTasks.push(id);
          localStorage.setItem("seenTasks", JSON.stringify(seenTasks));
        }
      }, 10000)
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [newTaskIds]);

  return (
    <div className="app-container">
      <Header />
      <div className="container mt-5">
        <h2 className="page-title">All Tasks</h2>

        {/* Search bar */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="🔍 Search by title, user or project..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
          />
        </div>

        {/* Tasks grid */}
        <div className="tasks-grid">
          {filteredTasks.length === 0 ? (
            <p className="no-tasks">No tasks found</p>
          ) : (
            filteredTasks.map((t) => {
              const id = normalizeId(t._id);
              return (
                <div
                  key={id}
                  className="task-card"
                  onClick={() => handleOpenTask(t)}
                  style={{ position: "relative" }}
                >
                  {newTaskIds[id] && (
                    <span
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "red",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      NEW
                    </span>
                  )}
                  <h5 className="task-title">{t.title}</h5>
                  <p className="task-assigned"><b>Assigned:</b> {t.assignedUser || "Unassigned"}</p>
                  <p className="task-project"><b>Project:</b> {t.project?.projectTitle || "N/A"}</p>
                  <p className="task-status">
                    <b>Status:</b>{" "}
                    <span style={{ color: t.status === "Completed" ? "green" : "black", fontWeight: "bold" }}>
                      {t.status}
                    </span>
                  </p>
                  <p className="task-due"><b>Due:</b> {new Date(t.dueDate).toLocaleDateString()}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Task Modal */}
        {selectedTask && (
          <div
            className="modal show fade"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setSelectedTask(null)}
          >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedTask.title}</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedTask(null)}></button>
                </div>
                <div className="modal-body">
                  <p><b>Description:</b> {selectedTask.description}</p>
                  <p><b>Assigned to:</b> {selectedTask.assignedUser || "Unassigned"}</p>
                  <p><b>Project:</b> {selectedTask.project?.projectTitle || "N/A"}</p>
                  <p>
                    <b>Status:</b>{" "}
                    <span style={{ color: selectedTask.status === "Completed" ? "green" : "black", fontWeight: "bold" }}>
                      {selectedTask.status}
                    </span>
                  </p>
                  <p><b>Due:</b> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedTask(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default Home;



