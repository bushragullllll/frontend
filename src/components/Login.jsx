import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

const Login = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader
    const userData = { email, password };

    try {
      const { token, role, _id, name } = await loginUser(userData);

      // localStorage.setItem("userId", _id);
      // localStorage.setItem("userName", name);

      login(token, role);
      navigate("/home");
    } catch (err) {
      alert("Invalid credentials");
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
        position: "relative",
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
          <div
            className="spinner"
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #ccc",
              borderTop: "4px solid #1a1e1d",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}

      <h3
        style={{
          textAlign: "center",
          marginBottom: "25px",
          color: "#333",
          fontWeight: "700",
        }}
      >
        Login
      </h3>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              fontWeight: "600",
              marginBottom: "5px",
              display: "block",
            }}
          >
            Email
          </label>
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
            }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              fontWeight: "600",
              marginBottom: "5px",
              display: "block",
            }}
          >
            Password
          </label>
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
            }}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#1a1e1dff",
            color: "#fff",
            fontWeight: "600",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "#65656aff")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "#1c1e1dff")
          }
        >
          Login
        </button>
      </form>

      {/* ⭐ Don't have an account? Signup */}
      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
          fontSize: "14px",
          color: "#555",
        }}
      >
        Don't have an account?{" "}
        <span
          style={{
            color: "#1a1e1d",
            fontWeight: "600",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/signup")}
        >
          Sign up
        </span>
      </p>
    </div>

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

export default Login;
