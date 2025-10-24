// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Import ALL components used in routes
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import LecturerReportForm from "./components/LecturerReportForm";
import StudentDashboard from "./components/student/Dashboard";
import LecturerDashboard from "./components/lecturer/dashboard";
import PrlReports from "./components/prl/Reports";
import PlDashboard from "./components/pl/dashboard";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="App academic-portal">
        {/* Advanced Header with Navigation */}
        <header className="portal-header">
          <div className="container">
            <div className="header-content">
              <div className="brand-section">
                <div className="university-logo">
                  <div className="logo-icon">🎓</div>
                  <div className="brand-text">
                    <h1 className="university-name">LUCT</h1>
                    <p className="portal-tagline">Academic Intelligence Platform</p>
                  </div>
                </div>
              </div>
              <nav className="portal-nav">
                <div className="nav-items">
                  <span className="nav-item">📊 Dashboard</span>
                  <span className="nav-item">📚 Courses</span>
                  <span className="nav-item">👥 Faculty</span>
                  <span className="nav-item">⚙️ Settings</span>
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="portal-main">
          <div className="container-fluid">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/lecturer/dashboard" element={<ProtectedRoute><LecturerDashboard /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><LecturerReportForm /></ProtectedRoute>} />
              <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
              <Route path="/prl/reports" element={<ProtectedRoute><PrlReports /></ProtectedRoute>} />
              <Route path="/pl/dashboard" element={<ProtectedRoute><PlDashboard /></ProtectedRoute>} />
            </Routes>
          </div>
        </main>

        {/* Advanced Footer */}
        <footer className="portal-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h5>LUCT Academic Portal</h5>
                <p>Advanced Learning Management System</p>
              </div>
              <div className="footer-section">
                <h6>Quick Links</h6>
                <div className="footer-links">
                  <a href="#about">About</a>
                  <a href="#support">Support</a>
                  <a href="#privacy">Privacy</a>
                </div>
              </div>
              <div className="footer-section">
                <h6>Contact</h6>
                <p>ict-faculty@luct.ac.ls</p>
                <p>+266 57366588</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 Limkokwing University of Creative Technology. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
