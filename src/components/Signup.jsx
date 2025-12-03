import { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(false); // Loader state

  const navigate = useNavigate();

 const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true); // Start loader
  const userData = { name, email, password, role };

  try {
    await registerUser(userData);
    alert("User successfully registered!");
    navigate("/login");
  } catch (err) {
    // Check if server sent a specific message
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message); // e.g. "Email already exists"
    } else {
      alert("Error during registration: " + err.message);
    }
  } finally {
    setLoading(false); // Stop loader
  }
};


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #cfdddaff, #ccd4d2ff)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          position: "relative", // Needed for loader overlay
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Loader Overlay */}
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
              zIndex: 10,
            }}
          >
            <div className="spinner" style={{
              width: "40px",
              height: "40px",
              border: "4px solid #ccc",
              borderTop: "4px solid #131317",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
          </div>
        )}

        <h3 style={{ textAlign: "center", marginBottom: "25px", color: "#333", fontWeight: "700" }}>Signup</h3>
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600", marginBottom: "5px", display: "block" }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
                transition: "all 0.2s",
              }}
              disabled={loading}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600", marginBottom: "5px", display: "block" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
                transition: "all 0.2s",
              }}
              disabled={loading}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "600", marginBottom: "5px", display: "block" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
                transition: "all 0.2s",
              }}
              disabled={loading}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "600", marginBottom: "5px", display: "block" }}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                outline: "none",
                backgroundColor: "#fff",
              }}
              disabled={loading}
            >
              <option value="Member">Member</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#131317ff",
              color: "#fff",
              fontWeight: "600",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
            disabled={loading}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#65656aff")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1b192eff")}
          >
            Signup
          </button>
        </form>
      </div>

      {/* Spinner Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
