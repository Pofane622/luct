import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting to register user on port 5005...");
      
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Network error. Please check if server is running on port 5005");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <div className="card bg-dark border-success">
            <div className="card-body p-4 text-center">
              <div className="mb-3" style={{fontSize: "3rem"}}>✅</div>
              <h2 className="text-success mb-3">Registration Successful!</h2>
              <p className="text-light">Your account has been created successfully.</p>
              <p className="text-muted">Redirecting to login page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-8 col-lg-6">
        <div className="card bg-dark border-warning">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <div className="mb-3">
                <span style={{fontSize: "3rem"}}>📝</span>
              </div>
              <h2 className="text-warning fw-bold">Create Account</h2>
              <p className="text-light opacity-75">Join LUCT Academic Portal</p>
            </div>

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

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-light">Username *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose username"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-light">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@luct.ac.ls"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-light">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-light">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-light">Role *</label>
                <select
                  className="form-select"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="student">🎓 Student</option>
                  <option value="lecturer">👨‍🏫 Lecturer</option>
                  <option value="principal_lecturer">👨‍💼 Principal Lecturer</option>
                  <option value="program_leader">👩‍💼 Program Leader</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-warning w-100 fw-bold py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="text-light mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-warning text-decoration-none fw-bold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}