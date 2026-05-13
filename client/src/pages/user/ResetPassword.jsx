import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as authService from "../../services/user.sevices";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.resetPassword(token, { password });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#e8e0d5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Lato', sans-serif",
    }}>
      <div style={{ textAlign: "center", width: "100%", maxWidth: 500, padding: "2rem" }}>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "3.2rem",
          color: "#2e2416",
          marginBottom: "0.4rem",
        }}>
          Terra Focus
        </h1>
        <p style={{ color: "#8a7e6e", fontWeight: 300, marginBottom: "2.5rem" }}>
          Set a new password for your account.
        </p>

        <div style={{
          background: "#d9cfc3",
          borderRadius: 18,
          padding: "2rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{ background: "#cfc4b6", borderRadius: 10, padding: "1rem 1.2rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.7rem",
              letterSpacing: "1.5px",
              color: "#7a6e60",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
              textAlign: "left",
            }}>
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                background: "#f0ece6",
                border: "none",
                borderRadius: 6,
                padding: "0.65rem 0.9rem",
                fontSize: "0.95rem",
                color: "#2e2416",
                outline: "none",
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              marginTop: "1.2rem",
              padding: "0.9rem",
              background: "#b07060",
              border: "none",
              borderRadius: 50,
              color: "#fff",
              fontSize: "0.95rem",
              letterSpacing: "1px",
              cursor: "pointer",
            }}
          >
            continue
          </button>
        </div>

        <p style={{ color: "#8a7e6e", fontSize: "0.9rem", fontWeight: 300 }}>
          Remembered it?{" "}
          <Link to="/login" style={{ color: "#b07060", textDecoration: "none" }}>
            Back to login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;