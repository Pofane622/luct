import React, { useState, useEffect } from 'react';

const AttendanceMonitoring = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('all');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/attendance', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAttendance(data.attendance || []);
      } else {
        setError('Failed to fetch attendance');
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Network error');
      // Demo data
      setAttendance([
        {
          id: 1,
          course: 'Software Engineering',
          code: 'SE301',
          totalClasses: 20,
          attendedClasses: 18,
          percentage: 90,
          status: 'Good',
          lastAttendance: '2024-03-15'
        },
        {
          id: 2,
          course: 'Database Systems',
          code: 'DB201',
          totalClasses: 18,
          attendedClasses: 16,
          percentage: 89,
          status: 'Good',
          lastAttendance: '2024-03-14'
        },
        {
          id: 3,
          course: 'Web Development',
          code: 'WD101',
          totalClasses: 15,
          attendedClasses: 12,
          percentage: 80,
          status: 'Warning',
          lastAttendance: '2024-03-13'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'success';
      case 'Good': return 'primary';
      case 'Warning': return 'warning';
      case 'Critical': return 'danger';
      default: return 'secondary';
    }
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 80) return 'warning';
    return 'danger';
  };

  const filteredAttendance = selectedCourse === 'all'
    ? attendance
    : attendance.filter(a => a.code === selectedCourse);

  const courses = [...new Set(attendance.map(a => a.code))];

  const overallAttendance = attendance.length > 0
    ? Math.round(attendance.reduce((sum, a) => sum + a.percentage, 0) / attendance.length)
    : 0;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-light">Loading attendance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="fas fa-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="attendance-monitoring">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-warning mb-0">
          <i className="fas fa-user-check me-2"></i>
          Attendance Monitoring
        </h3>
        <div className="d-flex align-items-center gap-3">
          <div className="text-center">
            <div className={`fs-4 fw-bold text-${getPercentageColor(overallAttendance)}`}>
              {overallAttendance}%
            </div>
            <small className="text-muted">Overall</small>
          </div>
          <select
            className="form-select form-select-sm"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredAttendance.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-user-check fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No attendance data</h5>
          <p className="text-muted">Your attendance records will appear here.</p>
        </div>
      ) : (
        <div className="row">
          {filteredAttendance.map(record => (
            <div key={record.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-0" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'}}>
                <div className="card-body text-white d-flex flex-column">
                  <div className="mb-3">
                    <h5 className="card-title text-white fw-bold">{record.course}</h5>
                    <span className="badge bg-white text-dark mb-2">{record.code}</span>
                  </div>

                  <div className="attendance-stats text-center mb-3">
                    <div className={`percentage-badge badge bg-${getPercentageColor(record.percentage)} fs-4 px-3 py-2 mb-2`}>
                      {record.percentage}%
                    </div>
                    <div className="stats-details">
                      <small className="text-white-50">
                        {record.attendedClasses} / {record.totalClasses} classes
                      </small>
                    </div>
                  </div>

                  <div className="attendance-details flex-grow-1">
                    <div className="mb-2">
                      <i className="fas fa-chart-line me-2"></i>
                      <span className={`badge bg-${getStatusColor(record.status)} text-white`}>
                        {record.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <i className="fas fa-calendar-check me-2"></i>
                      <small className="text-white-50">
                        Last: {new Date(record.lastAttendance).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  <div className="progress mb-3" style={{height: '8px'}}>
                    <div
                      className={`progress-bar bg-white`}
                      style={{width: `${record.percentage}%`}}
                    ></div>
                  </div>

                  <button className="btn btn-light btn-sm w-100 mt-auto">
                    <i className="fas fa-eye me-2"></i>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attendance Summary */}
      <div className="mt-5">
        <h4 className="text-warning mb-3">
          <i className="fas fa-chart-pie me-2"></i>
          Attendance Summary
        </h4>
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card text-center border-0 bg-secondary">
              <div className="card-body py-3">
                <h6 className="text-success mb-1">Excellent (≥90%)</h6>
                <div className="fs-4 fw-bold text-light">
                  {attendance.filter(a => a.percentage >= 90).length}
                </div>
                <small className="text-muted">courses</small>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center border-0 bg-secondary">
              <div className="card-body py-3">
                <h6 className="text-warning mb-1">Needs Attention (80-89%)</h6>
                <div className="fs-4 fw-bold text-light">
                  {attendance.filter(a => a.percentage >= 80 && a.percentage < 90).length}
                </div>
                <small className="text-muted">courses</small>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center border-0 bg-secondary">
              <div className="card-body py-3">
                <h6 className="text-danger mb-1">Critical (<80%)</h6>
                <div className="fs-4 fw-bold text-light">
                  {attendance.filter(a => a.percentage < 80).length}
                </div>
                <small className="text-muted">courses</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMonitoring;
