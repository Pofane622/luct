// src/components/student/Dashboard.js
import React, { useState } from 'react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  
  // Mock data - replace with real API data later
  const studentData = {
    name: "",
    id: "STU2024001",
    program: "BSc Software Engineering",
    semester: "Semester 2, 2024",
    attendance: 92,
    gpa: 3.8,
    courses: [
      { 
        code: "ICT3101", 
        name: "Web Development", 
        instructor: "Dr. Thabo Moloi", 
        attendance: 95, 
        nextClass: "Mon 2:00 PM",
        currentRating: 0,
        userRating: null
      },
      { 
        code: "ICT2202", 
        name: "Database Systems", 
        instructor: "Ms. Lerato Nkosi", 
        attendance: 88, 
        nextClass: "Tue 10:00 AM",
        currentRating: 0,
        userRating: null
      },
      { 
        code: "ICT3301", 
        name: "Software Engineering", 
        instructor: "Prof. David Chen", 
        attendance: 93, 
        nextClass: "Wed 3:00 PM",
        currentRating: 0,
        userRating: null
      },
      { 
        code: "MATH2101", 
        name: "Discrete Mathematics", 
        instructor: "Dr. Anna Petrova", 
        attendance: 90, 
        nextClass: "Thu 1:00 PM",
        currentRating: 0,
        userRating: null
      }
    ],
    upcomingDeadlines: [
      { course: "Web Development", task: "React Project Submission", due: "2024-06-15", priority: "high" },
      { course: "Database Systems", task: "SQL Assignment", due: "2024-06-18", priority: "medium" },
      { course: "Software Engineering", task: "Project Documentation", due: "2024-06-20", priority: "low" }
    ],
    recentGrades: [
      { course: "Web Development", assessment: "Midterm Exam", grade: "A", score: 88 },
      { course: "Database Systems", assessment: "Lab Practical", grade: "B+", score: 85 },
      { course: "Discrete Mathematics", assessment: "Quiz 2", grade: "A-", score: 86 }
    ],
    ratings: [] // Store submitted ratings
  };

  // Star Rating Component
  const StarRating = ({ rating, onRatingChange, hoverRating, onHoverChange, readonly = false }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hoverRating || rating) ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
            onClick={() => !readonly && onRatingChange(star)}
            onMouseEnter={() => !readonly && onHoverChange(star)}
            onMouseLeave={() => !readonly && onHoverChange(0)}
            style={{ cursor: readonly ? 'default' : 'pointer', fontSize: '24px' }}
          >
            {star <= (hoverRating || rating) ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  // Open rating modal
  const handleRateLecture = (course) => {
    setSelectedCourse(course);
    setCurrentRating(course.userRating || 0);
    setRatingComment('');
    setShowRatingModal(true);
  };

  // Submit rating
  const handleSubmitRating = async () => {
    if (currentRating === 0) {
      alert('Please select a rating before submitting.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/submit-rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseCode: selectedCourse.code,
          courseName: selectedCourse.name,
          lecturerName: selectedCourse.instructor,
          rating: currentRating,
          comment: ratingComment
        })
      });

      if (response.ok) {
        alert(`Thank you! You rated ${selectedCourse.name} ${currentRating} star${currentRating > 1 ? 's' : ''}.`);
        // Update the course rating in local state
        selectedCourse.userRating = currentRating;
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to submit rating'}`);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating. Please try again.');
    }

    // Close modal and reset
    setShowRatingModal(false);
    setSelectedCourse(null);
    setCurrentRating(0);
    setRatingComment('');
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'success';
    if (grade.includes('B')) return 'info';
    if (grade.includes('C')) return 'warning';
    return 'secondary';
  };

  return (
    <div className="portal-main">
      <div className="container-fluid">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="portal-card p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <div className="student-avatar me-3">
                      <div className="avatar-icon">🎓</div>
                    </div>
                    <div>
                      <h2 className="text-warning mb-1">Welcome back, {studentData.name}!</h2>
                      <p className="text-light mb-0">
                        {studentData.program} • {studentData.id} • {studentData.semester}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <div className="quick-stats">
                    <span className="stat-badge me-3">
                      <strong className="text-warning">{studentData.attendance}%</strong>
                      <small className="text-light d-block">Attendance</small>
                    </span>
                    <span className="stat-badge">
                      <strong className="text-warning">{studentData.gpa}</strong>
                      <small className="text-light d-block">GPA</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="portal-card">
              <div className="portal-nav-tabs">
                <button 
                  className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  📊 Overview
                </button>
                <button 
                  className={`nav-tab ${activeTab === 'courses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('courses')}
                >
                  📚 My Courses
                </button>
                <button 
                  className={`nav-tab ${activeTab === 'schedule' ? 'active' : ''}`}
                  onClick={() => setActiveTab('schedule')}
                >
                  🗓️ Schedule
                </button>
                <button 
                  className={`nav-tab ${activeTab === 'grades' ? 'active' : ''}`}
                  onClick={() => setActiveTab('grades')}
                >
                  📝 Grades
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content based on Active Tab */}
        <div className="row">
          <div className="col-12">
            {activeTab === 'overview' && (
              <div className="row g-4">
                {/* Quick Stats */}
                <div className="col-xl-3 col-md-6">
                  <div className="portal-card text-center p-4">
                    <div className="stat-icon mb-3">📚</div>
                    <h3 className="text-warning mb-1">{studentData.courses.length}</h3>
                    <p className="text-light mb-0">Active Courses</p>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="portal-card text-center p-4">
                    <div className="stat-icon mb-3">✅</div>
                    <h3 className="text-warning mb-1">{studentData.attendance}%</h3>
                    <p className="text-light mb-0">Overall Attendance</p>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="portal-card text-center p-4">
                    <div className="stat-icon mb-3">⭐</div>
                    <h3 className="text-warning mb-1">
                      {studentData.courses.filter(course => course.userRating).length}
                    </h3>
                    <p className="text-light mb-0">Courses Rated</p>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="portal-card text-center p-4">
                    <div className="stat-icon mb-3">🏆</div>
                    <h3 className="text-warning mb-1">{studentData.gpa}</h3>
                    <p className="text-light mb-0">Current GPA</p>
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="col-lg-6">
                  <div className="portal-card h-100">
                    <div className="portal-card-header">
                      <h5 className="text-warning mb-0">⏰ Upcoming Deadlines</h5>
                    </div>
                    <div className="card-body">
                      {studentData.upcomingDeadlines.map((deadline, index) => (
                        <div key={index} className="deadline-item mb-3 p-3 border-bottom border-secondary">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="text-light mb-1">{deadline.task}</h6>
                              <small className="text-muted">{deadline.course}</small>
                            </div>
                            <div className="text-end">
                              <span className={`badge bg-${getPriorityColor(deadline.priority)} me-2`}>
                                {deadline.priority}
                              </span>
                              <small className="text-warning">{new Date(deadline.due).toLocaleDateString()}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Grades */}
                <div className="col-lg-6">
                  <div className="portal-card h-100">
                    <div className="portal-card-header">
                      <h5 className="text-warning mb-0">📈 Recent Grades</h5>
                    </div>
                    <div className="card-body">
                      {studentData.recentGrades.map((grade, index) => (
                        <div key={index} className="grade-item mb-3 p-3 border-bottom border-secondary">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="text-light mb-1">{grade.assessment}</h6>
                              <small className="text-muted">{grade.course}</small>
                            </div>
                            <div className="text-end">
                              <span className={`badge bg-${getGradeColor(grade.grade)} me-2`}>
                                {grade.grade}
                              </span>
                              <strong className="text-warning">{grade.score}%</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="portal-card">
                <div className="portal-card-header">
                  <h5 className="text-warning mb-0">📚 My Courses</h5>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    {studentData.courses.map((course, index) => (
                      <div key={index} className="col-lg-6">
                        <div className="course-card portal-card p-4 h-100">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h6 className="text-warning mb-0">{course.code}</h6>
                            <span className={`badge bg-${course.attendance >= 90 ? 'success' : course.attendance >= 80 ? 'warning' : 'danger'}`}>
                              {course.attendance}%
                            </span>
                          </div>
                          <h5 className="text-light mb-2">{course.name}</h5>
                          <p className="text-muted mb-3">Instructor: {course.instructor}</p>
                          
                          {/* Rating Display */}
                          <div className="rating-section mb-3">
                            <small className="text-light d-block mb-1">Your Rating:</small>
                            {course.userRating ? (
                              <div className="d-flex align-items-center">
                                <StarRating 
                                  rating={course.userRating} 
                                  readonly={true}
                                />
                                <span className="badge bg-success ms-2">{course.userRating}/5</span>
                              </div>
                            ) : (
                              <small className="text-muted">Not rated yet</small>
                            )}
                          </div>

                          <div className="course-meta">
                            <small className="text-light">
                              <span className="text-warning">Next Class:</span> {course.nextClass}
                            </small>
                          </div>
                          <div className="mt-3">
                            <button className="btn btn-portal-secondary btn-sm me-2">
                              View Materials
                            </button>
                            <button 
                              className={`btn ${course.userRating ? 'btn-outline-warning' : 'btn-portal-primary'} btn-sm`}
                              onClick={() => handleRateLecture(course)}
                            >
                              {course.userRating ? 'Update Rating' : 'Rate Lecture'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="portal-card">
                <div className="portal-card-header">
                  <h5 className="text-warning mb-0">🗓️ Weekly Schedule</h5>
                </div>
                <div className="card-body">
                  <div className="schedule-grid">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                      <div key={day} className="schedule-day">
                        <h6 className="text-warning mb-3">{day}</h6>
                        {studentData.courses.filter(course => course.nextClass.includes(day.substring(0, 3))).map((course, index) => (
                          <div key={index} className="schedule-item mb-2 p-3 portal-card">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong className="text-light">{course.code}</strong>
                                <small className="text-muted d-block">{course.name}</small>
                                {course.userRating && (
                                  <small className="text-warning">
                                    Your Rating: {course.userRating}★
                                  </small>
                                )}
                              </div>
                              <span className="text-warning">{course.nextClass.split(' ')[1]}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'grades' && (
              <div className="portal-card">
                <div className="portal-card-header">
                  <h5 className="text-warning mb-0">📊 Academic Performance</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h6 className="text-light mb-3">Grade Distribution</h6>
                      {/* Grade chart would go here */}
                      <div className="grade-chart-placeholder portal-card p-4 text-center">
                        <div className="text-muted mb-3">📈 Grade Analytics Chart</div>
                        <small className="text-light">Visual representation of your academic performance across courses</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-light mb-3">Performance Summary</h6>
                      <div className="performance-stats">
                        <div className="stat-item mb-3 p-3 portal-card">
                          <small className="text-muted d-block">Current GPA</small>
                          <strong className="text-warning h5">{studentData.gpa}</strong>
                        </div>
                        <div className="stat-item mb-3 p-3 portal-card">
                          <small className="text-muted d-block">Courses Completed</small>
                          <strong className="text-warning h5">12</strong>
                        </div>
                        <div className="stat-item p-3 portal-card">
                          <small className="text-muted d-block">Courses Rated</small>
                          <strong className="text-warning h5">
                            {studentData.courses.filter(course => course.userRating).length}/{studentData.courses.length}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedCourse && (
        <div className="modal-backdrop show d-block">
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content portal-card">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title text-warning">
                    Rate {selectedCourse.name}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white"
                    onClick={() => setShowRatingModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="text-light mb-3">
                    How would you rate {selectedCourse.instructor}'s lectures for {selectedCourse.code}?
                  </p>
                  
                  <div className="text-center mb-4">
                    <StarRating 
                      rating={currentRating}
                      onRatingChange={setCurrentRating}
                      hoverRating={hoverRating}
                      onHoverChange={setHoverRating}
                    />
                    <div className="mt-2">
                      <small className="text-muted">
                        {currentRating === 0 ? 'Select a rating' : `You selected: ${currentRating} star${currentRating > 1 ? 's' : ''}`}
                      </small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-light">Optional Feedback</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Share your thoughts about the lectures (optional)..."
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button 
                    type="button" 
                    className="btn btn-portal-secondary"
                    onClick={() => setShowRatingModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-portal-primary"
                    onClick={handleSubmitRating}
                    disabled={currentRating === 0}
                  >
                    Submit Rating
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for star rating */}
      <style jsx>{`
        .star-rating {
          display: inline-block;
        }
        .star {
          color: #6c757d;
          margin: 0 2px;
          transition: color 0.2s;
        }
        .star.filled {
          color: #ffc107;
        }
        .star:hover {
          color: #ffc107;
        }
        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .schedule-day {
          padding: 1rem;
        }
        .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
}