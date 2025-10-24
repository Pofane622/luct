// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 text-center">
          {/* Hero Section */}
          <div className="hero-section mb-5">
            <div className="mb-4">
              <h1 className="display-5 fw-bold text-warning">LUCT Academic Portal</h1>
              <p className="lead text-light">
                Advanced Reporting & Monitoring System
              </p>
            </div>

            <div className="card border-warning login-card">
              <div className="card-body p-4">
                <h3 className="mb-3 text-warning">Welcome to the Portal!</h3>
                <p className="mb-4 text-light">
                  This advanced system enables comprehensive academic management, 
                  from lecture reporting to performance monitoring across all faculty levels.
                </p>
                <div className="d-grid">
                  <Link to="/login" className="btn btn-warning btn-lg fw-bold">
                    🚀 Access Portal
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card p-4 text-center h-100">
                <div className="mb-3">
                  <span className="display-6">👨‍🏫</span>
                </div>
                <h5 className="text-warning">Faculty Staff</h5>
                <p className="small text-light">Submit detailed academic reports and track class performance</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center h-100">
                <div className="mb-3">
                  <span className="display-6">📊</span>
                </div>
                <h5 className="text-warning">Academic Leaders</h5>
                <p className="small text-light">Monitor faculty performance and provide strategic feedback</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center h-100">
                <div className="mb-3">
                  <span className="display-6">🎓</span>
                </div>
                <h5 className="text-warning">Students</h5>
                <p className="small text-light">Track academic progress and provide course feedback</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card border-info">
                <div className="card-body">
                  <h5 className="text-info">System Features</h5>
                  <div className="row text-start">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li>✅ Real-time reporting</li>
                        <li>✅ Performance analytics</li>
                        <li>✅ Feedback system</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li>✅ Attendance tracking</li>
                        <li>✅ Course management</li>
                        <li>✅ Role-based access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}