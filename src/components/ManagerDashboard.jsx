import { useState, useEffect } from "react";
import { getTasks, createTask, deleteTask, getProjects } from "../api";
import { socket } from "../socket";

const ManagerDashboard = () => {
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [notification, setNotification] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedUser: "",
    status: "Pending",
    dueDate: "",
    project: "",
  });

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

  // Socket listener
  useEffect(() => {
    socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("🔴 Socket disconnected"));

    socket.on("taskUpdated", (data) => {
      console.log("📩 Real-time update received:", data);
      setNotification(
        data.action === "create"
          ? `🟢 New Task Created: ${data.task.title}`
          : data.action === "delete"
          ? `🗑️ Task Deleted`
          : `✏️ Task Updated: ${data.task.title}`
      );
      fetchTasks(); // refresh tasks
      setTimeout(() => setNotification(""), 3000); // hide after 3s
    });

    return () => socket.off();
  }, []);

  const handleCreateTask = async () => {
    if (
      !newTask.title ||
      !newTask.description ||
      !newTask.assignedUser ||
      !newTask.dueDate ||
      !newTask.project
    )
      return alert("All fields are required including Project");

    await createTask(newTask, token);

    setNewTask({
      title: "",
      description: "",
      assignedUser: "",
      status: "Pending",
      dueDate: "",
      project: "",
    });
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id, token);
  };

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "950px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <h2
        className="text-center mb-4"
        style={{ fontWeight: "700", color: "#222", letterSpacing: "0.5px" }}
      >
        Manager Task Dashboard 
      </h2>

      {notification && (
        <div
          className="alert text-center"
          style={{
            fontWeight: "600",
            borderRadius: "12px",
            backgroundColor: "#d1ecf1",
            color: "#0c5460",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          {notification}
        </div>
      )}

      {/* Create Task Form */}
      <div
        className="card shadow-sm p-4 mb-4"
        style={{
          borderRadius: "12px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h4 style={{ fontWeight: "600", marginBottom: "15px" }}>Create New Task</h4>

        <input
          type="text"
          placeholder="Title"
          className="form-control mb-2"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <input
          type="text"
          placeholder="Description"
          className="form-control mb-2"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <input
          type="text"
          placeholder="Assign to (User Name)"
          className="form-control mb-2"
          value={newTask.assignedUser}
          onChange={(e) => setNewTask({ ...newTask, assignedUser: e.target.value })}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <input
          type="date"
          className="form-control mb-2"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <select
          className="form-control mb-3"
          value={newTask.project}
          onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.projectTitle}
            </option>
          ))}
        </select>

        <button
          className="btn btn-success w-100"
          style={{
            padding: "10px",
            borderRadius: "8px",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
          onClick={handleCreateTask}
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <h5 style={{ fontWeight: "600", marginBottom: "10px" }}>All Tasks</h5>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {tasks.map((t) => (
          <div
            key={t._id}
            className="card shadow-sm p-3"
            style={{
              borderRadius: "12px",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
            }}
          >
            <div>
              <b style={{ fontSize: "16px", color: "#0d6efd" }}>{t.title}</b>
              <p style={{ margin: "5px 0", minHeight: "40px", color: "#555" }}>
                {t.description}
              </p>
              <span
                className="badge"
                style={{
                  backgroundColor:
                    t.status === "Completed" ? "green" : t.status === "Pending" ? "#6c757d" : "#343a40",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {t.status}
              </span>
              <br />
              <small style={{ color: "#555" }}>
                Assigned to: {t.assignedUser} <br />
                Project: {t.project?.projectTitle || "N/A"} <br />
                Due: {new Date(t.dueDate).toLocaleDateString()}
              </small>
            </div>

            <button
              className="btn btn-danger btn-sm mt-3"
              onClick={() => handleDeleteTask(t._id)}
              style={{ borderRadius: "8px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;
