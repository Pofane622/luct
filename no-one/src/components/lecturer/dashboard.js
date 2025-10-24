 // src/components/lecturer/Dashboard.js
import React, { useState } from 'react';

export default function LecturerDashboard() {
  const [activeModule, setActiveModule] = useState('overview');
  const [showReportForm, setShowReportForm] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);
  const [showClassManagement, setShowClassManagement] = useState(false);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [myRatings, setMyRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  // Fetch lecturer ratings
  React.useEffect(() => {
    const fetchMyRatings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch('http://localhost:5000/api/lecturer-ratings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMyRatings(data.ratings || []);
        } else {
          console.error('Failed to fetch lecturer ratings');
        }
      } catch (error) {
        console.error('Error fetching lecturer ratings:', error);
      } finally {
        setRatingsLoading(false);
      }
    };
    fetchMyRatings();
  }, []);

  // Complete Report form state with ALL required fields
  const [reportForm, setReportForm] = useState({
    facultyName: "Faculty of Information Communication Technology",
    className: "",
    weekOfReporting: "",
    dateOfLecture: "",
    courseName: "",
    courseCode: "",
    lecturerName: "",
    actualStudentsPresent: "",
    totalRegisteredStudents: "",
    venue: "",
    scheduledTime: "",
    topicTaught: "",
    learningOutcomes: "",
    recommendations: ""
  });

  // Class form state
  const [classForm, setClassForm] = useState({
    courseCode: "",
    className: "",
    schedule: "",
    venue: "",
    maxStudents: ""
  });

  // Mock data
  const lecturerData = {
    name: "",
    department: "Software Engineering",
    avatar: "👨‍🏫",
    stats: {
      totalStudents: 125,
      totalClasses: 8,
      attendanceRate: 94,
      satisfactionRate: 4.7
    },
    courses: [
      {
        id: 1,
        code: "ICT3101",
        name: "Web Development",
        students: 45,
        schedule: "Mon 2:00 PM, Wed 10:00 AM",
        venue: "Lab A",
        color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: "🌐",
        ratings: { 
          average: 4.7, 
          total: 38,
          distribution: { 5: 25, 4: 10, 3: 2, 2: 1, 1: 0 },
          reviews: [
            { student: "Sarah Student", rating: 5, comment: "Excellent explanations!", date: "2024-06-10" },
            { student: "John Doe", rating: 4, comment: "Good pace", date: "2024-06-09" }
          ]
        },
        recentAttendance: [42, 40, 38, 45, 41],
        assignments: [
          { name: "React Project", due: "2024-06-15", submissions: 38 },
          { name: "API Integration", due: "2024-06-22", submissions: 25 }
        ],
        studentList: [
          { id: 1, name: "Sarah Student", email: "sarah@student.luct.ac.ls", attendance: "95%", grade: "A" },
          { id: 2, name: "John Doe", email: "john@student.luct.ac.ls", attendance: "88%", grade: "B+" }
        ]
      },
      {
        id: 2,
        code: "ICT2202", 
        name: "Database Systems",
        students: 40,
        schedule: "Tue 10:00 AM, Thu 3:00 PM",
        venue: "Lab B",
        color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        icon: "🗄️",
        ratings: { 
          average: 4.5, 
          total: 32,
          distribution: { 5: 18, 4: 10, 3: 3, 2: 1, 1: 0 },
          reviews: [
            { student: "Mike Johnson", rating: 5, comment: "SQL explained clearly", date: "2024-06-09" },
            { student: "Emma Wilson", rating: 4, comment: "Good content", date: "2024-06-08" }
          ]
        },
        recentAttendance: [38, 35, 40, 37, 39],
        assignments: [
          { name: "SQL Queries", due: "2024-06-18", submissions: 32 },
          { name: "Database Design", due: "2024-06-25", submissions: 28 }
        ],
        studentList: [
          { id: 1, name: "Emma Wilson", email: "emma@student.luct.ac.ls", attendance: "90%", grade: "A-" },
          { id: 2, name: "David Brown", email: "david@student.luct.ac.ls", attendance: "85%", grade: "B+" }
        ]
      }
    ],
    recentReports: [
      { 
        id: 1, 
        course: "Web Development", 
        date: "2024-06-10", 
        studentsPresent: 42, 
        totalStudents: 45,
        status: "Submitted", 
        topic: "React Hooks",
        venue: "Lab A",
        time: "2:00 PM",
        learningOutcomes: "Students learned about useState, useEffect, and custom hooks",
        recommendations: "More practical examples needed"
      },
      { 
        id: 2, 
        course: "Database Systems", 
        date: "2024-06-09", 
        studentsPresent: 38, 
        totalStudents: 40,
        status: "Submitted", 
        topic: "SQL Joins",
        venue: "Lab B", 
        time: "10:00 AM",
        learningOutcomes: "Understanding of INNER JOIN, LEFT JOIN, and RIGHT JOIN",
        recommendations: "Students struggled with complex joins"
      }
    ],
    upcomingClasses: [
      { course: "Web Development", date: "2024-06-17", time: "2:00 PM", venue: "Lab A" },
      { course: "Database Systems", date: "2024-06-18", time: "10:00 AM", venue: "Lab B" }
    ]
  };

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Star Rating Component
  const StarRating = ({ rating = 0, size = 20, showNumber = false }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(React.createElement('span', {
        key: i,
        className: `star ${i <= rating ? 'filled' : ''}`,
        style: { 
          fontSize: `${size}px`, 
          color: i <= rating ? '#ffc107' : '#6c757d',
          marginRight: '2px'
        }
      }, i <= rating ? '★' : '☆'));
    }
    
    return React.createElement('div', { className: 'star-rating d-inline-flex align-items-center' },
      stars,
      showNumber && React.createElement('span', { 
        className: 'rating-number ms-2 text-warning fw-bold' 
      }, (rating || 0).toFixed(1))
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClassFormChange = (e) => {
    const { name, value } = e.target;
    setClassForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    console.log('Report submitted:', reportForm);
    alert('Report submitted successfully!');
    setShowReportForm(false);
    // Reset all form fields
    setReportForm({
      facultyName: "Faculty of Information Communication Technology",
      className: "",
      weekOfReporting: "",
      dateOfLecture: "",
      courseName: "",
      courseCode: "",
      lecturerName: "Dr. Thabo Moloi",
      actualStudentsPresent: "",
      totalRegisteredStudents: "",
      venue: "",
      scheduledTime: "",
      topicTaught: "",
      learningOutcomes: "",
      recommendations: ""
    });
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    console.log('New class added:', classForm);
    alert('Class added successfully!');
    setShowAddClass(false);
    setClassForm({
      courseCode: "", className: "", schedule: "", venue: "", maxStudents: ""
    });
  };

  const handleViewStudents = (course) => {
    setSelectedCourse(course);
    setShowStudentList(true);
  };

  const handleManageClass = (course) => {
    setSelectedCourse(course);
    setShowClassManagement(true);
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setShowReportForm(true);
    setReportForm({
      facultyName: "Faculty of Information Communication Technology",
      className: report.course,
      weekOfReporting: `Week ${getWeekNumber(new Date(report.date))}`,
      dateOfLecture: report.date,
      courseName: report.course,
      courseCode: report.course === "Web Development" ? "ICT3101" : "ICT2202",
      lecturerName: lecturerData.name,
      actualStudentsPresent: report.studentsPresent,
      totalRegisteredStudents: report.totalStudents,
      venue: report.venue,
      scheduledTime: report.time,
      topicTaught: report.topic,
      learningOutcomes: report.learningOutcomes,
      recommendations: report.recommendations
    });
  };

  const handleViewAnalytics = (course) => {
    setSelectedCourse(course);
    setShowAnalytics(true);
  };

  const handleUpdateSchedule = () => {
    const newSchedule = prompt("Enter new schedule:", selectedCourse?.schedule);
    if (newSchedule) {
      alert(`Schedule updated to: ${newSchedule}`);
    }
  };

  const handleChangeVenue = () => {
    const newVenue = prompt("Enter new venue:", selectedCourse?.venue);
    if (newVenue) {
      alert(`Venue changed to: ${newVenue}`);
    }
  };

  const handleViewStudentProfile = (student) => {
    alert(`Student Profile:\nName: ${student.name}\nEmail: ${student.email}\nAttendance: ${student.attendance}\nGrade: ${student.grade}`);
  };

  const handleEditGrade = (student) => {
    const newGrade = prompt(`Enter new grade for ${student.name}:`, student.grade);
    if (newGrade) {
      alert(`Grade updated to: ${newGrade}`);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Submitted': return 'warning';
      case 'Reviewed': return 'success';
      case 'Pending': return 'secondary';
      default: return 'secondary';
    }
  };

  // Module tabs configuration
  const moduleTabs = [
    { id: 'overview', name: '🏠 Overview', icon: '🏠' },
    { id: 'classes', name: '📚 Classes', icon: '📚' },
    { id: 'reports', name: '📋 Reports', icon: '📋' },
    { id: 'monitoring', name: '📈 Monitoring', icon: '📈' },
    { id: 'rating', name: '⭐ Rating', icon: '⭐' }
  ];

  // Helper function to create elements
  const createElement = (tag, props = {}, ...children) => {
    return React.createElement(tag, props, ...children);
  };

  // Modal component
  const Modal = ({ show, onClose, title, children, size = "modal-lg" }) => {
    if (!show) return null;

    return createElement('div', { className: 'modal-backdrop show d-block' },
      createElement('div', { className: `modal show d-block` },
        createElement('div', { className: `modal-dialog modal-dialog-centered ${size}` },
          createElement('div', { className: 'modal-content portal-card' },
            createElement('div', { className: 'modal-header border-secondary' },
              createElement('h5', { className: 'modal-title text-warning' }, title),
              createElement('button', { 
                type: 'button', 
                className: 'btn-close btn-close-white',
                onClick: onClose
              })
            ),
            createElement('div', { className: 'modal-body' }, children)
          )
        )
      )
    );
  };

  // COMPLETE Report Form Modal with ALL fields
  const renderReportFormModal = () => {
    if (!showReportForm) return null;

    return createElement('div', { className: 'modal-backdrop show d-block' },
      createElement('div', { className: 'modal show d-block', style: { maxWidth: '1400px' } },
        createElement('div', { className: 'modal-dialog modal-dialog-centered modal-xl' },
          createElement('div', { className: 'modal-content portal-card' },
            createElement('div', { className: 'modal-header border-secondary' },
              createElement('h5', { className: 'modal-title text-warning' }, 
                "📝 Submit New Lecture Report"
              ),
              createElement('button', { 
                type: 'button', 
                className: 'btn-close btn-close-white',
                onClick: () => setShowReportForm(false)
              })
            ),
            createElement('div', { className: 'modal-body' },
              createElement('form', { onSubmit: handleSubmitReport },
                createElement('div', { className: 'row g-3' },
                  // Row 1: Faculty Name & Class Name
                  createElement('div', { className: 'col-md-6' },
                    createElement('label', { className: 'form-label text-light' }, "🏛️ Faculty Name *"),
                    createElement('input', {
                      type: 'text',
                      className: 'form-control',
                      name: 'facultyName',
                      value: reportForm.facultyName,
                      onChange: handleInputChange,
                      required: true
                    })
                  ),
                  createElement('div', { className: 'col-md-6' },
                    createElement('label', { className: 'form-label text-light' }, "🏫 Class Name *"),
                    createElement('input', {
                      type: 'text',
                      className: 'form-control',
                      name: 'className',
                      value: reportForm.className,
                      onChange: handleInputChange,
                      placeholder: 'e.g., BIT-3A, BIT-2B',
                      required: true
                    })
                  ),

                  // Row 2: Week of Reporting & Date of Lecture
                  createElement('div', { className: 'col-md-6' },
                    createElement('label', { className: 'form-label text-light' }, "📅 Week of Reporting *"),
                    createElement('select', {
                      className: 'form-select',
                      name: 'weekOfReporting',
                      value: reportForm.weekOfReporting,
                      onChange: handleInputChange,
                      required: true
                    },
                      createElement('option', { value: '' }, "Select Week"),
                      createElement('option', { value: 'Week 1' }, "Week 1"),
                      createElement('option', { value: 'Week 2' }, "Week 2"),
                      createElement('option', { value: 'Week 3' }, "Week 3"),
                      createElement('option', { value: 'Week 4' }, "Week 4"),
                      createElement('option', { value: 'Week 5' }, "Week 5"),
                      createElement('option', { value: 'Week 6' }, "Week 6"),
                      createElement('option', { value: 'Week 7' }, "Week 7"),
                      createElement('option', { value: 'Week 8' }, "Week 8"),
                      createElement('option', { value: 'Week 9' }, "Week 9"),
                      createElement('option', { value: 'Week 10' }, "Week 10"),
                      createElement('option', { value: 'Week 11' }, "Week 11"),
                      createElement('option', { value: 'Week 12' }, "Week 12"),
                      createElement('option', { value: 'Week 13' }, "Week 13"),
                      createElement('option', { value: 'Week 14' }, "Week 14"),
                      createElement('option', { value: 'Week 15' }, "Week 15")
                    )
                  ),
                  createElement('div', { className: 'col-md-6' },
                    createElement('label', { className: 'form-label text-light' }, "📆 Date of Lecture *"),
                    createElement('input', {
                      type: 'date',
                      className: 'form-control',
                      name: 'dateOfLecture',
                      value: reportForm.dateOfLecture,
                      onChange: handleInputChange,
                      required: true
                    })
                  ),

                  // Row 3: Course Name & Course Code
                  createElement('div', { className: 'col-md-6' },
                    createElement('label', { className: 'form-label text-light' }, "📚 Course Name *"),
                    createElement('input', {
                      type: 'text',
                      className: 'form-control',
                      name: 'courseName',
                      value: reportForm.courseName,
                      onChange: handleInputChange,
                      placeholder: 'e.g., Web Development',
                      required: true
                    })
                  ),
                  createElement('div', { className: 'col-md-6' },
                    createElement('label', { className: 'form-label text-light' }, "🔢 Course Code *"),
                    createElement('select', {
                      className: 'form-select',
                      name: 'courseCode',
                      value: reportForm.courseCode,
                      onChange: handleInputChange,
                      required: true
                    },
                      createElement('option', { value: '' }, "Choose a course..."),
                      lecturerData.courses.map(course =>
                        createElement('option', { 
                          key: course.code, 
                          value: course.code 
                        }, `${course.code} - ${course.name}`)
                      )
                    )
                  ),

                  // Row 4: Lecturer's Name
                  createElement('div', { className: 'col-12' },
                    createElement('label', { className: 'form-label text-light' }, "👨‍🏫 Lecturer's Name *"),
                    createElement('input', {
                      type: 'text',
                      className: 'form-control',
                      name: 'lecturerName',
                      value: reportForm.lecturerName,
                      onChange: handleInputChange,
                      required: true
                    })
                  ),

                  // Row 5: Students Present & Total Students
                  createElement('div', { className: 'col-md-6' },
                    createElement('label', { className: 'form-label text-light' }, "👥 Actual Number of Students Present *"),
                    createElement('input', {
                      type: 'number',
                      className: 'form-control',
                      name: 'actualStudentsPresent',
                      value: reportForm.actualStudentsPresent,
                      onChange: handleInputChange,
                      placeholder: '0',
                      min: '0',
                      required: true
                    })
                  ),
                  createElement('div', { className: 'col-md-6' },
                    createElement('label', { className: 'form-label text-light' }, "📊 Total Number of Registered Students *"),
                    createElement('input', {
                      type: 'number',
                      className: 'form-control',
                      name: 'totalRegisteredStudents',
                      value: reportForm.totalRegisteredStudents,
                      onChange: handleInputChange,
                      placeholder: '0',
                      min: '0',
                      required: true
                    })
                  ),

                  // Row 6: Venue & Scheduled Time
                  createElement('div', { className: 'col-md-6' },
                    createElement('label', { className: 'form-label text-light' }, "🏢 Venue of the Class *"),
                    createElement('input', {
                      type: 'text',
                      className: 'form-control',
                      name: 'venue',
                      value: reportForm.venue,
                      onChange: handleInputChange,
                      placeholder: 'e.g., Lab A, Room 101',
                      required: true
                    })
                  ),
                  createElement('div', { className: 'col-md-6' },
                    createElement('label', { className: 'form-label text-light' }, "⏰ Scheduled Lecture Time *"),
                    createElement('input', {
                      type: 'time',
                      className: 'form-control',
                      name: 'scheduledTime',
                      value: reportForm.scheduledTime,
                      onChange: handleInputChange,
                      required: true
                    })
                  ),

                  // Row 7: Topic Taught
                  createElement('div', { className: 'col-12' },
                    createElement('label', { className: 'form-label text-light' }, "🎯 Topic Taught *"),
                    createElement('textarea', {
                      className: 'form-control',
                      rows: '3',
                      name: 'topicTaught',
                      value: reportForm.topicTaught,
                      onChange: handleInputChange,
                      placeholder: 'Describe the main topic covered in this lecture...',
                      required: true
                    })
                  ),

                  // Row 8: Learning Outcomes
                  createElement('div', { className: 'col-12' },
                    createElement('label', { className: 'form-label text-light' }, "📖 Learning Outcomes of the Topic *"),
                    createElement('textarea', {
                      className: 'form-control',
                      rows: '4',
                      name: 'learningOutcomes',
                      value: reportForm.learningOutcomes,
                      onChange: handleInputChange,
                      placeholder: 'List the specific learning outcomes students achieved...',
                      required: true
                    })
                  ),

                  // Row 9: Recommendations
                  createElement('div', { className: 'col-12' },
                    createElement('label', { className: 'form-label text-light' }, "💡 Lecturer's Recommendations *"),
                    createElement('textarea', {
                      className: 'form-control',
                      rows: '4',
                      name: 'recommendations',
                      value: reportForm.recommendations,
                      onChange: handleInputChange,
                      placeholder: 'Provide recommendations for improvement, student support, or future lectures...',
                      required: true
                    })
                  )
                ),
                createElement('div', { className: 'modal-footer border-secondary mt-4' },
                  createElement('button', { 
                    type: 'button', 
                    className: 'btn btn-portal-secondary',
                    onClick: () => setShowReportForm(false)
                  }, "❌ Cancel"),
                  createElement('button', { 
                    type: 'submit', 
                    className: 'btn btn-portal-primary btn-glow'
                  }, "📤 Submit Lecture Report")
                )
              )
            )
          )
        )
      )
    );
  };

  // Student List Modal
  const renderStudentListModal = () => {
    if (!selectedCourse) return null;
    
    return React.createElement(Modal, {
      show: showStudentList,
      onClose: () => setShowStudentList(false),
      title: `👥 Students - ${selectedCourse.name}`,
      size: "modal-xl"
    },
      createElement('div', { className: 'table-responsive' },
        createElement('table', { className: 'table table-dark table-hover' },
          createElement('thead', null,
            createElement('tr', null,
              createElement('th', null, "Name"),
              createElement('th', null, "Email"),
              createElement('th', null, "Attendance"),
              createElement('th', null, "Grade"),
              createElement('th', null, "Actions")
            )
          ),
          createElement('tbody', null,
            selectedCourse.studentList.map((student) =>
              createElement('tr', { key: student.id },
                createElement('td', { className: 'text-light' }, student.name),
                createElement('td', { className: 'text-light' }, student.email),
                createElement('td', null,
                  createElement('span', { 
                    className: `badge ${
                      parseInt(student.attendance) >= 90 ? 'bg-success' : 
                      parseInt(student.attendance) >= 80 ? 'bg-warning' : 'bg-danger'
                    }` 
                  }, student.attendance)
                ),
                createElement('td', { className: 'text-light' }, student.grade),
                createElement('td', null,
                  createElement('div', { className: 'btn-group btn-group-sm' },
                    createElement('button', { 
                      className: 'btn btn-outline-info',
                      onClick: () => handleViewStudentProfile(student)
                    }, "👁️ Profile"),
                    createElement('button', { 
                      className: 'btn btn-outline-warning',
                      onClick: () => handleEditGrade(student)
                    }, "📝 Grade")
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  // Class Management Modal
  const renderClassManagementModal = () => {
    if (!selectedCourse) return null;
    
    return React.createElement(Modal, {
      show: showClassManagement,
      onClose: () => setShowClassManagement(false),
      title: `⚙️ Manage Class - ${selectedCourse.name}`,
      size: "modal-lg"
    },
      createElement('div', { className: 'row g-4' },
        createElement('div', { className: 'col-md-6' },
          createElement('div', { className: 'form-section p-4 rounded' },
            createElement('h6', { className: 'text-warning mb-3' }, "📅 Class Schedule"),
            createElement('div', { className: 'mb-3' },
              createElement('label', { className: 'form-label text-light' }, "Current Schedule"),
              createElement('p', { className: 'text-light' }, selectedCourse.schedule)
            ),
            createElement('button', { 
              className: 'btn btn-portal-primary w-100',
              onClick: handleUpdateSchedule
            }, "✏️ Update Schedule")
          )
        ),
        createElement('div', { className: 'col-md-6' },
          createElement('div', { className: 'form-section p-4 rounded' },
            createElement('h6', { className: 'text-warning mb-3' }, "🏢 Venue Management"),
            createElement('div', { className: 'mb-3' },
              createElement('label', { className: 'form-label text-light' }, "Current Venue"),
              createElement('p', { className: 'text-light' }, selectedCourse.venue)
            ),
            createElement('button', { 
              className: 'btn btn-portal-primary w-100',
              onClick: handleChangeVenue
            }, "📍 Change Venue")
          )
        )
      )
    );
  };

  // Report Details Modal
  const renderReportDetailsModal = () => {
    if (!selectedReport) return null;

    return React.createElement(Modal, {
      show: showReportDetails,
      onClose: () => setShowReportDetails(false),
      title: `📋 Report Details - ${selectedReport.course}`,
      size: "modal-lg"
    },
      createElement('div', { className: 'row g-4' },
        createElement('div', { className: 'col-md-6' },
          createElement('div', { className: 'form-section p-4 rounded' },
            createElement('h6', { className: 'text-warning mb-3' }, "📅 Lecture Information"),
            createElement('div', { className: 'mb-2' },
              createElement('strong', { className: 'text-light' }, "Date: "),
              createElement('span', { className: 'text-light' }, 
                new Date(selectedReport.date).toLocaleDateString()
              )
            ),
            createElement('div', { className: 'mb-2' },
              createElement('strong', { className: 'text-light' }, "Time: "),
              createElement('span', { className: 'text-light' }, selectedReport.time)
            ),
            createElement('div', { className: 'mb-2' },
              createElement('strong', { className: 'text-light' }, "Venue: "),
              createElement('span', { className: 'text-light' }, selectedReport.venue)
            ),
            createElement('div', { className: 'mb-2' },
              createElement('strong', { className: 'text-light' }, "Topic: "),
              createElement('span', { className: 'text-light' }, selectedReport.topic)
            )
          )
        ),
        createElement('div', { className: 'col-md-6' },
          createElement('div', { className: 'form-section p-4 rounded' },
            createElement('h6', { className: 'text-warning mb-3' }, "👥 Attendance"),
            createElement('div', { className: 'mb-2' },
              createElement('strong', { className: 'text-light' }, "Present: "),
              createElement('span', { className: 'text-warning fw-bold' }, selectedReport.studentsPresent)
            ),
            createElement('div', { className: 'mb-2' },
              createElement('strong', { className: 'text-light' }, "Total: "),
              createElement('span', { className: 'text-light' }, selectedReport.totalStudents)
            ),
            createElement('div', { className: 'mb-2' },
              createElement('strong', { className: 'text-light' }, "Percentage: "),
              createElement('span', { className: 'text-light' }, 
                `${Math.round((selectedReport.studentsPresent / selectedReport.totalStudents) * 100)}%`
              )
            )
          )
        ),
        createElement('div', { className: 'col-12' },
          createElement('div', { className: 'form-section p-4 rounded' },
            createElement('h6', { className: 'text-warning mb-3' }, "🎯 Learning Outcomes"),
            createElement('p', { className: 'text-light' }, selectedReport.learningOutcomes)
          )
        ),
        createElement('div', { className: 'col-12' },
          createElement('div', { className: 'form-section p-4 rounded' },
            createElement('h6', { className: 'text-warning mb-3' }, "💡 Recommendations"),
            createElement('p', { className: 'text-light' }, selectedReport.recommendations)
          )
        )
      )
    );
  };

  // Add Class Modal
  const renderAddClassModal = () => {
    return React.createElement(Modal, {
      show: showAddClass,
      onClose: () => setShowAddClass(false),
      title: "➕ Add New Class",
      size: "modal-lg"
    },
      createElement('form', { onSubmit: handleAddClass },
        createElement('div', { className: 'row g-3' },
          createElement('div', { className: 'col-md-6' },
            createElement('label', { className: 'form-label text-light' }, "📚 Course Code *"),
            createElement('input', {
              type: 'text',
              className: 'form-control',
              name: 'courseCode',
              value: classForm.courseCode,
              onChange: handleClassFormChange,
              placeholder: 'e.g., ICT3101',
              required: true
            })
          ),
          createElement('div', { className: 'col-md-6' },
            createElement('label', { className: 'form-label text-light' }, "🏫 Class Name *"),
            createElement('input', {
              type: 'text',
              className: 'form-control',
              name: 'className',
              value: classForm.className,
              onChange: handleClassFormChange,
              placeholder: 'e.g., BIT-3A, BIT-2B',
              required: true
            })
          ),
          createElement('div', { className: 'col-md-6' },
            createElement('label', { className: 'form-label text-light' }, "📅 Schedule *"),
            createElement('input', {
              type: 'text',
              className: 'form-control',
              name: 'schedule',
              value: classForm.schedule,
              onChange: handleClassFormChange,
              placeholder: 'e.g., Mon 2:00 PM, Wed 10:00 AM',
              required: true
            })
          ),
          createElement('div', { className: 'col-md-6' },
            createElement('label', { className: 'form-label text-light' }, "🏢 Venue *"),
            createElement('input', {
              type: 'text',
              className: 'form-control',
              name: 'venue',
              value: classForm.venue,
              onChange: handleClassFormChange,
              placeholder: 'e.g., Lab A, Room 101',
              required: true
            })
          )
        ),
        createElement('div', { className: 'modal-footer border-secondary mt-4' },
          createElement('button', { 
            type: 'button', 
            className: 'btn btn-portal-secondary',
            onClick: () => setShowAddClass(false)
          }, "❌ Cancel"),
          createElement('button', { 
            type: 'submit', 
            className: 'btn btn-portal-primary btn-glow'
          }, "💾 Create Class")
        )
      )
    );
  };

  // Analytics Modal
  const renderAnalyticsModal = () => {
    if (!selectedCourse) return null;
    
    const avgAttendance = selectedCourse.recentAttendance && selectedCourse.recentAttendance.length > 0 
      ? Math.round(selectedCourse.recentAttendance.reduce((a, b) => a + b, 0) / selectedCourse.recentAttendance.length)
      : 0;
    
    const rating = selectedCourse.ratings ? selectedCourse.ratings.average : 0;
    const totalRatings = selectedCourse.ratings ? selectedCourse.ratings.total : 0;

    return React.createElement(Modal, {
      show: showAnalytics,
      onClose: () => setShowAnalytics(false),
      title: `📈 Detailed Analytics - ${selectedCourse.name}`,
      size: "modal-lg"
    },
      createElement('div', { className: 'row g-4' },
        createElement('div', { className: 'col-md-6' },
          createElement('div', { className: 'form-section p-4 rounded' },
            createElement('h6', { className: 'text-warning mb-3' }, "📊 Attendance Trends"),
            createElement('div', { className: 'text-center p-4' },
              createElement('h1', { className: 'text-warning' }, avgAttendance),
              createElement('p', { className: 'text-light' }, "Average Attendance")
            )
          )
        ),
        createElement('div', { className: 'col-md-6' },
          createElement('div', { className: 'form-section p-4 rounded' },
            createElement('h6', { className: 'text-warning mb-3' }, "⭐ Student Ratings"),
            createElement('div', { className: 'text-center p-4' },
              StarRating({ rating: rating, size: 24, showNumber: true }),
              createElement('p', { className: 'text-light mt-2' }, 
                `Based on ${totalRatings} ratings`
              )
            )
          )
        )
      )
    );
  };

  // Render Classes Module
  const renderClassesModule = () => {
    return createElement('div', { className: 'portal-card' },
      createElement('div', { className: 'portal-card-header d-flex justify-content-between align-items-center' },
        createElement('h5', { className: 'text-warning mb-0' }, "📚 My Classes & Courses"),
        createElement('button', { 
          className: 'btn btn-portal-primary btn-sm',
          onClick: () => setShowAddClass(true)
        }, "+ Add New Class")
      ),
      createElement('div', { className: 'card-body' },
        createElement('div', { className: 'row g-4' },
          lecturerData.courses.map((course) =>
            createElement('div', { key: course.id, className: 'col-lg-6 col-xl-4' },
              createElement('div', { className: 'class-card portal-card p-4 h-100' },
                createElement('div', { className: 'class-header d-flex justify-content-between align-items-start mb-3' },
                  createElement('div', null,
                    createElement('span', { 
                      className: 'class-icon', 
                      style: { fontSize: '2.5rem' } 
                    }, course.icon),
                    createElement('h6', { className: 'text-warning mb-1 mt-2' }, course.code),
                    createElement('h5', { className: 'text-light' }, course.name)
                  ),
                  createElement('span', { className: 'badge bg-success' }, `${course.students} Students`)
                ),
                createElement('div', { className: 'class-details mb-3' },
                  createElement('div', { className: 'detail-item d-flex justify-content-between mb-2' },
                    createElement('small', { className: 'text-muted' }, "📅 Schedule"),
                    createElement('small', { className: 'text-light text-end', style: { maxWidth: '150px' } }, course.schedule)
                  ),
                  createElement('div', { className: 'detail-item d-flex justify-content-between mb-2' },
                    createElement('small', { className: 'text-muted' }, "🏢 Venue"),
                    createElement('small', { className: 'text-light' }, course.venue)
                  ),
                  createElement('div', { className: 'detail-item d-flex justify-content-between' },
                    createElement('small', { className: 'text-muted' }, "⭐ Rating"),
                    StarRating({ rating: course.ratings.average, size: 14, showNumber: true })
                  )
                ),
                createElement('div', { className: 'class-actions' },
                  createElement('div', { className: 'row g-2' },
                    createElement('div', { className: 'col-6' },
                      createElement('button', { 
                        className: 'btn btn-portal-primary btn-sm w-100',
                        onClick: () => handleViewStudents(course)
                      }, "👥 View Students")
                    ),
                    createElement('div', { className: 'col-6' },
                      createElement('button', { 
                        className: 'btn btn-portal-secondary btn-sm w-100',
                        onClick: () => handleManageClass(course)
                      }, "⚙️ Manage")
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

  // Render Reports Module
  const renderReportsModule = () => {
    return createElement('div', { className: 'row g-4' },
      createElement('div', { className: 'col-lg-8' },
        createElement('div', { className: 'portal-card' },
          createElement('div', { className: 'portal-card-header d-flex justify-content-between align-items-center' },
            createElement('h5', { className: 'text-warning mb-0' }, "📋 Lecture Reports"),
            createElement('button', { 
              className: 'btn btn-portal-primary',
              onClick: () => setShowReportForm(true)
            }, "+ New Report")
          ),
          createElement('div', { className: 'card-body' },
            createElement('div', { className: 'table-responsive' },
              createElement('table', { className: 'table table-dark table-hover' },
                createElement('thead', null,
                  createElement('tr', null,
                    createElement('th', null, "📚 Course"),
                    createElement('th', null, "📅 Date"),
                    createElement('th', null, "🎯 Topic"),
                    createElement('th', null, "👥 Attendance"),
                    createElement('th', null, "📊 Status"),
                    createElement('th', null, "⚡ Actions")
                  )
                ),
                createElement('tbody', null,
                  lecturerData.recentReports.map((report) =>
                    createElement('tr', { key: report.id },
                      createElement('td', null, report.course),
                      createElement('td', { className: 'text-light' }, 
                        new Date(report.date).toLocaleDateString()
                      ),
                      createElement('td', null, report.topic),
                      createElement('td', null,
                        createElement('div', { className: 'attendance-display' },
                          createElement('strong', { className: 'text-warning' }, report.studentsPresent),
                          createElement('small', { className: 'text-muted' }, `/${report.totalStudents}`)
                        )
                      ),
                      createElement('td', null,
                        createElement('span', { 
                          className: `badge bg-${getStatusColor(report.status)}` 
                        }, report.status)
                      ),
                      createElement('td', null,
                        createElement('div', { className: 'btn-group btn-group-sm' },
                          createElement('button', { 
                            className: 'btn btn-outline-warning',
                            onClick: () => handleViewReport(report)
                          }, "👁️ View"),
                          createElement('button', { 
                            className: 'btn btn-outline-info',
                            onClick: () => handleEditReport(report)
                          }, "✏️ Edit")
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      ),
      createElement('div', { className: 'col-lg-4' },
        createElement('div', { className: 'portal-card h-100' },
          createElement('div', { className: 'portal-card-header' },
            createElement('h5', { className: 'text-warning mb-0' }, "📈 Reports Analytics")
          ),
          createElement('div', { className: 'card-body' },
            createElement('div', { className: 'analytics-stats' },
              createElement('div', { className: 'stat-item text-center p-3 mb-3 border-bottom border-secondary' },
                createElement('h3', { className: 'text-warning mb-1' }, lecturerData.recentReports.length),
                createElement('small', { className: 'text-light' }, "📊 Total Reports")
              ),
              createElement('div', { className: 'stat-item text-center p-3 mb-3 border-bottom border-secondary' },
                createElement('h3', { className: 'text-success mb-1' },
                  lecturerData.recentReports.filter(r => r.status === 'Reviewed').length
                ),
                createElement('small', { className: 'text-light' }, "✅ Reviewed")
              ),
              createElement('div', { className: 'stat-item text-center p-3' },
                createElement('h3', { className: 'text-warning mb-1' },
                  Math.round(lecturerData.recentReports.reduce((acc, report) => acc + report.studentsPresent, 0) / lecturerData.recentReports.length)
                ),
                createElement('small', { className: 'text-light' }, "👥 Avg Attendance")
              )
            )
          )
        )
      )
    );
  };

  // Render Monitoring Module
  const renderMonitoringModule = () => {
    return createElement('div', { className: 'row g-4' },
      createElement('div', { className: 'col-12' },
        createElement('div', { className: 'portal-card' },
          createElement('div', { className: 'portal-card-header' },
            createElement('h5', { className: 'text-warning mb-0' }, "📈 Student Monitoring")
          ),
          createElement('div', { className: 'card-body' },
            createElement('div', { className: 'row g-4' },
              lecturerData.courses.map((course) =>
                createElement('div', { key: course.id, className: 'col-md-6 col-lg-4' },
                  createElement('div', { className: 'monitoring-card portal-card p-4' },
                    createElement('div', { className: 'monitoring-header d-flex justify-content-between align-items-center mb-3' },
                      createElement('h6', { className: 'text-warning mb-0' }, course.name),
                      createElement('span', { className: 'badge bg-info' }, `👥 ${course.students} Students`)
                    ),
                    createElement('div', { className: 'class-details mb-3' },
                      createElement('div', { className: 'detail-item d-flex justify-content-between mb-2' },
                        createElement('small', { className: 'text-muted' }, "📊 Avg Attendance"),
                        createElement('small', { className: 'text-light' }, 
                          `${Math.round(course.recentAttendance.reduce((a, b) => a + b, 0) / course.recentAttendance.length)}`
                        )
                      ),
                      createElement('div', { className: 'detail-item d-flex justify-content-between' },
                        createElement('small', { className: 'text-muted' }, "⭐ Rating"),
                        StarRating({ rating: course.ratings.average, size: 14, showNumber: true })
                      )
                    ),
                    createElement('button', { 
                      className: 'btn btn-portal-primary btn-sm w-100',
                      onClick: () => handleViewAnalytics(course)
                    }, "📈 View Detailed Analytics")
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  // Render Overview Module
  const renderOverviewModule = () => {
    return createElement('div', { className: 'row g-4' },
      createElement('div', { className: 'col-lg-4' },
        createElement('div', { className: 'portal-card h-100' },
          createElement('div', { className: 'portal-card-header' },
            createElement('h5', { className: 'text-warning mb-0' }, "🕒 Today's Schedule")
          ),
          createElement('div', { className: 'card-body' },
            lecturerData.upcomingClasses.slice(0, 3).map((classItem, index) =>
              createElement('div', { key: index, className: 'schedule-item mb-3 p-3 border-bottom border-secondary' },
                createElement('div', { className: 'd-flex justify-content-between align-items-start' },
                  createElement('div', null,
                    createElement('h6', { className: 'text-light mb-1' }, classItem.course),
                    createElement('small', { className: 'text-muted' }, classItem.venue)
                  ),
                  createElement('div', { className: 'text-end' },
                    createElement('div', { className: 'text-warning fw-bold' }, classItem.time),
                    createElement('small', { className: 'text-muted' }, classItem.date)
                  )
                )
              )
            )
          )
        )
      ),
      createElement('div', { className: 'col-lg-8' },
        createElement('div', { className: 'portal-card h-100' },
          createElement('div', { className: 'portal-card-header' },
            createElement('h5', { className: 'text-warning mb-0' }, "📊 Quick Stats")
          ),
          createElement('div', { className: 'card-body' },
            createElement('div', { className: 'row text-center' },
              createElement('div', { className: 'col-md-3' },
                createElement('h3', { className: 'text-warning' }, lecturerData.courses.length),
                createElement('small', { className: 'text-light' }, "Courses")
              ),
              createElement('div', { className: 'col-md-3' },
                createElement('h3', { className: 'text-warning' }, lecturerData.stats.totalStudents),
                createElement('small', { className: 'text-light' }, "Students")
              ),
              createElement('div', { className: 'col-md-3' },
                createElement('h3', { className: 'text-warning' }, lecturerData.recentReports.length),
                createElement('small', { className: 'text-light' }, "Reports")
              ),
              createElement('div', { className: 'col-md-3' },
                createElement('h3', { className: 'text-warning' }, "4.7"),
                createElement('small', { className: 'text-light' }, "Rating")
              )
            )
          )
        )
      )
    );
  };

  // Render Rating Module
  const renderRatingModule = () => {
    if (ratingsLoading) {
      return createElement('div', { className: 'text-center p-5' },
        createElement('div', { className: 'spinner-border text-warning', role: 'status' }),
        createElement('p', { className: 'text-light mt-3' }, 'Loading ratings...')
      );
    }

    const totalRatings = myRatings.length;
    const averageRating = totalRatings > 0 ? (myRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1) : 0;

    return createElement('div', { className: 'row g-4' },
      createElement('div', { className: 'col-lg-4' },
        createElement('div', { className: 'portal-card h-100' },
          createElement('div', { className: 'portal-card-header' },
            createElement('h5', { className: 'text-warning mb-0' }, "⭐ Overall Rating")
          ),
          createElement('div', { className: 'card-body text-center' },
            createElement('div', { className: 'overall-rating mb-4' },
              createElement('div', { className: 'rating-circle mx-auto mb-3' },
                createElement('h1', { className: 'text-warning mb-0' }, averageRating),
                StarRating({ rating: parseFloat(averageRating), size: 24 })
              ),
              createElement('p', { className: 'text-light mb-0' },
                `Based on ${totalRatings} student ratings`
              )
            )
          )
        )
      ),
      createElement('div', { className: 'col-lg-8' },
        createElement('div', { className: 'portal-card h-100' },
          createElement('div', { className: 'portal-card-header' },
            createElement('h5', { className: 'text-warning mb-0' }, "💬 Student Feedback")
          ),
          createElement('div', { className: 'card-body' },
            createElement('div', {
              className: 'reviews-container',
              style: { maxHeight: '500px', overflowY: 'auto' }
            },
              totalRatings > 0 ? myRatings.map((review, index) =>
                createElement('div', {
                  key: index,
                  className: 'review-card mb-3 p-3 border-bottom border-secondary'
                },
                  createElement('div', { className: 'd-flex justify-content-between align-items-start mb-2' },
                    createElement('div', null,
                      createElement('strong', { className: 'text-light' }, review.student || 'Anonymous'),
                      createElement('small', { className: 'text-muted d-block' }, review.course || 'General')
                    ),
                    createElement('div', { className: 'text-end' },
                      StarRating({ rating: review.rating, size: 16 }),
                      createElement('small', { className: 'text-muted d-block' },
                        new Date(review.date).toLocaleDateString()
                      )
                    )
                  ),
                  createElement('p', { className: 'text-light mb-0 small' }, review.comment)
                )
              ) : createElement('p', { className: 'text-light text-center' }, 'No ratings available yet.')
            )
          )
        )
      )
    );
  };

  // Main render function
  return createElement('div', { className: 'lecturer-dashboard' },
    createElement('div', { className: 'container-fluid' },
      // Header
      createElement('div', { className: 'row mb-4' },
        createElement('div', { className: 'col-12' },
          createElement('div', { className: 'dashboard-header portal-card p-4' },
            createElement('div', { className: 'row align-items-center' },
              createElement('div', { className: 'col-md-6' },
                createElement('div', { className: 'd-flex align-items-center' },
                  createElement('div', { className: 'lecturer-avatar me-4' },
                    createElement('div', { 
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
                    }, lecturerData.avatar)
                  ),
                  createElement('div', null,
                    createElement('h1', { className: 'text-warning mb-1' }, 
                      `Welcome back, ${lecturerData.name}!`
                    ),
                    createElement('p', { className: 'text-light mb-0 opacity-75' },
                      `${lecturerData.department} • Lecturer Dashboard`
                    )
                  )
                )
              )
            )
          )
        )
      ),

      // Module Navigation
      createElement('div', { className: 'row mb-4' },
        createElement('div', { className: 'col-12' },
          createElement('div', { className: 'module-navigation portal-card p-3' },
            createElement('div', { className: 'd-flex justify-content-between align-items-center' },
              createElement('div', { className: 'module-tabs' },
                moduleTabs.map(module =>
                  createElement('button', {
                    key: module.id,
                    className: `module-tab ${activeModule === module.id ? 'active' : ''}`,
                    onClick: () => setActiveModule(module.id)
                  },
                    createElement('span', { className: 'module-icon' }, module.icon),
                    createElement('span', { className: 'module-name' }, module.name)
                  )
                )
              ),
              createElement('div', { className: 'quick-actions' },
                createElement('button', { 
                  className: 'btn btn-portal-primary btn-glow',
                  onClick: () => setShowReportForm(true)
                }, "📝 Submit New Report")
              )
            )
          )
        )
      ),

      // Module Content
      createElement('div', { className: 'row' },
        createElement('div', { className: 'col-12' },
          activeModule === 'overview' && renderOverviewModule(),
          activeModule === 'classes' && renderClassesModule(),
          activeModule === 'reports' && renderReportsModule(),
          activeModule === 'monitoring' && renderMonitoringModule(),
          activeModule === 'rating' && renderRatingModule()
        )
      )
    ),

    // All Modals
    renderReportFormModal(),
    renderStudentListModal(),
    renderClassManagementModal(),
    renderReportDetailsModal(),
    renderAddClassModal(),
    renderAnalyticsModal(),

    // CSS Styles
    createElement('style', null, `
      .lecturer-dashboard {
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
      .btn-portal-primary {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        border: none;
        color: white;
      }
      .btn-portal-secondary {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: #e5e7eb;
      }
      .class-card, .monitoring-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .class-card:hover, .monitoring-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      }
      .modal-backdrop {
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
      }
      .form-section {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
      }
      .rating-circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(245, 158, 11, 0.3);
      }
    `)
  );
}