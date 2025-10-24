// src/components/prl/Dashboard.js
import React, { useState } from 'react';

export default function PrincipalLecturerDashboard() {
  const [activeModule, setActiveModule] = useState('overview');
  const [selectedStream, setSelectedStream] = useState('ICT');
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState({});

  // Enhanced Mock Data
  const prlData = {
    name: "",
    title: "Principal Lecturer - ICT Stream",
    avatar: "👩‍🏫",
    streams: ["ICT", "Computer Science", "Software Engineering", "Data Science"],
    stats: {
      totalCourses: 24,
      totalLecturers: 18,
      avgAttendance: 89,
      pendingReports: 12,
      reviewedReports: 156
    },
    courses: [
      {
        id: 1,
        code: "ICT3101",
        name: "Web Development",
        lecturer: "Dr. Thabo Moloi",
        students: 45,
        schedule: "Mon 2:00 PM, Wed 10:00 AM",
        venue: "Lab A",
        stream: "ICT",
        status: "Active",
        rating: 4.7,
        recentAttendance: [42, 40, 38, 45, 41],
        assignments: 3
      },
      {
        id: 2,
        code: "ICT2202",
        name: "Database Systems",
        lecturer: "Ms. Lerato Nkosi",
        students: 40,
        schedule: "Tue 10:00 AM, Thu 3:00 PM",
        venue: "Lab B",
        stream: "ICT",
        status: "Active",
        rating: 4.5,
        recentAttendance: [38, 35, 40, 37, 39],
        assignments: 2
      }
    ],
    reports: [
      {
        id: 1,
        lecturerName: "Dr. Thabo Moloi",
        courseName: "Web Development",
        courseCode: "ICT3101",
        className: "BSc SE Year 3",
        dateOfLecture: "2024-06-10",
        weekOfReporting: 12,
        studentsPresent: 42,
        totalRegistered: 45,
        topicTaught: "React Router & Navigation",
        learningOutcomes: "Students can implement client-side routing and navigation in React applications",
        status: "Pending Review",
        feedback: "",
        attendanceRate: 93,
        stream: "ICT"
      },
      {
        id: 2,
        lecturerName: "Ms. Lerato Nkosi",
        courseName: "Database Systems",
        courseCode: "ICT2202",
        className: "BSc SE Year 2",
        dateOfLecture: "2024-06-09",
        weekOfReporting: 12,
        studentsPresent: 38,
        totalRegistered: 40,
        topicTaught: "SQL Joins & Subqueries",
        learningOutcomes: "Students can write complex SQL queries using joins and subqueries",
        status: "Reviewed",
        feedback: "Good coverage. Consider adding real-world examples of complex queries.",
        attendanceRate: 95,
        stream: "ICT"
      }
    ],
    lecturers: [
      {
        id: 1,
        name: "Dr. Thabo Moloi",
        email: "t.moloi@university.ac.za",
        department: "Software Engineering",
        courses: 3,
        avgRating: 4.7,
        totalStudents: 125,
        status: "Active",
        joinDate: "2020-03-15",
        stream: "ICT"
      },
      {
        id: 2,
        name: "Ms. Lerato Nkosi",
        email: "l.nkosi@university.ac.za",
        department: "Computer Science",
        courses: 2,
        avgRating: 4.5,
        totalStudents: 80,
        status: "Active",
        joinDate: "2021-08-22",
        stream: "ICT"
      }
    ],
    upcomingReviews: [
      {
        id: 1,
        lecturer: "Dr. Thabo Moloi",
        course: "Web Development",
        date: "2024-06-17",
        type: "Course Review",
        priority: "High"
      }
    ]
  };

  // Star Rating Component
  const StarRating = ({ rating, size = 16, showNumber = false }) => {
    return React.createElement('div', { className: 'star-rating d-inline-flex align-items-center' },
      [1, 2, 3, 4, 5].map((star) =>
        React.createElement('span', {
          key: star,
          style: { 
            fontSize: `${size}px`, 
            color: star <= rating ? '#ffc107' : '#6c757d',
            marginRight: '2px'
          }
        }, star <= rating ? '★' : '☆')
      ),
      showNumber && React.createElement('span', { 
        className: 'rating-number ms-2 text-warning fw-bold' 
      }, rating.toFixed(1))
    );
  };

  // Mini Attendance Chart
  const MiniAttendanceChart = ({ data }) => {
    const max = Math.max(...data);
    return React.createElement('div', { 
      className: 'mini-chart d-flex align-items-end', 
      style: { height: '30px', width: '80px' } 
    },
      data.map((value, index) =>
        React.createElement('div', {
          key: index,
          className: 'chart-bar mx-1',
          style: {
            height: `${(value / max) * 100}%`,
            width: '6px',
            backgroundColor: value >= max * 0.8 ? '#10b981' : value >= max * 0.6 ? '#f59e0b' : '#ef4444',
            borderRadius: '2px'
          }
        })
      )
    );
  };

  // Filter data based on stream and search
  const filteredCourses = prlData.courses.filter(course => 
    course.stream === selectedStream && 
    (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     course.lecturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     course.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredReports = prlData.reports.filter(report => 
    report.stream === selectedStream && 
    (report.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     report.lecturerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredLecturers = prlData.lecturers.filter(lecturer => 
    lecturer.stream === selectedStream && 
    lecturer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'Active': { class: 'bg-success', icon: '🟢' },
      'Pending Review': { class: 'bg-warning', icon: '🟡' },
      'Reviewed': { class: 'bg-info', icon: '🔵' },
      'Inactive': { class: 'bg-secondary', icon: '⚫' }
    };
    
    const config = statusConfig[status] || statusConfig['Active'];
    return React.createElement('span', { 
      className: `badge ${config.class} d-inline-flex align-items-center gap-1` 
    },
      config.icon,
      status
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const priorityConfig = {
      'High': { class: 'bg-danger', icon: '🔴' },
      'Medium': { class: 'bg-warning', icon: '🟡' },
      'Low': { class: 'bg-info', icon: '🔵' }
    };
    
    const config = priorityConfig[priority] || priorityConfig['Medium'];
    return React.createElement('span', { 
      className: `badge ${config.class}` 
    }, priority);
  };

  const handleFeedbackChange = (reportId, value) => {
    setFeedback(prev => ({ ...prev, [reportId]: value }));
  };

  const handleSubmitFeedback = (reportId) => {
    console.log(`Feedback for Report ${reportId}:`, feedback[reportId]);
    alert('Feedback submitted successfully!');
  };

  // Module tabs configuration
  const moduleTabs = [
    { id: 'overview', name: '🏠 Overview', icon: '🏠' },
    { id: 'courses', name: '📚 Courses', icon: '📚' },
    { id: 'reports', name: '📋 Reports', icon: '📋' },
    { id: 'monitoring', name: '📊 Monitoring', icon: '📊' },
    { id: 'rating', name: '⭐ Rating', icon: '⭐' },
    { id: 'classes', name: '👨‍🏫 Lecturers', icon: '👨‍🏫' }
  ];

  // Render Overview Module
  const renderOverviewModule = () => {
    return React.createElement('div', { className: 'row g-4' },
      // Quick Stats Cards
      React.createElement('div', { className: 'col-md-3' },
        React.createElement('div', { className: 'stat-card-primary text-center p-4 rounded' },
          React.createElement('div', { className: 'stat-icon mb-3' }, '📚'),
          React.createElement('h3', { className: 'text-warning mb-1' }, prlData.stats.totalCourses),
          React.createElement('p', { className: 'text-light mb-0' }, 'Total Courses')
        )
      ),
      React.createElement('div', { className: 'col-md-3' },
        React.createElement('div', { className: 'stat-card-primary text-center p-4 rounded' },
          React.createElement('div', { className: 'stat-icon mb-3' }, '👨‍🏫'),
          React.createElement('h3', { className: 'text-warning mb-1' }, prlData.stats.totalLecturers),
          React.createElement('p', { className: 'text-light mb-0' }, 'Lecturers')
        )
      ),
      React.createElement('div', { className: 'col-md-3' },
        React.createElement('div', { className: 'stat-card-primary text-center p-4 rounded' },
          React.createElement('div', { className: 'stat-icon mb-3' }, '📊'),
          React.createElement('h3', { className: 'text-warning mb-1' }, `${prlData.stats.avgAttendance}%`),
          React.createElement('p', { className: 'text-light mb-0' }, 'Avg Attendance')
        )
      ),
      React.createElement('div', { className: 'col-md-3' },
        React.createElement('div', { className: 'stat-card-primary text-center p-4 rounded' },
          React.createElement('div', { className: 'stat-icon mb-3' }, '⏳'),
          React.createElement('h3', { className: 'text-warning mb-1' }, prlData.stats.pendingReports),
          React.createElement('p', { className: 'text-light mb-0' }, 'Pending Reviews')
        )
      ),

      // Stream Performance
      React.createElement('div', { className: 'col-lg-8' },
        React.createElement('div', { className: 'portal-card h-100' },
          React.createElement('div', { className: 'portal-card-header' },
            React.createElement('h5', { className: 'text-warning mb-0' }, '📈 Stream Performance Overview')
          ),
          React.createElement('div', { className: 'card-body' },
            React.createElement('div', { className: 'row g-4' },
              prlData.streams.map(stream =>
                React.createElement('div', { key: stream, className: 'col-md-6' },
                  React.createElement('div', { className: 'stream-performance-card p-3 rounded' },
                    React.createElement('div', { className: 'd-flex justify-content-between align-items-center mb-2' },
                      React.createElement('h6', { className: 'text-light mb-0' }, stream),
                      React.createElement('span', { className: 'badge bg-primary' }, 
                        prlData.courses.filter(c => c.stream === stream).length + ' courses'
                      )
                    ),
                    React.createElement('div', { className: 'performance-metrics' },
                      React.createElement('div', { className: 'd-flex justify-content-between text-light mb-1' },
                        React.createElement('small', null, 'Avg Rating:'),
                        React.createElement('small', { className: 'text-warning' }, '4.6/5.0')
                      ),
                      React.createElement('div', { className: 'd-flex justify-content-between text-light' },
                        React.createElement('small', null, 'Total Students:'),
                        React.createElement('small', { className: 'text-info' }, '285')
                      )
                    )
                  )
                )
              )
            )
          )
        )
      ),

      // Upcoming Reviews
      React.createElement('div', { className: 'col-lg-4' },
        React.createElement('div', { className: 'portal-card h-100' },
          React.createElement('div', { className: 'portal-card-header' },
            React.createElement('h5', { className: 'text-warning mb-0' }, '⏰ Upcoming Reviews')
          ),
          React.createElement('div', { className: 'card-body' },
            prlData.upcomingReviews.map(review =>
              React.createElement('div', { key: review.id, className: 'review-item mb-3 p-3 border-bottom border-secondary' },
                React.createElement('div', { className: 'd-flex justify-content-between align-items-start mb-2' },
                  React.createElement('div', null,
                    React.createElement('h6', { className: 'text-light mb-1' }, review.course),
                    React.createElement('small', { className: 'text-muted' }, review.lecturer)
                  ),
                  React.createElement(PriorityBadge, { priority: review.priority })
                ),
                React.createElement('div', { className: 'd-flex justify-content-between align-items-center' },
                  React.createElement('small', { className: 'text-muted' }, review.type),
                  React.createElement('small', { className: 'text-warning' }, review.date)
                )
              )
            )
          )
        )
      )
    );
  };

  // Render Courses Module
  const renderCoursesModule = () => {
    return React.createElement('div', null,
      React.createElement('div', { className: 'portal-card' },
        React.createElement('div', { className: 'portal-card-header d-flex justify-content-between align-items-center' },
          React.createElement('h5', { className: 'text-warning mb-0' }, '📚 All Courses & Lectures'),
          React.createElement('div', { className: 'd-flex gap-2' },
            React.createElement('select', {
              className: 'form-select form-select-sm',
              value: selectedStream,
              onChange: (e) => setSelectedStream(e.target.value)
            },
              prlData.streams.map(stream =>
                React.createElement('option', { key: stream, value: stream }, stream)
              )
            ),
            React.createElement('input', {
              type: 'text',
              className: 'form-control form-control-sm',
              placeholder: 'Search courses...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              style: { width: '200px' }
            })
          )
        ),
        React.createElement('div', { className: 'card-body' },
          React.createElement('div', { className: 'table-responsive' },
            React.createElement('table', { className: 'table table-dark table-hover' },
              React.createElement('thead', null,
                React.createElement('tr', null,
                  React.createElement('th', null, 'Course Code'),
                  React.createElement('th', null, 'Course Name'),
                  React.createElement('th', null, 'Lecturer'),
                  React.createElement('th', null, 'Students'),
                  React.createElement('th', null, 'Rating'),
                  React.createElement('th', null, 'Attendance Trend'),
                  React.createElement('th', null, 'Status'),
                  React.createElement('th', null, 'Actions')
                )
              ),
              React.createElement('tbody', null,
                filteredCourses.map(course =>
                  React.createElement('tr', { key: course.id },
                    React.createElement('td', null,
                      React.createElement('strong', { className: 'text-warning' }, course.code)
                    ),
                    React.createElement('td', null,
                      React.createElement('div', null,
                        React.createElement('div', { className: 'text-light' }, course.name),
                        React.createElement('small', { className: 'text-muted' }, course.schedule)
                      )
                    ),
                    React.createElement('td', null,
                      React.createElement('div', { className: 'text-light' }, course.lecturer)
                    ),
                    React.createElement('td', null,
                      React.createElement('div', { className: 'text-center' },
                        React.createElement('strong', { className: 'text-info' }, course.students)
                      )
                    ),
                    React.createElement('td', null,
                      React.createElement(StarRating, { rating: course.rating, size: 14, showNumber: true })
                    ),
                    React.createElement('td', null,
                      React.createElement(MiniAttendanceChart, { data: course.recentAttendance })
                    ),
                    React.createElement('td', null,
                      React.createElement(StatusBadge, { status: course.status })
                    ),
                    React.createElement('td', null,
                      React.createElement('div', { className: 'btn-group btn-group-sm' },
                        React.createElement('button', { 
                          className: 'btn btn-outline-warning'
                        }, '👁️ View'),
                        React.createElement('button', { 
                          className: 'btn btn-outline-info'
                        }, '📊 Analytics')
                      )
                    )
                  )
                )
              )
            )
          ),
          filteredCourses.length === 0 && React.createElement('div', { className: 'text-center py-5' },
            React.createElement('p', { className: 'text-muted' }, 'No courses found for the selected stream and search criteria.')
          )
        )
      )
    );
  };

  // Render Reports Module
  const renderReportsModule = () => {
    return React.createElement('div', null,
      React.createElement('div', { className: 'portal-card' },
        React.createElement('div', { className: 'portal-card-header d-flex justify-content-between align-items-center' },
          React.createElement('h5', { className: 'text-warning mb-0' }, '📋 Lecture Reports & Feedback'),
          React.createElement('div', { className: 'd-flex gap-2' },
            React.createElement('select', {
              className: 'form-select form-select-sm',
              value: selectedStream,
              onChange: (e) => setSelectedStream(e.target.value)
            },
              prlData.streams.map(stream =>
                React.createElement('option', { key: stream, value: stream }, stream)
              )
            ),
            React.createElement('input', {
              type: 'text',
              className: 'form-control form-control-sm',
              placeholder: 'Search reports...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              style: { width: '200px' }
            })
          )
        ),
        React.createElement('div', { className: 'card-body' },
          React.createElement('div', { className: 'row g-4' },
            filteredReports.map(report =>
              React.createElement('div', { key: report.id, className: 'col-12' },
                React.createElement('div', { className: 'report-card portal-card p-4' },
                  React.createElement('div', { className: 'report-header d-flex justify-content-between align-items-start mb-3' },
                    React.createElement('div', null,
                      React.createElement('h5', { className: 'text-warning mb-1' }, 
                        `${report.courseName} (${report.courseCode})`
                      ),
                      React.createElement('div', { className: 'd-flex gap-3 text-light' },
                        React.createElement('small', null, `👨‍🏫 ${report.lecturerName}`),
                        React.createElement('small', null, `🏫 ${report.className}`),
                        React.createElement('small', null, `📅 Week ${report.weekOfReporting}`)
                      )
                    ),
                    React.createElement(StatusBadge, { status: report.status })
                  ),

                  React.createElement('div', { className: 'row' },
                    React.createElement('div', { className: 'col-md-6' },
                      React.createElement('div', { className: 'report-details' },
                        React.createElement('div', { className: 'detail-item mb-2' },
                          React.createElement('strong', { className: 'text-light' }, 'Date: '),
                          React.createElement('span', { className: 'text-light' }, 
                            new Date(report.dateOfLecture).toLocaleDateString()
                          )
                        ),
                        React.createElement('div', { className: 'detail-item mb-2' },
                          React.createElement('strong', { className: 'text-light' }, 'Topic: '),
                          React.createElement('span', { className: 'text-light' }, report.topicTaught)
                        ),
                        React.createElement('div', { className: 'detail-item mb-2' },
                          React.createElement('strong', { className: 'text-light' }, 'Learning Outcomes: '),
                          React.createElement('span', { className: 'text-light' }, report.learningOutcomes)
                        ),
                        React.createElement('div', { className: 'detail-item' },
                          React.createElement('strong', { className: 'text-light' }, 'Attendance: '),
                          React.createElement('span', { className: 'text-warning fw-bold' }, report.studentsPresent),
                          React.createElement('span', { className: 'text-muted' }, ` / ${report.totalRegistered}`),
                          React.createElement('span', { className: `badge ms-2 ${report.attendanceRate >= 90 ? 'bg-success' : report.attendanceRate >= 80 ? 'bg-warning' : 'bg-danger'}` },
                            `${report.attendanceRate}%`
                          )
                        )
                      )
                    ),
                    React.createElement('div', { className: 'col-md-6' },
                      React.createElement('div', { className: 'feedback-section' },
                        React.createElement('label', { className: 'form-label fw-bold text-light' }, 'Your Feedback'),
                        React.createElement('textarea', {
                          className: 'form-control mb-3',
                          rows: 4,
                          value: feedback[report.id] || report.feedback || '',
                          onChange: (e) => handleFeedbackChange(report.id, e.target.value),
                          placeholder: 'Provide constructive feedback, suggestions, or approval...'
                        }),
                        React.createElement('div', { className: 'd-flex gap-2' },
                          React.createElement('button', {
                            className: 'btn btn-success btn-sm',
                            onClick: () => handleSubmitFeedback(report.id)
                          }, '✅ Approve & Submit'),
                          React.createElement('button', {
                            className: 'btn btn-warning btn-sm',
                            onClick: () => handleSubmitFeedback(report.id)
                          }, '📝 Save Draft'),
                          report.feedback && React.createElement('button', {
                            className: 'btn btn-info btn-sm'
                          }, '👁️ View Previous')
                        )
                      )
                    )
                  )
                )
              )
            )
          ),
          filteredReports.length === 0 && React.createElement('div', { className: 'text-center py-5' },
            React.createElement('p', { className: 'text-muted' }, 'No reports found for the selected stream and search criteria.')
          )
        )
      )
    );
  };

  // Render Monitoring Module
  const renderMonitoringModule = () => {
    return React.createElement('div', { className: 'row g-4' },
      React.createElement('div', { className: 'col-12' },
        React.createElement('div', { className: 'portal-card' },
          React.createElement('div', { className: 'portal-card-header' },
            React.createElement('h5', { className: 'text-warning mb-0' }, '📊 Stream Monitoring Dashboard')
          ),
          React.createElement('div', { className: 'card-body' },
            React.createElement('div', { className: 'row g-4' },
              prlData.streams.map(stream =>
                React.createElement('div', { key: stream, className: 'col-md-6 col-lg-3' },
                  React.createElement('div', { className: 'monitoring-card text-center p-4 rounded' },
                    React.createElement('div', { className: 'stream-icon mb-3' }, '📈'),
                    React.createElement('h4', { className: 'text-light mb-2' }, stream),
                    React.createElement('div', { className: 'stream-stats' },
                      React.createElement('div', { className: 'stat-item d-flex justify-content-between mb-2' },
                        React.createElement('span', { className: 'text-muted' }, 'Courses:'),
                        React.createElement('span', { className: 'text-warning' }, 
                          prlData.courses.filter(c => c.stream === stream).length
                        )
                      ),
                      React.createElement('div', { className: 'stat-item d-flex justify-content-between mb-2' },
                        React.createElement('span', { className: 'text-muted' }, 'Lecturers:'),
                        React.createElement('span', { className: 'text-info' }, 
                          prlData.lecturers.filter(l => l.stream === stream).length
                        )
                      ),
                      React.createElement('div', { className: 'stat-item d-flex justify-content-between' },
                        React.createElement('span', { className: 'text-muted' }, 'Avg Rating:'),
                        React.createElement(StarRating, { rating: 4.6, size: 14, showNumber: true })
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  // Render Lecturers Module (Classes)
  const renderLecturersModule = () => {
    return React.createElement('div', null,
      React.createElement('div', { className: 'portal-card' },
        React.createElement('div', { className: 'portal-card-header d-flex justify-content-between align-items-center' },
          React.createElement('h5', { className: 'text-warning mb-0' }, '👨‍🏫 Lecturers Management'),
          React.createElement('div', { className: 'd-flex gap-2' },
            React.createElement('select', {
              className: 'form-select form-select-sm',
              value: selectedStream,
              onChange: (e) => setSelectedStream(e.target.value)
            },
              prlData.streams.map(stream =>
                React.createElement('option', { key: stream, value: stream }, stream)
              )
            ),
            React.createElement('input', {
              type: 'text',
              className: 'form-control form-control-sm',
              placeholder: 'Search lecturers...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              style: { width: '200px' }
            })
          )
        ),
        React.createElement('div', { className: 'card-body' },
          React.createElement('div', { className: 'row g-4' },
            filteredLecturers.map(lecturer =>
              React.createElement('div', { key: lecturer.id, className: 'col-md-6 col-lg-4' },
                React.createElement('div', { className: 'lecturer-card portal-card p-4 text-center' },
                  React.createElement('div', { className: 'lecturer-avatar mb-3' }, '👨‍🏫'),
                  React.createElement('h5', { className: 'text-light mb-2' }, lecturer.name),
                  React.createElement('p', { className: 'text-muted mb-3' }, lecturer.department),
                  React.createElement(StarRating, { rating: lecturer.avgRating, showNumber: true }),
                  React.createElement('div', { className: 'lecturer-stats mt-3' },
                    React.createElement('div', { className: 'row text-center' },
                      React.createElement('div', { className: 'col-4' },
                        React.createElement('div', { className: 'stat-value text-warning' }, lecturer.courses),
                        React.createElement('div', { className: 'stat-label text-muted' }, 'Courses')
                      ),
                      React.createElement('div', { className: 'col-4' },
                        React.createElement('div', { className: 'stat-value text-info' }, lecturer.totalStudents),
                        React.createElement('div', { className: 'stat-label text-muted' }, 'Students')
                      ),
                      React.createElement('div', { className: 'col-4' },
                        React.createElement(StatusBadge, { status: lecturer.status })
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  // Render Rating Module
  const renderRatingModule = () => {
    return React.createElement('div', { className: 'row g-4' },
      React.createElement('div', { className: 'col-12' },
        React.createElement('div', { className: 'portal-card' },
          React.createElement('div', { className: 'portal-card-header' },
            React.createElement('h5', { className: 'text-warning mb-0' }, '⭐ Overall Stream Ratings')
          ),
          React.createElement('div', { className: 'card-body' },
            React.createElement('div', { className: 'row g-4' },
              prlData.streams.map(stream =>
                React.createElement('div', { key: stream, className: 'col-md-6 col-lg-3' },
                  React.createElement('div', { className: 'rating-card text-center p-4 rounded' },
                    React.createElement('div', { className: 'stream-icon mb-3' }, '⭐'),
                    React.createElement('h4', { className: 'text-light mb-2' }, stream),
                    React.createElement(StarRating, { rating: 4.6, size: 20, showNumber: true }),
                    React.createElement('div', { className: 'rating-stats mt-3' },
                      React.createElement('div', { className: 'stat-item d-flex justify-content-between mb-2' },
                        React.createElement('span', { className: 'text-muted' }, 'Avg Rating:'),
                        React.createElement('span', { className: 'text-warning' }, '4.6/5.0')
                      ),
                      React.createElement('div', { className: 'stat-item d-flex justify-content-between' },
                        React.createElement('span', { className: 'text-muted' }, 'Total Reviews:'),
                        React.createElement('span', { className: 'text-info' }, '156')
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  // Main render
  return React.createElement('div', { className: 'prl-dashboard' },
    React.createElement('div', { className: 'container-fluid' },
      // Header
      React.createElement('div', { className: 'row mb-4' },
        React.createElement('div', { className: 'col-12' },
          React.createElement('div', { className: 'dashboard-header portal-card p-4' },
            React.createElement('div', { className: 'row align-items-center' },
              React.createElement('div', { className: 'col-md-6' },
                React.createElement('div', { className: 'd-flex align-items-center' },
                  React.createElement('div', { className: 'prl-avatar me-4' },
                    React.createElement('div', { 
                      className: 'avatar-display',
                      style: { 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }
                    }, prlData.avatar)
                  ),
                  React.createElement('div', null,
                    React.createElement('h1', { className: 'text-warning mb-1' }, `Welcome, ${prlData.name}!`),
                    React.createElement('p', { className: 'text-light mb-0 opacity-75' }, prlData.title),
                    React.createElement('div', { className: 'd-flex gap-3 mt-2' },
                      React.createElement('span', { className: 'badge bg-primary' }, `📚 ${prlData.stats.totalCourses} Courses`),
                      React.createElement('span', { className: 'badge bg-success' }, `👨‍🏫 ${prlData.stats.totalLecturers} Lecturers`),
                      React.createElement('span', { className: 'badge bg-warning' }, `⭐ ${prlData.stats.avgAttendance}% Avg Attendance`)
                    )
                  )
                )
              )
            )
          )
        )
      ),

      // Module Navigation
      React.createElement('div', { className: 'row mb-4' },
        React.createElement('div', { className: 'col-12' },
          React.createElement('div', { className: 'module-navigation portal-card p-3' },
            React.createElement('div', { className: 'module-tabs' },
              moduleTabs.map(module =>
                React.createElement('button', {
                  key: module.id,
                  className: `module-tab ${activeModule === module.id ? 'active' : ''}`,
                  onClick: () => setActiveModule(module.id)
                },
                  React.createElement('span', { className: 'module-icon' }, module.icon),
                  React.createElement('span', { className: 'module-name' }, module.name)
                )
              )
            )
          )
        )
      ),

      // Module Content
      React.createElement('div', { className: 'row' },
        React.createElement('div', { className: 'col-12' },
          activeModule === 'overview' && renderOverviewModule(),
          activeModule === 'courses' && renderCoursesModule(),
          activeModule === 'reports' && renderReportsModule(),
          activeModule === 'monitoring' && renderMonitoringModule(),
          activeModule === 'rating' && renderRatingModule(),
          activeModule === 'classes' && renderLecturersModule()
        )
      )
    ),

    // CSS Styles
    React.createElement('style', null, `
      .prl-dashboard {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        min-height: 100vh;
        color: #e2e8f0;
      }
      .dashboard-header {
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        border: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        border-radius: 16px;
      }
      .module-navigation {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
      }
      .module-tabs {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .module-tab {
        background: transparent;
        border: 1px solid transparent;
        border-radius: 12px;
        padding: 0.75rem 1.5rem;
        color: #9ca3af;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .module-tab:hover {
        background: rgba(255,255,255,0.1);
        color: #e5e7eb;
        transform: translateY(-2px);
      }
      .module-tab.active {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        border-color: #f59e0b;
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
      }
      .stat-card-primary {
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        border: 1px solid rgba(255,255,255,0.1);
        transition: all 0.3s ease;
      }
      .stat-card-primary:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      }
      .stat-icon {
        font-size: 2.5rem;
        opacity: 0.8;
      }
      .portal-card {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        backdrop-filter: blur(10px);
      }
      .portal-card-header {
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding: 1.5rem;
      }
      .stream-performance-card, .monitoring-card, .rating-card {
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        border: 1px solid rgba(255,255,255,0.1);
        transition: all 0.3s ease;
      }
      .stream-performance-card:hover, .monitoring-card:hover, .rating-card:hover {
        transform: translateY(-3px);
        border-color: rgba(245, 158, 11, 0.3);
      }
      .report-card, .lecturer-card, .course-card {
        transition: all 0.3s ease;
      }
      .report-card:hover, .lecturer-card:hover, .course-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      }
      .stream-icon {
        font-size: 2rem;
        opacity: 0.8;
      }
      .lecturer-avatar {
        font-size: 3rem;
        opacity: 0.8;
      }
      .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
      }
      .stat-label {
        font-size: 0.8rem;
      }
    `)
  );
}