// frontend/src/pages/ManagerProjects.jsx
import { useState, useEffect } from "react";
import { getProjects, createProject, deleteProject } from "../api";
import { socket } from "../socket";

const normalizeId = (id) => String(id).trim();

const ManagerProjects = () => {
  const token = localStorage.getItem("token");
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    projectTitle: "",
    description: "",
    status: "Pending",
    dueDate: "",
    managedBy: localStorage.getItem("name") || "Manager",
  });
  const [file, setFile] = useState(null);
  const [notification, setNotification] = useState("");

  const fetchProjects = async () => {
    const data = await getProjects(token);
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- SOCKET LISTENER ---
  useEffect(() => {
    const onProjectUpdated = (data) => {
      console.log("📁 LIVE Project Update:", data);

      if (data.action === "create") {
        fetchProjects();
        setNotification(`🟢 New Project Created: ${data.project.projectTitle}`);
      } else if (data.action === "delete") {
        setProjects((prev) => prev.filter((p) => normalizeId(p._id) !== normalizeId(data.id)));
        setNotification(`🗑️ Project Deleted`);
      } else if (data.action === "update") {
        fetchProjects();
        setNotification(`✏️ Project Updated: ${data.project.projectTitle}`);
      }

      setTimeout(() => setNotification(""), 3000);
    };

    socket.on("projectUpdated", onProjectUpdated);
    return () => socket.off("projectUpdated", onProjectUpdated);
  }, []);

  const handleCreateProject = async () => {
    if (!newProject.projectTitle || !newProject.description || !newProject.dueDate)
      return alert("All fields required");

    const formData = new FormData();
    Object.entries(newProject).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append("file", file);

    await createProject(formData, token);

    setNewProject({
      projectTitle: "",
      description: "",
      status: "Pending",
      dueDate: "",
      managedBy: newProject.managedBy,
    });
    setFile(null);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id, token);
    }
  };

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

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <h2 className="text-center mb-4" style={{ fontWeight: "700", color: "#333" }}>
        Manager Project Dashboard
      </h2>

      {notification && (
        <div
          className="alert alert-info text-center"
          style={{
            fontWeight: "bold",
            borderRadius: "10px",
            fontSize: "15px",
          }}
        >
          {notification}
        </div>
      )}

      {/* Create Project Form */}
      <div
        className="card p-4 shadow-sm mb-4"
        style={{
          borderRadius: "12px",
          background: "#fafafa",
        }}
      >
        <h4 style={{ fontWeight: "600", marginBottom: "15px" }}>Create New Project</h4>

        <input
          type="text"
          placeholder="Project Title"
          className="form-control mb-2"
          value={newProject.projectTitle}
          onChange={(e) => setNewProject({ ...newProject, projectTitle: e.target.value })}
          style={{ padding: "10px" }}
        />

        <input
          type="text"
          placeholder="Description"
          className="form-control mb-2"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          style={{ padding: "10px" }}
        />

        <input
          type="date"
          className="form-control mb-2"
          value={newProject.dueDate}
          onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
          style={{ padding: "10px" }}
        />

        <select
          className="form-control mb-2"
          value={newProject.status}
          onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
          style={{ padding: "10px" }}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <input
          type="file"
          className="form-control mb-3"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ padding: "10px" }}
        />

        <button className="btn btn-success w-100" style={{ padding: "10px" }} onClick={handleCreateProject}>
          Add Project
        </button>
      </div>

      {/* Projects in horizontal square grid */}
      <h5 style={{ fontWeight: "600", marginBottom: "10px" }}>All Projects</h5>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {projects.map((p) => (
          <div
            key={normalizeId(p._id)}
            className="card p-3 shadow-sm"
            style={{
              borderRadius: "10px",
              background: "#fff",
              borderLeft: "5px solid #0d6efd",
              minHeight: "250px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <b style={{ fontSize: "16px" }}>{p.projectTitle}</b>
              <p style={{ margin: "5px 0", minHeight: "40px" }}>{p.description}</p>

              <span
                className="badge"
                style={{
                  backgroundColor:
                    p.status === "Completed" ? "green" : p.status === "Pending" ? "#6c757d" : "#343a40",
                  color: "#fff",
                }}
              >
                {p.status}
              </span>
              <br />
              <small>Managed by: {p.managedBy}</small>
            </div>

            <div className="mt-3 d-flex">
              {p.file && (
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => handleDownload(p.file)}
                >
                  ⬇️ Download
                </button>
              )}

              <button
                className="btn btn-danger btn-sm ms-auto"
                onClick={() => handleDeleteProject(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerProjects;

