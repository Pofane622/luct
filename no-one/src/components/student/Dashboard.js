import React from 'react';

const StudentDashboard = () => {
  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-8 col-lg-10">
        <div className="card bg-dark border-warning">
          <div className="card-body p-4">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="mb-3">
                <span style={{fontSize: "3rem"}}>📊</span>
              </div>
              <h2 className="text-warning fw-bold">Student Dashboard</h2>
              <p className="text-light opacity-75">Academic Intelligence Platform</p>
            </div>

            {/* Dashboard Content */}
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card border-0" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                  <div className="card-body text-center text-white">
                    <div className="mb-2">
                      <span style={{fontSize: "2rem"}}>📚</span>
                    </div>
                    <h5 className="text-white">My Courses</h5>
                    <p className="text-white-50 small">View enrolled courses</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-4">
                <div className="card border-0" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                  <div className="card-body text-center text-white">
                    <div className="mb-2">
                      <span style={{fontSize: "2rem"}}>📝</span>
                    </div>
                    <h5 className="text-white">Grades</h5>
                    <p className="text-white-50 small">Check your performance</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4 mb-4">
                <div className="card border-0" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                  <div className="card-body text-center text-white">
                    <div className="mb-2">
                      <span style={{fontSize: "2rem"}}>🗓️</span>
                    </div>
                    <h5 className="text-white">Schedule</h5>
                    <p className="text-white-50 small">View class timetable</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card border-0" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
                  <div className="card-body text-center text-white">
                    <div className="mb-2">
                      <span style={{fontSize: "2rem"}}>📢</span>
                    </div>
                    <h5 className="text-white">Announcements</h5>
                    <p className="text-white-50 small">Latest updates</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card border-0" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
                  <div className="card-body text-center text-white">
                    <div className="mb-2">
                      <span style={{fontSize: "2rem"}}>👥</span>
                    </div>
                    <h5 className="text-white">Attendance</h5>
                    <p className="text-white-50 small">Track your attendance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
