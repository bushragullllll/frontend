import { useState, useEffect } from "react";
import { getTasks, updateTask, getProjects, updateProject } from "../api";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");

  // --- TASK STATES ---
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedUser: "",
    status: "Pending",
    dueDate: "",
    project: "",
  });

  // --- PROJECT STATES ---
  const [projects, setProjects] = useState([]);
  const [editProjectId, setEditProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    projectTitle: "",
    description: "",
    status: "Pending",
    dueDate: "",
    managedBy: localStorage.getItem("name") || "Admin",
  });
  const [file, setFile] = useState(null);

  // --- FETCH TASKS & PROJECTS ---
  const fetchTasks = async () => {
    const data = await getTasks(token);
    setTasks(data);
  };

  const fetchProjects = async () => {
    const data = await getProjects(token);
    setProjects(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  // --- TASK FUNCTIONS ---
  const handleEditTask = (task) => {
    setEditTaskId(task._id);
    setTaskForm({
      title: task.title,
      description: task.description,
      assignedUser: task.assignedUser,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      project: task.project?._id || "",
    });
  };

  const handleUpdateTask = async () => {
    if (!taskForm.title || !taskForm.description || !taskForm.assignedUser || !taskForm.dueDate || !taskForm.project)
      return alert("All task fields are required including Project");

    try {
      await updateTask(editTaskId, taskForm, token);
      setEditTaskId(null);
      setTaskForm({ title: "", description: "", assignedUser: "", status: "Pending", dueDate: "", project: "" });
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err.response || err);
      alert("❌ Error updating task");
    }
  };

  // --- PROJECT FUNCTIONS ---
  const handleEditProject = (project) => {
    setEditProjectId(project._id);
    setProjectForm({
      projectTitle: project.projectTitle,
      description: project.description,
      status: project.status,
      dueDate: project.dueDate ? project.dueDate.slice(0, 10) : "",
      managedBy: project.managedBy,
    });
    setFile(null);
  };

  const handleUpdateProject = async () => {
    if (!projectForm.projectTitle || !projectForm.description || !projectForm.dueDate)
      return alert("All project fields are required");

    try {
      const formData = new FormData();
      Object.entries(projectForm).forEach(([key, value]) => formData.append(key, value));
      if (file) formData.append("file", file);

      await updateProject(editProjectId, formData, token);
      setEditProjectId(null);
      setProjectForm({
        projectTitle: "",
        description: "",
        status: "Pending",
        dueDate: "",
        managedBy: localStorage.getItem("name") || "Admin",
      });
      setFile(null);
      fetchProjects();
    } catch (err) {
      console.error("Error updating project:", err.response || err);
      alert("❌ Error updating project");
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "1200px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <h2 className="text-center mb-4" style={{ fontWeight: "700", color: "#222", letterSpacing: "0.5px" }}>
        Admin Dashboard - Tasks & Projects
      </h2>

      {/* ===== TASK EDIT FORM ===== */}
      {editTaskId && (
        <div className="card shadow-sm p-4 my-3" style={{ borderRadius: "12px", backgroundColor: "#f9f9f9" }}>
          <h4 style={{ fontWeight: "600", marginBottom: "15px", color: "#0d6efd" }}>Edit Task</h4>
          <input
            type="text"
            placeholder="Title"
            className="form-control mb-2"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Description"
            className="form-control mb-2"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Assign to (User Name)"
            className="form-control mb-2"
            value={taskForm.assignedUser}
            onChange={(e) => setTaskForm({ ...taskForm, assignedUser: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <input
            type="date"
            className="form-control mb-2"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <select
            className="form-control mb-2"
            value={taskForm.status}
            onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <select
            className="form-control mb-3"
            value={taskForm.project}
            onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.projectTitle}
              </option>
            ))}
          </select>

          <div>
            <button
              className="btn btn-success me-2"
              style={{ borderRadius: "8px", fontWeight: "600" }}
              onClick={handleUpdateTask}
            >
              Update Task
            </button>
            <button
              className="btn btn-secondary"
              style={{ borderRadius: "8px", fontWeight: "600" }}
              onClick={() => {
                setEditTaskId(null);
                setTaskForm({ title: "", description: "", assignedUser: "", status: "Pending", dueDate: "", project: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===== PROJECT EDIT FORM ===== */}
      {editProjectId && (
        <div className="card shadow-sm p-4 my-3" style={{ borderRadius: "12px", backgroundColor: "#f9f9f9" }}>
          <h4 style={{ fontWeight: "600", marginBottom: "15px", color: "#0d6efd" }}>Edit Project</h4>
          <input
            type="text"
            placeholder="Project Title"
            className="form-control mb-2"
            value={projectForm.projectTitle}
            onChange={(e) => setProjectForm({ ...projectForm, projectTitle: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Description"
            className="form-control mb-2"
            value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <input
            type="date"
            className="form-control mb-2"
            value={projectForm.dueDate}
            onChange={(e) => setProjectForm({ ...projectForm, dueDate: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <select
            className="form-control mb-2"
            value={projectForm.status}
            onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <input
            type="file"
            className="form-control mb-3"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <div>
            <button
              className="btn btn-success me-2"
              style={{ borderRadius: "8px", fontWeight: "600" }}
              onClick={handleUpdateProject}
            >
              Update Project
            </button>
            <button
              className="btn btn-secondary"
              style={{ borderRadius: "8px", fontWeight: "600" }}
              onClick={() => {
                setEditProjectId(null);
                setProjectForm({
                  projectTitle: "",
                  description: "",
                  status: "Pending",
                  dueDate: "",
                  managedBy: localStorage.getItem("name") || "Admin",
                });
                setFile(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===== ALL TASKS CARD ===== */}
      <div className="card shadow-sm p-3 mb-4" style={{ borderRadius: "12px", backgroundColor: "#f9f9f9" }}>
        <h4 style={{ color: "#222", fontWeight: "600", marginBottom: "15px" }}>All Tasks</h4>
        <div style={{ display: "flex", overflowX: "auto", gap: "15px" }}>
          {tasks.length === 0 ? (
            <p>No tasks available.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="card p-3"
                style={{
                  minWidth: "250px",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <b style={{ fontSize: "16px", color: "#000" }}>{task.title}</b>
                <p style={{ color: "#555", minHeight: "40px" }}>{task.description}</p>
                <small style={{ color: "#555" }}>
                  Assigned to: {task.assignedUser} <br />
                  Project: {task.project?.projectTitle || "N/A"} <br />
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                </small>
                <button
                  className="btn btn-success btn-sm mt-3"
                  style={{ borderRadius: "8px", fontWeight: "600" }}
                  onClick={() => handleEditTask(task)}
                >
                  Edit
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== ALL PROJECTS CARD ===== */}
      <div className="card shadow-sm p-3 mb-4" style={{ borderRadius: "12px", backgroundColor: "#f9f9f9" }}>
        <h4 style={{ color: "#222", fontWeight: "600", marginBottom: "15px" }}>All Projects</h4>
        <div style={{ display: "flex", overflowX: "auto", gap: "15px" }}>
          {projects.length === 0 ? (
            <p>No projects available.</p>
          ) : (
            projects.map((project) => (
              <div
                key={project._id}
                className="card p-3"
                style={{
                  minWidth: "250px",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <b style={{ fontSize: "16px", color: "#000" }}>{project.projectTitle}</b>
                <p style={{ color: "#555", minHeight: "40px" }}>{project.description}</p>
                <small style={{ color: "#555" }}>
                  Managed by: {project.managedBy} <br />
                  Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "N/A"}
                </small>
                <button
                  className="btn btn-success btn-sm mt-3"
                  style={{ borderRadius: "8px", fontWeight: "600" }}
                  onClick={() => handleEditProject(project)}
                >
                  Edit
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

