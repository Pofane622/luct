import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending login request...");
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        // Use AuthContext login method
        login(data.user, data.token);

        console.log("Login successful, redirecting...");

        // Redirect based on role
        switch(data.user.role) {
          case "student":
            navigate("/student/dashboard");
            break;
          case "lecturer":
            navigate("/lecturer/dashboard");
            break;
          case "principal_lecturer":
            navigate("/prl/reports");
            break;
          case "program_leader":
            navigate("/pl/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check if server is running on port 5003");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <div className="card bg-dark border-warning">
          <div className="card-body p-4">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="mb-3">
                <span style={{fontSize: "3rem"}}>🔐</span>
              </div>
              <h2 className="text-warning fw-bold">LUCT Login</h2>
              <p className="text-light opacity-75">Academic Intelligence Platform</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <div className="flex-grow-1">{error}</div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setError("")}
                ></button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-light">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100 fw-bold py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center mt-3">
              <p className="text-light mb-0">
                Don't have an account?{" "}
                <Link to="/register" className="text-warning text-decoration-none fw-bold">
                  Register here
                </Link>
              </p>
            </div>

            {/* Demo Accounts */}
            <div className="mt-4 p-3 bg-dark border border-secondary rounded">
              <h6 className="text-warning mb-2">Demo Accounts:</h6>
              <div className="text-light small">
                <div>👨‍🎓 <strong>demo.student</strong> / password123</div>
                <div>👨‍🏫 <strong>demo.lecturer</strong> / password123</div>
                <div>👨‍💼 <strong>demo.supervisor</strong> / password123</div>
                <div>👩‍💼 <strong>demo.director</strong> / password123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}