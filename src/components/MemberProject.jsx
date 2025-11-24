// frontend/src/pages/MemberProject.jsx
import { useEffect, useState } from "react";
import { getProjects } from "../api";
import "./MemberProject.css";
import Header from "../assets/Header";
import Footer from "../assets/Footer";

const normalizeId = (id) => String(id).trim();

const MemberProject = () => {
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // ⭐ Track NEW projects
  const [newProjects, setNewProjects] = useState({}); // { projectId: true }

  // Load projects
  const fetchProjects = async () => {
    try {
      const data = await getProjects(token);
      setProjects(data);
      setFilteredProjects(data);

      // Determine which projects are new
      const seenProjects = JSON.parse(localStorage.getItem("seenProjects") || "[]");
      const newProj = {};
      data.forEach((p) => {
        const id = normalizeId(p._id);
        if (!seenProjects.includes(id)) {
          newProj[id] = true;
        }
      });
      setNewProjects(newProj);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // SEARCH
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = projects.filter((p) =>
      p.projectTitle.toLowerCase().includes(value.toLowerCase()) ||
      p.description.toLowerCase().includes(value.toLowerCase()) ||
      p.status.toLowerCase().includes(value.toLowerCase()) ||
      p.managedBy.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProjects(filtered);
  };

  // DOWNLOAD
  const handleDownload = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileUrl.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  };

  // Open modal and remove NEW badge
  const handleSelectProject = (project) => {
    setSelectedProject(project);

    const id = normalizeId(project._id);
    setNewProjects((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    // Mark project as seen in local storage
    const seenProjects = JSON.parse(localStorage.getItem("seenProjects") || "[]");
    if (!seenProjects.includes(id)) {
      seenProjects.push(id);
      localStorage.setItem("seenProjects", JSON.stringify(seenProjects));
    }
  };

  // Automatically remove NEW badge after 10 seconds
  useEffect(() => {
    const timers = Object.keys(newProjects).map((id) =>
      setTimeout(() => {
        setNewProjects((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });

        // Mark as seen in localStorage
        const seenProjects = JSON.parse(localStorage.getItem("seenProjects") || "[]");
        if (!seenProjects.includes(id)) {
          seenProjects.push(id);
          localStorage.setItem("seenProjects", JSON.stringify(seenProjects));
        }
      }, 10000)
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, [newProjects]);

  return (
    <div className="container mt-5">
      <Header />

      <h2 className="page-title">📁 All Projects</h2>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="form-control"
        />
      </div>

      {/* Projects */}
      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          filteredProjects.map((p) => {
            const id = normalizeId(p._id);
            return (
              <div
                key={id}
                className="project-card"
                onClick={() => handleSelectProject(p)}
                style={{ position: "relative" }}
              >
                {/* NEW badge */}
                {newProjects[id] && (
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

                <h5 className="project-title">{p.projectTitle}</h5>
                <p className="project-desc">{p.description}</p>

                {/* ⭐ STATUS WITH COLORS ADDED HERE */}
                <p>
                  <b>Status:</b>{" "}
                  <span
                    style={{
                      color:
                        p.status.toLowerCase() === "completed"
                          ? "green"
                          : "black",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {p.status}
                  </span>
                </p>

                <p><b>Due:</b> {new Date(p.dueDate).toLocaleDateString()}</p>

                {p.file && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(p.file); }}
                    className="btn btn-outline-primary btn-sm"
                  >
                    ⬇️ Download File
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {selectedProject && (
        <div
          className="modal show fade"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedProject(null)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5>{selectedProject.projectTitle}</h5>
                <button className="btn-close" onClick={() => setSelectedProject(null)}></button>
              </div>

              <div className="modal-body">
                <p><b>Description:</b> {selectedProject.description}</p>

                {/* ⭐ STATUS COLOR IN MODAL */}
                <p>
                  <b>Status:</b>{" "}
                  <span
                    style={{
                      color:
                        selectedProject.status.toLowerCase() === "completed"
                          ? "green"
                          : "black",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedProject.status}
                  </span>
                </p>

                <p><b>Managed by:</b> {selectedProject.managedBy}</p>
                <p><b>Due:</b> {new Date(selectedProject.dueDate).toLocaleDateString()}</p>

                {selectedProject.file && (
                  <button
                    onClick={() => handleDownload(selectedProject.file)}
                    className="btn btn-outline-primary btn-sm"
                  >
                    ⬇️ Download File
                  </button>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedProject(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MemberProject;


