// src/components/pl/Dashboard.js
import React, { useState, useEffect } from 'react';

export default function ProgramLeaderDashboard() {
  const [activeModule, setActiveModule] = useState('overview');
  const [selectedProgram, setSelectedProgram] = useState('Software Engineering');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAssignLecturerModal, setShowAssignLecturerModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [courseToAssign, setCourseToAssign] = useState(null);
  const [realTimeRatings, setRealTimeRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  // Fetch ratings from backend
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5001/api/student-ratings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRealTimeRatings(data.ratings || []);
        } else {
          console.error('Failed to fetch ratings');
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setRatingsLoading(false);
      }
    };

    fetchRatings();
  }, []);

  // Calculate rating statistics
  const ratingStats = React.useMemo(() => {
    if (realTimeRatings.length === 0) {
      return {
        averageRating: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const total = realTimeRatings.length;
    const sum = realTimeRatings.reduce((acc, rating) => acc + rating.rating, 0);
    const averageRating = (sum / total).toFixed(1);

    const distribution = realTimeRatings.reduce((acc, rating) => {
      acc[rating.rating] = (acc[rating.rating] || 0) + 1;
      return acc;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

    return { averageRating: parseFloat(averageRating), distribution };
  }, [realTimeRatings]);

  // State for dynamic data - now fetched from API
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [lecturersLoading, setLecturersLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  const [lecturersError, setLecturersError] = useState(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setCoursesError('No authentication token found');
          return;
        }

        const response = await fetch('http://localhost:5001/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Transform API data to match frontend expectations
          const transformedCourses = data.courses.map(course => ({
            id: course.id,
            code: course.code,
            name: course.name,
            credits: course.credits,
            level: course.level,
            semester: course.semester,
            status: course.status,
            assignedLecturer: course.assigned_lecturer_name || null,
            studentsEnrolled: course.students_enrolled || 0,
            rating: parseFloat(course.rating) || 0,
            color: course.color || "linear-gradient(135deg, #" + Math.floor(Math.random()*16777215).toString(16) + " 0%, #" + Math.floor(Math.random()*16777215).toString(16) + " 100%)",
            modules: course.modules || [],
            prerequisites: course.prerequisites || []
          }));
          setCourses(transformedCourses);
          setCoursesError(null);
        } else {
          const errorData = await response.json();
          setCoursesError(errorData.error || 'Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCoursesError('Network error while fetching courses');
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch lecturers from API
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLecturersLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setLecturersError('No authentication token found');
          return;
        }

        const response = await fetch('http://localhost:5000/api/lecturers', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Transform API data to match frontend expectations
          const transformedLecturers = data.lecturers.map(lecturer => ({
            id: lecturer.id,
            name: lecturer.name,
            email: lecturer.email,
            specialization: lecturer.specialization,
            status: lecturer.status,
            coursesAssigned: lecturer.courses_assigned || 0,
            totalStudents: lecturer.total_students || 0,
            rating: parseFloat(lecturer.rating) || 0,
            workload: lecturer.workload || '0%',
            availability: lecturer.availability,
            joinDate: lecturer.join_date
          }));
          setLecturers(transformedLecturers);
          setLecturersError(null);
        } else {
          const errorData = await response.json();
          setLecturersError(errorData.error || 'Failed to fetch lecturers');
        }
      } catch (error) {
        console.error('Error fetching lecturers:', error);
        setLecturersError('Network error while fetching lecturers');
      } finally {
        setLecturersLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  const [reports, setReports] = useState([
    {
      id: 1,
      program: "Software Engineering",
      courseName: "Advanced Software Engineering",
      courseCode: "SE3101",
      lecturer: "Dr. Thabo Moloi",
      prlReviewer: "Prof. Sarah Johnson",
      reviewDate: "2024-06-12",
      status: "Approved",
      rating: 4.7,
      feedback: "Excellent course structure and delivery. Students showed strong engagement.",
      recommendations: "Consider incorporating more industry case studies",
      studentFeedback: "Very practical and relevant to current industry needs"
    }
  ]);

  // Form States
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    credits: '',
    level: '',
    semester: '',
    modules: '',
    prerequisites: ''
  });

  const [assignmentForm, setAssignmentForm] = useState({
    courseId: '',
    lecturerId: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  // Static data
  const plData = {
    name: "Dr. Michael Chen",
    title: "Program Leader - Software Engineering",
    avatar: "👨‍💼",
    programs: ["Software Engineering", "Computer Science", "Data Science", "Cybersecurity"],
    stats: {
      totalCourses: 48,
      totalLecturers: 32,
      activeStudents: 1250,
      programRating: 4.8,
      pendingApprovals: 8,
      completedReviews: 245
    },
    programPerformance: {
      enrollmentTrend: [1200, 1250, 1300, 1280, 1350, 1400],
      satisfactionRate: 94,
      employmentRate: 89,
      retentionRate: 92
    },
    pendingActions: [
      {
        id: 1,
        type: "Course Approval",
        item: "Mobile App Development",
        priority: "High",
        dueDate: "2024-06-20",
        assignedTo: "Dr. Michael Chen"
      }
    ]
  };

  // Helper Components
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
      showNumber && rating > 0 && React.createElement('span', { 
        className: 'rating-number ms-2 text-warning fw-bold' 
      }, rating.toFixed(1))
    );
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      'Active': { class: 'bg-success', icon: '🟢' },
      'Planning': { class: 'bg-warning', icon: '🟡' },
      'Under Review': { class: 'bg-info', icon: '🔵' },
      'Approved': { class: 'bg-success', icon: '✅' },
      'Available': { class: 'bg-primary', icon: '🔵' },
      'Inactive': { class: 'bg-secondary', icon: '⚫' }
    };
    
    const config = statusConfig[status] || statusConfig['Active'];
    return React.createElement('span', { 
      className: `badge ${config.class} d-inline-flex align-items-center gap-1` 
    }, config.icon, status);
  };

  const PriorityBadge = ({ priority }) => {
    const priorityConfig = {
      'High': { class: 'bg-danger', icon: '🔴' },
      'Medium': { class: 'bg-warning', icon: '🟡' },
      'Low': { class: 'bg-info', icon: '🔵' }
    };
    
    const config = priorityConfig[priority] || priorityConfig['Medium'];
    return React.createElement('span', { 
      className: `badge ${config.class} d-inline-flex align-items-center gap-1` 
    }, config.icon, priority);
  };

  const ProgressBar = ({ percentage, color = 'bg-primary' }) => {
    return React.createElement('div', { className: 'progress', style: { height: '8px' } },
      React.createElement('div', {
        className: `progress-bar ${color}`,
        style: { width: `${percentage}%` }
      })
    );
  };

  // REAL FUNCTIONALITY - Add, Delete, Assign Courses
  const handleAddCourse = async (e) => {
    e.preventDefault();
    setIsAddingCourse(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('❌ Authentication required');
        return;
      }

      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newCourse.code,
          name: newCourse.name,
          credits: parseInt(newCourse.credits),
          level: newCourse.level,
          semester: newCourse.semester,
          modules: newCourse.modules.split(',').map(m => m.trim()).filter(m => m),
          prerequisites: newCourse.prerequisites.split(',').map(p => p.trim()).filter(p => p)
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh courses list
        const coursesResponse = await fetch('http://localhost:5000/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          const transformedCourses = coursesData.courses.map(course => ({
            id: course.id,
            code: course.code,
            name: course.name,
            credits: course.credits,
            level: course.level,
            semester: course.semester,
            status: course.status,
            assignedLecturer: course.assigned_lecturer_name || null,
            studentsEnrolled: course.students_enrolled || 0,
            rating: parseFloat(course.rating) || 0,
            color: course.color || "linear-gradient(135deg, #" + Math.floor(Math.random()*16777215).toString(16) + " 0%, #" + Math.floor(Math.random()*16777215).toString(16) + " 100%)",
            modules: course.modules || [],
            prerequisites: course.prerequisites || []
          }));
          setCourses(transformedCourses);
        }
        setShowAddCourseModal(false);
        setNewCourse({
          code: '', name: '', credits: '', level: '', semester: '', modules: '', prerequisites: ''
        });
        alert('✅ Course added successfully!');
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to add course: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('❌ Network error while adding course');
    } finally {
      setIsAddingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('❌ Authentication required');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh courses list
        const coursesResponse = await fetch('http://localhost:5000/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json();
          const transformedCourses = coursesData.courses.map(course => ({
            id: course.id,
            code: course.code,
            name: course.name,
            credits: course.credits,
            level: course.level,
            semester: course.semester,
            status: course.status,
            assignedLecturer: course.assigned_lecturer_name || null,
            studentsEnrolled: course.students_enrolled || 0,
            rating: parseFloat(course.rating) || 0,
            color: course.color || "linear-gradient(135deg, #" + Math.floor(Math.random()*16777215).toString(16) + " 0%, #" + Math.floor(Math.random()*16777215).toString(16) + " 100%)",
            modules: course.modules || [],
            prerequisites: course.prerequisites || []
          }));
          setCourses(transformedCourses);
        }
        setShowDeleteConfirmModal(false);
        setCourseToDelete(null);
        alert('🗑️ Course deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to delete course: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('❌ Network error while deleting course');
    }
  };

  const handleAssignLecturer = (e) => {
    e.preventDefault();
    const selectedLecturer = lecturers.find(l => l.id === parseInt(assignmentForm.lecturerId));
    
    setCourses(prev => prev.map(course => 
      course.id === parseInt(assignmentForm.courseId) 
        ? { ...course, assignedLecturer: selectedLecturer.name, status: "Active" }
        : course
    ));

    // Update lecturer workload
    setLecturers(prev => prev.map(lecturer => 
      lecturer.id === parseInt(assignmentForm.lecturerId)
        ? { ...lecturer, coursesAssigned: lecturer.coursesAssigned + 1 }
        : lecturer
    ));

    setShowAssignLecturerModal(false);
    setAssignmentForm({
      courseId: '', lecturerId: '', startDate: '', endDate: '', notes: ''
    });
    setCourseToAssign(null);
    alert('👨‍🏫 Lecturer assigned successfully!');
  };

  const handleReassignLecturer = (course) => {
    setCourseToAssign(course);
    setAssignmentForm(prev => ({ ...prev, courseId: course.id }));
    setShowAssignLecturerModal(true);
  };

  const handleApproveReport = (reportId) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: "Approved" }
        : report
    ));
    alert('✅ Report approved successfully!');
  };

  const handleRequestChanges = (reportId) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: "Under Review" }
        : report
    ));
    alert('📝 Changes requested for report!');
  };

  const handleContactLecturer = (lecturerEmail) => {
    alert(`📧 Opening email client to contact: ${lecturerEmail}`);
    // In real app: window.location.href = `mailto:${lecturerEmail}`;
  };

  const handleViewPerformance = (lecturerId) => {
    const lecturer = lecturers.find(l => l.id === lecturerId);
    alert(`📊 Performance details for ${lecturer.name}:\n\nRating: ${lecturer.rating}/5.0\nCourses: ${lecturer.coursesAssigned}\nStudents: ${lecturer.totalStudents}\nWorkload: ${lecturer.workload}`);
  };

  const handleTakeAction = (actionId) => {
    alert(`⚡ Taking action on item ${actionId}`);
  };

  const handleViewAnalytics = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    alert(`📈 Analytics for ${report.courseName}:\n\nRating: ${report.rating}/5.0\nStatus: ${report.status}\nReviewer: ${report.prlReviewer}`);
  };

  // Form Handlers
  const handleNewCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentForm(prev => ({ ...prev, [name]: value }));
  };

  // Filter data
  const filteredCourses = courses.filter(course => 
    (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     course.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredLecturers = lecturers.filter(lecturer => 
    lecturer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = reports.filter(report => 
    report.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Module tabs
  const moduleTabs = [
    { id: 'overview', name: '🏠 Overview', icon: '🏠' },
    { id: 'courses', name: '📚 Courses', icon: '📚' },
    { id: 'reports', name: '📋 Reports', icon: '📋' },
    { id: 'monitoring', name: '📊 Monitoring', icon: '📊' },
    { id: 'classes', name: '👨‍🏫 Lecturers', icon: '👨‍🏫' },
    { id: 'rating', name: '⭐ Rating', icon: '⭐' }
  ];

  // Render Overview Module
  const renderOverviewModule = () => {
    return React.createElement('div', { className: 'row g-4' },
      // Stats Cards - Now dynamic
      React.createElement('div', { className: 'col-md-2' },
        React.createElement('div', { className: 'stat-card-pl text-center p-3 rounded' },
          React.createElement('div', { className: 'stat-icon mb-2' }, '📚'),
          React.createElement('h4', { className: 'text-warning mb-1' }, courses.length),
          React.createElement('small', { className: 'text-light' }, 'Courses')
        )
      ),
      React.createElement('div', { className: 'col-md-2' },
        React.createElement('div', { className: 'stat-card-pl text-center p-3 rounded' },
          React.createElement('div', { className: 'stat-icon mb-2' }, '👨‍🏫'),
          React.createElement('h4', { className: 'text-warning mb-1' }, lecturers.length),
          React.createElement('small', { className: 'text-light' }, 'Lecturers')
        )
      ),
      React.createElement('div', { className: 'col-md-2' },
        React.createElement('div', { className: 'stat-card-pl text-center p-3 rounded' },
          React.createElement('div', { className: 'stat-icon mb-2' }, '🎓'),
          React.createElement('h4', { className: 'text-warning mb-1' }, plData.stats.activeStudents),
          React.createElement('small', { className: 'text-light' }, 'Students')
        )
      ),
      React.createElement('div', { className: 'col-md-2' },
        React.createElement('div', { className: 'stat-card-pl text-center p-3 rounded' },
          React.createElement('div', { className: 'stat-icon mb-2' }, '⭐'),
          React.createElement('h4', { className: 'text-warning mb-1' }, plData.stats.programRating),
          React.createElement('small', { className: 'text-light' }, 'Rating')
        )
      ),
      React.createElement('div', { className: 'col-md-2' },
        React.createElement('div', { className: 'stat-card-pl text-center p-3 rounded' },
          React.createElement('div', { className: 'stat-icon mb-2' }, '⏳'),
          React.createElement('h4', { className: 'text-warning mb-1' }, reports.filter(r => r.status === 'Under Review').length),
          React.createElement('small', { className: 'text-light' }, 'Pending')
        )
      ),
      React.createElement('div', { className: 'col-md-2' },
        React.createElement('div', { className: 'stat-card-pl text-center p-3 rounded' },
          React.createElement('div', { className: 'stat-icon mb-2' }, '✅'),
          React.createElement('h4', { className: 'text-warning mb-1' }, reports.filter(r => r.status === 'Approved').length),
          React.createElement('small', { className: 'text-light' }, 'Reviewed')
        )
      ),

      // Program Performance
      React.createElement('div', { className: 'col-lg-8' },
        React.createElement('div', { className: 'portal-card h-100' },
          React.createElement('div', { className: 'portal-card-header d-flex justify-content-between align-items-center' },
            React.createElement('h5', { className: 'text-warning mb-0' }, '📈 Program Performance Metrics'),
            React.createElement('select', {
              className: 'form-select form-select-sm',
              value: selectedProgram,
              onChange: (e) => setSelectedProgram(e.target.value),
              style: { width: '200px' }
            }, plData.programs.map(program =>
              React.createElement('option', { key: program, value: program }, program)
            ))
          ),
          React.createElement('div', { className: 'card-body' },
            React.createElement('div', { className: 'row g-4' },
              React.createElement('div', { className: 'col-md-6' },
                React.createElement('div', { className: 'metric-card p-3 rounded' },
                  React.createElement('div', { className: 'd-flex justify-content-between align-items-center mb-2' },
                    React.createElement('span', { className: 'text-light' }, 'Active Courses'),
                    React.createElement('span', { className: 'text-warning fw-bold' }, `${courses.filter(c => c.status === 'Active').length}`)
                  ),
                  React.createElement(ProgressBar, { 
                    percentage: (courses.filter(c => c.status === 'Active').length / courses.length) * 100, 
                    color: 'bg-success' 
                  })
                )
              ),
              React.createElement('div', { className: 'col-md-6' },
                React.createElement('div', { className: 'metric-card p-3 rounded' },
                  React.createElement('div', { className: 'd-flex justify-content-between align-items-center mb-2' },
                    React.createElement('span', { className: 'text-light' }, 'Lecturer Utilization'),
                    React.createElement('span', { className: 'text-warning fw-bold' }, '92%')
                  ),
                  React.createElement(ProgressBar, { percentage: 92, color: 'bg-info' })
                )
              )
            )
          )
        )
      ),

      // Pending Actions - Now with working buttons
      React.createElement('div', { className: 'col-lg-4' },
        React.createElement('div', { className: 'portal-card h-100' },
          React.createElement('div', { className: 'portal-card-header' },
            React.createElement('h5', { className: 'text-warning mb-0' }, '⏰ Pending Actions')
          ),
          React.createElement('div', { className: 'card-body' },
            plData.pendingActions.map(action =>
              React.createElement('div', { key: action.id, className: 'action-item mb-3 p-3 border-bottom border-secondary' },
                React.createElement('div', { className: 'd-flex justify-content-between align-items-start mb-2' },
                  React.createElement('div', null,
                    React.createElement('h6', { className: 'text-light mb-1' }, action.item),
                    React.createElement('small', { className: 'text-muted' }, action.type)
                  ),
                  React.createElement(PriorityBadge, { priority: action.priority })
                ),
                React.createElement('div', { className: 'd-flex justify-content-between align-items-center' },
                  React.createElement('small', { className: 'text-muted' }, `Due: ${action.dueDate}`),
                  React.createElement('button', { 
                    className: 'btn btn-warning btn-sm',
                    onClick: () => handleTakeAction(action.id)
                  }, 'Take Action')
                )
              )
            )
          )
        )
      )
    );
  };

  // Render Courses Module - WITH REAL FUNCTIONALITY
  const renderCoursesModule = () => {
    return React.createElement('div', null,
      React.createElement('div', { className: 'portal-card' },
        React.createElement('div', { className: 'portal-card-header d-flex justify-content-between align-items-center' },
          React.createElement('h5', { className: 'text-warning mb-0' }, '📚 Course Management'),
          React.createElement('div', { className: 'd-flex gap-2' },
            React.createElement('input', {
              type: 'text',
              className: 'form-control form-control-sm',
              placeholder: 'Search courses...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              style: { width: '200px' }
            }),
            React.createElement('button', {
              className: 'btn btn-success btn-sm',
              onClick: () => setShowAddCourseModal(true)
            }, '+ Add Course'),
            React.createElement('button', {
              className: 'btn btn-primary btn-sm',
              onClick: () => {
                setCourseToAssign(null);
                setShowAssignLecturerModal(true);
              }
            }, '👨‍🏫 Assign Lecturer')
          )
        ),
        React.createElement('div', { className: 'card-body' },
          React.createElement('div', { className: 'row g-4' },
            filteredCourses.map(course =>
              React.createElement('div', { key: course.id, className: 'col-md-6 col-lg-4' },
                React.createElement('div', { 
                  className: 'course-management-card p-4 rounded',
                  style: { background: course.color }
                },
                  React.createElement('div', { className: 'course-header d-flex justify-content-between align-items-start mb-3' },
                    React.createElement('div', null,
                      React.createElement('h6', { className: 'text-light mb-1' }, course.code),
                      React.createElement('h5', { className: 'text-white' }, course.name),
                      React.createElement(StatusBadge, { status: course.status })
                    ),
                    React.createElement('div', { className: 'text-end' },
                      React.createElement('div', { className: 'text-warning fw-bold' }, `${course.credits} Credits`),
                      React.createElement('small', { className: 'text-light' }, course.level)
                    )
                  ),

                  React.createElement('div', { className: 'course-details mb-3' },
                    React.createElement('div', { className: 'detail-item d-flex justify-content-between mb-2' },
                      React.createElement('small', { className: 'text-light' }, 'Lecturer:'),
                      React.createElement('small', { className: 'text-light' }, 
                        course.assignedLecturer || 'Not Assigned'
                      )
                    ),
                    React.createElement('div', { className: 'detail-item d-flex justify-content-between mb-2' },
                      React.createElement('small', { className: 'text-light' }, 'Students:'),
                      React.createElement('small', { className: 'text-warning fw-bold' }, course.studentsEnrolled)
                    ),
                    React.createElement('div', { className: 'detail-item d-flex justify-content-between' },
                      React.createElement('small', { className: 'text-light' }, 'Rating:'),
                      course.rating > 0 ? 
                        React.createElement(StarRating, { rating: course.rating, size: 14, showNumber: true }) :
                        React.createElement('small', { className: 'text-muted' }, 'No ratings')
                    )
                  ),

                  React.createElement('div', { className: 'course-modules mb-3' },
                    React.createElement('small', { className: 'text-light d-block mb-1' }, 'Modules:'),
                    React.createElement('div', { className: 'module-tags' },
                      course.modules.slice(0, 2).map((module, idx) =>
                        React.createElement('span', {
                          key: idx,
                          className: 'badge bg-light text-dark me-1 mb-1'
                        }, module)
                      ),
                      course.modules.length > 2 && 
                        React.createElement('span', { 
                          className: 'badge bg-secondary'
                        }, `+${course.modules.length - 2}`)
                    )
                  ),

                  React.createElement('div', { className: 'course-actions' },
                    React.createElement('div', { className: 'row g-2' },
                      React.createElement('div', { className: 'col-4' },
                        React.createElement('button', {
                          className: 'btn btn-outline-light btn-sm w-100',
                          onClick: () => handleReassignLecturer(course)
                        }, course.assignedLecturer ? '🔄 Reassign' : '👨‍🏫 Assign')
                      ),
                      React.createElement('div', { className: 'col-4' },
                        React.createElement('button', { 
                          className: 'btn btn-outline-warning btn-sm w-100',
                          onClick: () => alert(`⚙️ Managing course: ${course.name}`)
                        }, '⚙️ Manage')
                      ),
                      React.createElement('div', { className: 'col-4' },
                        React.createElement('button', { 
                          className: 'btn btn-outline-danger btn-sm w-100',
                          onClick: () => {
                            setCourseToDelete(course.id);
                            setShowDeleteConfirmModal(true);
                          }
                        }, '🗑️ Delete')
                      )
                    )
                  )
                )
              )
            )
          ),
          filteredCourses.length === 0 && React.createElement('div', { className: 'text-center py-5' },
            React.createElement('p', { className: 'text-muted' }, 'No courses found matching your search.')
          )
        )
      )
    );
  };

  // Render Reports Module - WITH WORKING BUTTONS
  const renderReportsModule = () => {
    return React.createElement('div', null,
      React.createElement('div', { className: 'portal-card' },
        React.createElement('div', { className: 'portal-card-header d-flex justify-content-between align-items-center' },
          React.createElement('h5', { className: 'text-warning mb-0' }, '📋 PRL Review Reports'),
          React.createElement('input', {
            type: 'text',
            className: 'form-control form-control-sm',
            placeholder: 'Search reports...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            style: { width: '250px' }
          })
        ),
        React.createElement('div', { className: 'card-body' },
          React.createElement('div', { className: 'row g-4' },
            filteredReports.map(report =>
              React.createElement('div', { key: report.id, className: 'col-12' },
                React.createElement('div', { className: 'prl-report-card portal-card p-4' },
                  React.createElement('div', { className: 'report-header d-flex justify-content-between align-items-start mb-3' },
                    React.createElement('div', null,
                      React.createElement('h5', { className: 'text-warning mb-1' }, 
                        `${report.courseName} (${report.courseCode})`
                      ),
                      React.createElement('div', { className: 'd-flex gap-3 text-light' },
                        React.createElement('small', null, `👨‍🏫 ${report.lecturer}`),
                        React.createElement('small', null, `🔍 ${report.prlReviewer}`),
                        React.createElement('small', null, `📅 ${report.reviewDate}`)
                      )
                    ),
                    React.createElement('div', { className: 'text-end' },
                      React.createElement(StatusBadge, { status: report.status }),
                      React.createElement(StarRating, { rating: report.rating, showNumber: true })
                    )
                  ),

                  React.createElement('div', { className: 'row' },
                    React.createElement('div', { className: 'col-md-6' },
                      React.createElement('div', { className: 'feedback-section' },
                        React.createElement('h6', { className: 'text-light mb-2' }, 'PRL Feedback'),
                        React.createElement('p', { className: 'text-light' }, report.feedback),
                        React.createElement('div', { className: 'mt-3' },
                          React.createElement('h6', { className: 'text-light mb-2' }, 'Recommendations'),
                          React.createElement('p', { className: 'text-light' }, report.recommendations)
                        )
                      )
                    ),
                    React.createElement('div', { className: 'col-md-6' },
                      React.createElement('div', { className: 'student-feedback' },
                        React.createElement('h6', { className: 'text-light mb-2' }, 'Student Feedback'),
                        React.createElement('p', { className: 'text-light' }, report.studentFeedback),
                        React.createElement('div', { className: 'action-buttons mt-3' },
                          React.createElement('button', { 
                            className: 'btn btn-success btn-sm me-2',
                            onClick: () => handleApproveReport(report.id)
                          }, '✅ Approve'),
                          React.createElement('button', { 
                            className: 'btn btn-warning btn-sm me-2',
                            onClick: () => handleRequestChanges(report.id)
                          }, '📝 Request Changes'),
                          React.createElement('button', { 
                            className: 'btn btn-info btn-sm',
                            onClick: () => handleViewAnalytics(report.id)
                          }, '📊 View Analytics')
                        )
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

  // Render Monitoring Module
  const renderMonitoringModule = () => {
    return React.createElement('div', { className: 'row g-4' },
      React.createElement('div', { className: 'col-12' },
        React.createElement('div', { className: 'portal-card' },
          React.createElement('div', { className: 'portal-card-header' },
            React.createElement('h5', { className: 'text-warning mb-0' }, '📊 Program Health Monitoring')
          ),
          React.createElement('div', { className: 'card-body' },
            React.createElement('div', { className: 'row g-4' },
              React.createElement('div', { className: 'col-md-3' },
                React.createElement('div', { className: 'health-indicator text-center p-4 rounded' },
                  React.createElement('div', { className: 'indicator-icon mb-3' }, '📈'),
                  React.createElement('h3', { className: 'text-success mb-2' }, 'Excellent'),
                  React.createElement('p', { className: 'text-light mb-0' }, 'Overall Program Health')
                )
              ),
              React.createElement('div', { className: 'col-md-3' },
                React.createElement('div', { className: 'health-indicator text-center p-4 rounded' },
                  React.createElement('div', { className: 'indicator-icon mb-3' }, '👨‍🏫'),
                  React.createElement('h3', { className: 'text-warning mb-2' }, 'Good'),
                  React.createElement('p', { className: 'text-light mb-0' }, 'Staffing Levels')
                )
              ),
              React.createElement('div', { className: 'col-md-3' },
                React.createElement('div', { className: 'health-indicator text-center p-4 rounded' },
                  React.createElement('div', { className: 'indicator-icon mb-3' }, '📚'),
                  React.createElement('h3', { className: 'text-info mb-2' }, 'Optimal'),
                  React.createElement('p', { className: 'text-light mb-0' }, 'Course Load')
                )
              ),
              React.createElement('div', { className: 'col-md-3' },
                React.createElement('div', { className: 'health-indicator text-center p-4 rounded' },
                  React.createElement('div', { className: 'indicator-icon mb-3' }, '🎯'),
                  React.createElement('h3', { className: 'text-success mb-2' }, 'On Track'),
                  React.createElement('p', { className: 'text-light mb-0' }, 'Learning Outcomes')
                )
              )
            )
          )
        )
      )
    );
  };

  // Render Lecturers Module - WITH WORKING BUTTONS
  const renderLecturersModule = () => {
    return React.createElement('div', null,
      React.createElement('div', { className: 'portal-card' },
        React.createElement('div', { className: 'portal-card-header d-flex justify-content-between align-items-center' },
          React.createElement('h5', { className: 'text-warning mb-0' }, '👨‍🏫 Lecturer Management'),
          React.createElement('input', {
            type: 'text',
            className: 'form-control form-control-sm',
            placeholder: 'Search lecturers...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            style: { width: '250px' }
          })
        ),
        React.createElement('div', { className: 'card-body' },
          React.createElement('div', { className: 'row g-4' },
            filteredLecturers.map(lecturer =>
              React.createElement('div', { key: lecturer.id, className: 'col-md-6 col-lg-4' },
                React.createElement('div', { className: 'lecturer-management-card portal-card p-4 text-center' },
                  React.createElement('div', { className: 'lecturer-avatar mb-3' }, '👨‍🏫'),
                  React.createElement('h5', { className: 'text-light mb-2' }, lecturer.name),
                  React.createElement('p', { className: 'text-muted mb-3' }, lecturer.specialization),
                  React.createElement(StarRating, { rating: lecturer.rating, showNumber: true }),
                  React.createElement('div', { className: 'lecturer-stats mt-3' },
                    React.createElement('div', { className: 'row text-center' },
                      React.createElement('div', { className: 'col-4' },
                        React.createElement('div', { className: 'stat-value text-warning' }, lecturer.coursesAssigned),
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
                  ),
                  React.createElement('div', { className: 'workload-indicator mt-3' },
                    React.createElement('small', { className: 'text-light d-block mb-1' }, `Workload: ${lecturer.workload}`),
                    React.createElement(ProgressBar, { 
                      percentage: parseInt(lecturer.workload), 
                      color: parseInt(lecturer.workload) > 80 ? 'bg-danger' : parseInt(lecturer.workload) > 60 ? 'bg-warning' : 'bg-success' 
                    })
                  ),
                  React.createElement('div', { className: 'lecturer-actions mt-3' },
                    React.createElement('div', { className: 'row g-2' },
                      React.createElement('div', { className: 'col-6' },
                        React.createElement('button', { 
                          className: 'btn btn-outline-primary btn-sm w-100',
                          onClick: () => handleContactLecturer(lecturer.email)
                        }, '📧 Contact')
                      ),
                      React.createElement('div', { className: 'col-6' },
                        React.createElement('button', { 
                          className: 'btn btn-outline-warning btn-sm w-100',
                          onClick: () => handleViewPerformance(lecturer.id)
                        }, '📊 Performance')
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
    if (ratingsLoading) {
      return React.createElement('div', { className: 'row g-4' },
        React.createElement('div', { className: 'col-12' },
          React.createElement('div', { className: 'portal-card' },
            React.createElement('div', { className: 'portal-card-header' },
              React.createElement('h5', { className: 'text-warning mb-0' }, '⭐ Program Ratings & Reviews')
            ),
            React.createElement('div', { className: 'card-body text-center py-5' },
              React.createElement('div', { className: 'spinner-border text-warning mb-3' }),
              React.createElement('p', { className: 'text-light' }, 'Loading ratings...')
            )
          )
        )
      );
    }

    return React.createElement('div', { className: 'row g-4' },
      React.createElement('div', { className: 'col-12' },
        React.createElement('div', { className: 'portal-card' },
          React.createElement('div', { className: 'portal-card-header' },
            React.createElement('h5', { className: 'text-warning mb-0' }, '⭐ Program Ratings & Reviews')
          ),
          React.createElement('div', { className: 'card-body' },
            React.createElement('div', { className: 'row g-4' },
              React.createElement('div', { className: 'col-md-4' },
                React.createElement('div', { className: 'overall-rating-card text-center p-4 rounded' },
                  React.createElement('div', { className: 'rating-icon mb-3' }, '🏆'),
                  React.createElement('h1', { className: 'text-warning mb-2' },
                    realTimeRatings.length > 0 ? ratingStats.averageRating : 'N/A'
                  ),
                  realTimeRatings.length > 0 && React.createElement(StarRating, { rating: ratingStats.averageRating, size: 24 }),
                  React.createElement('p', { className: 'text-light mt-2' },
                    `Overall Program Rating (${realTimeRatings.length} reviews)`
                  )
                )
              ),
              React.createElement('div', { className: 'col-md-8' },
                React.createElement('div', { className: 'rating-breakdown p-4 rounded' },
                  React.createElement('h6', { className: 'text-warning mb-3' }, 'Rating Distribution'),
                  realTimeRatings.length > 0 ? [5, 4, 3, 2, 1].map(stars =>
                    React.createElement('div', { key: stars, className: 'distribution-item d-flex align-items-center mb-2' },
                      React.createElement('small', { className: 'text-light me-2', style: { width: '60px' } }, `${stars} ★`),
                      React.createElement('div', { className: 'progress flex-grow-1', style: { height: '8px' } },
                        React.createElement('div', {
                          className: 'progress-bar bg-warning',
                          style: { width: `${(ratingStats.distribution[stars] / realTimeRatings.length) * 100}%` }
                        })
                      ),
                      React.createElement('small', { className: 'text-light ms-2', style: { width: '50px' } },
                        `${ratingStats.distribution[stars]} (${Math.round((ratingStats.distribution[stars] / realTimeRatings.length) * 100)}%)`
                      )
                    )
                  ) : React.createElement('div', { className: 'text-center py-4' },
                    React.createElement('p', { className: 'text-muted' }, 'No ratings available yet')
                  )
                )
              )
            ),
            // Recent Ratings List
            realTimeRatings.length > 0 && React.createElement('div', { className: 'row mt-4' },
              React.createElement('div', { className: 'col-12' },
                React.createElement('h6', { className: 'text-warning mb-3' }, 'Recent Student Ratings'),
                React.createElement('div', { className: 'recent-ratings-list' },
                  realTimeRatings.slice(0, 5).map((rating, index) =>
                    React.createElement('div', {
                      key: rating.id || index,
                      className: 'recent-rating-item d-flex justify-content-between align-items-center p-3 mb-2 border-bottom border-secondary'
                    },
                      React.createElement('div', { className: 'd-flex align-items-center' },
                        React.createElement('div', { className: 'me-3' },
                          React.createElement('small', { className: 'text-muted' }, rating.course_name),
                          React.createElement('br'),
                          React.createElement('small', { className: 'text-light' }, `by ${rating.student_name}`)
                        ),
                        React.createElement('div', null,
                          React.createElement(StarRating, { rating: rating.rating, size: 14, showNumber: true }),
                          rating.comment && React.createElement('div', { className: 'mt-1' },
                            React.createElement('small', { className: 'text-muted' }, `"${rating.comment}"`)
                          )
                        )
                      ),
                      React.createElement('small', { className: 'text-muted' },
                        new Date(rating.rated_at).toLocaleDateString()
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

  // Render Add Course Modal
  const renderAddCourseModal = () => {
    if (!showAddCourseModal) return null;

    return React.createElement('div', { className: 'modal-backdrop show d-block' },
      React.createElement('div', { className: 'modal show d-block' },
        React.createElement('div', { className: 'modal-dialog modal-dialog-centered' },
          React.createElement('div', { className: 'modal-content portal-card' },
            React.createElement('div', { className: 'modal-header border-secondary' },
              React.createElement('h5', { className: 'modal-title text-warning' }, '➕ Add New Course'),
              React.createElement('button', { 
                type: 'button', 
                className: 'btn-close btn-close-white',
                onClick: () => setShowAddCourseModal(false)
              })
            ),
            React.createElement('div', { className: 'modal-body' },
              React.createElement('form', { onSubmit: handleAddCourse },
                React.createElement('div', { className: 'row g-3' },
                  React.createElement('div', { className: 'col-md-6' },
                    React.createElement('label', { className: 'form-label text-light' }, 'Course Code *'),
                    React.createElement('input', {
                      type: 'text',
                      className: 'form-control',
                      name: 'code',
                      value: newCourse.code,
                      onChange: handleNewCourseChange,
                      required: true,
                      placeholder: 'e.g., SE3101'
                    })
                  ),
                  React.createElement('div', { className: 'col-md-6' },
                    React.createElement('label', { className: 'form-label text-light' }, 'Course Name *'),
                    React.createElement('input', {
                      type: 'text',
                      className: 'form-control',
                      name: 'name',
                      value: newCourse.name,
                      onChange: handleNewCourseChange,
                      required: true,
                      placeholder: 'e.g., Advanced Software Engineering'
                    })
                  ),
                  React.createElement('div', { className: 'col-md-6' },
                    React.createElement('label', { className: 'form-label text-light' }, 'Credits *'),
                    React.createElement('input', {
                      type: 'number',
                      className: 'form-control',
                      name: 'credits',
                      value: newCourse.credits,
                      onChange: handleNewCourseChange,
                      required: true,
                      placeholder: 'e.g., 15'
                    })
                  ),
                  React.createElement('div', { className: 'col-md-6' },
                    React.createElement('label', { className: 'form-label text-light' }, 'Level *'),
                    React.createElement('select', {
                      className: 'form-select',
                      name: 'level',
                      value: newCourse.level,
                      onChange: handleNewCourseChange,
                      required: true
                    },
                      React.createElement('option', { value: '' }, 'Select Level'),
                      React.createElement('option', { value: 'Year 1' }, 'Year 1'),
                      React.createElement('option', { value: 'Year 2' }, 'Year 2'),
                      React.createElement('option', { value: 'Year 3' }, 'Year 3'),
                      React.createElement('option', { value: 'Year 4' }, 'Year 4')
                    )
                  ),
                  React.createElement('div', { className: 'col-12' },
                    React.createElement('label', { className: 'form-label text-light' }, 'Course Modules'),
                    React.createElement('textarea', {
                      className: 'form-control',
                      name: 'modules',
                      value: newCourse.modules,
                      onChange: handleNewCourseChange,
                      placeholder: 'Enter modules separated by commas (e.g., React, Node.js, MongoDB)',
                      rows: 3
                    })
                  )
                ),
                React.createElement('div', { className: 'modal-footer border-secondary mt-3' },
                  React.createElement('button', { 
                    type: 'button', 
                    className: 'btn btn-secondary',
                    onClick: () => setShowAddCourseModal(false)
                  }, 'Cancel'),
                  React.createElement('button', { 
                    type: 'submit', 
                    className: 'btn btn-success'
                  }, '➕ Add Course')
                )
              )
            )
          )
        )
      )
    );
  };

  // Render Assign Lecturer Modal
  const renderAssignLecturerModal = () => {
    if (!showAssignLecturerModal) return null;

    return React.createElement('div', { className: 'modal-backdrop show d-block' },
      React.createElement('div', { className: 'modal show d-block' },
        React.createElement('div', { className: 'modal-dialog modal-dialog-centered' },
          React.createElement('div', { className: 'modal-content portal-card' },
            React.createElement('div', { className: 'modal-header border-secondary' },
              React.createElement('h5', { className: 'modal-title text-warning' }, 
                courseToAssign ? `👨‍🏫 Assign Lecturer to ${courseToAssign.name}` : '👨‍🏫 Assign Lecturer to Course'
              ),
              React.createElement('button', { 
                type: 'button', 
                className: 'btn-close btn-close-white',
                onClick: () => setShowAssignLecturerModal(false)
              })
            ),
            React.createElement('div', { className: 'modal-body' },
              React.createElement('form', { onSubmit: handleAssignLecturer },
                React.createElement('div', { className: 'row g-3' },
                  React.createElement('div', { className: 'col-12' },
                    React.createElement('label', { className: 'form-label text-light' }, 'Select Course *'),
                    React.createElement('select', {
                      className: 'form-select',
                      name: 'courseId',
                      value: assignmentForm.courseId,
                      onChange: handleAssignmentChange,
                      required: true
                    },
                      React.createElement('option', { value: '' }, 'Choose a course...'),
                      courses.map(course =>
                        React.createElement('option', { key: course.id, value: course.id }, `${course.code} - ${course.name}`)
                      )
                    )
                  ),
                  React.createElement('div', { className: 'col-12' },
                    React.createElement('label', { className: 'form-label text-light' }, 'Select Lecturer *'),
                    React.createElement('select', {
                      className: 'form-select',
                      name: 'lecturerId',
                      value: assignmentForm.lecturerId,
                      onChange: handleAssignmentChange,
                      required: true
                    },
                      React.createElement('option', { value: '' }, 'Choose a lecturer...'),
                      lecturers.map(lecturer =>
                        React.createElement('option', { key: lecturer.id, value: lecturer.id }, 
                          `${lecturer.name} (${lecturer.specialization}) - ${lecturer.workload} workload`
                        )
                      )
                    )
                  )
                ),
                React.createElement('div', { className: 'modal-footer border-secondary mt-3' },
                  React.createElement('button', { 
                    type: 'button', 
                    className: 'btn btn-secondary',
                    onClick: () => setShowAssignLecturerModal(false)
                  }, 'Cancel'),
                  React.createElement('button', { 
                    type: 'submit', 
                    className: 'btn btn-primary'
                  }, '👨‍🏫 Assign Lecturer')
                )
              )
            )
          )
        )
      )
    );
  };

  // Render Delete Confirmation Modal
  const renderDeleteConfirmModal = () => {
    if (!showDeleteConfirmModal) return null;

    const course = courses.find(c => c.id === courseToDelete);

    return React.createElement('div', { className: 'modal-backdrop show d-block' },
      React.createElement('div', { className: 'modal show d-block' },
        React.createElement('div', { className: 'modal-dialog modal-dialog-centered' },
          React.createElement('div', { className: 'modal-content portal-card' },
            React.createElement('div', { className: 'modal-header border-secondary' },
              React.createElement('h5', { className: 'modal-title text-warning' }, '🗑️ Confirm Deletion'),
              React.createElement('button', { 
                type: 'button', 
                className: 'btn-close btn-close-white',
                onClick: () => setShowDeleteConfirmModal(false)
              })
            ),
            React.createElement('div', { className: 'modal-body text-center' },
              React.createElement('div', { className: 'warning-icon mb-3' }, '⚠️'),
              React.createElement('h6', { className: 'text-light mb-2' }, `Delete ${course?.code} - ${course?.name}?`),
              React.createElement('p', { className: 'text-muted' }, 'This action cannot be undone. All course data will be permanently removed.'),
              React.createElement('div', { className: 'modal-footer border-secondary mt-3 justify-content-center' },
                React.createElement('button', { 
                  type: 'button', 
                  className: 'btn btn-secondary me-2',
                  onClick: () => setShowDeleteConfirmModal(false)
                }, 'Cancel'),
                React.createElement('button', { 
                  type: 'button', 
                  className: 'btn btn-danger',
                  onClick: () => handleDeleteCourse(courseToDelete)
                }, '🗑️ Delete Course')
              )
            )
          )
        )
      )
    );
  };

  // Main Render
  return React.createElement('div', { className: 'pl-dashboard' },
    React.createElement('div', { className: 'container-fluid' },
      // Header
      React.createElement('div', { className: 'row mb-4' },
        React.createElement('div', { className: 'col-12' },
          React.createElement('div', { className: 'dashboard-header portal-card p-4' },
            React.createElement('div', { className: 'row align-items-center' },
              React.createElement('div', { className: 'col-md-6' },
                React.createElement('div', { className: 'd-flex align-items-center' },
                  React.createElement('div', { className: 'pl-avatar me-4' },
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
                    }, plData.avatar)
                  ),
                  React.createElement('div', null,
                    React.createElement('h1', { className: 'text-warning mb-1' }, `Welcome, ${plData.name}!`),
                    React.createElement('p', { className: 'text-light mb-0 opacity-75' }, plData.title),
                    React.createElement('div', { className: 'd-flex gap-3 mt-2' },
                      React.createElement('span', { className: 'badge bg-primary' }, `📚 ${courses.length} Courses`),
                      React.createElement('span', { className: 'badge bg-success' }, `👨‍🏫 ${lecturers.length} Lecturers`),
                      React.createElement('span', { className: 'badge bg-warning' }, `⭐ ${plData.stats.programRating}/5 Rating`)
                    )
                  )
                )
              )
            )
          )
        )
      ),

      // Navigation
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

      // Content
      React.createElement('div', { className: 'row' },
        React.createElement('div', { className: 'col-12' },
          activeModule === 'overview' && renderOverviewModule(),
          activeModule === 'courses' && renderCoursesModule(),
          activeModule === 'reports' && renderReportsModule(),
          activeModule === 'monitoring' && renderMonitoringModule(),
          activeModule === 'classes' && renderLecturersModule(),
          activeModule === 'rating' && renderRatingModule()
        )
      )
    ),

    // Modals
    renderAddCourseModal(),
    renderAssignLecturerModal(),
    renderDeleteConfirmModal(),

    // Styles
    React.createElement('style', null, `
      .pl-dashboard {
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
      .stat-card-pl {
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        border: 1px solid rgba(255,255,255,0.1);
        transition: all 0.3s ease;
      }
      .stat-card-pl:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      }
      .stat-icon {
        font-size: 2rem;
        opacity: 0.8;
      }
      .portal-card {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        backdrop-filter: blur(10px);
      }
      .course-management-card, .health-indicator, .overall-rating-card {
        transition: all 0.3s ease;
      }
      .course-management-card:hover, .health-indicator:hover, .overall-rating-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      }
      .lecturer-management-card {
        transition: all 0.3s ease;
      }
      .lecturer-management-card:hover {
        transform: translateY(-5px);
        border-color: rgba(245, 158, 11, 0.3);
      }
      .rating-icon, .indicator-icon, .warning-icon {
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
      .metric-card {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
      }
      .module-tags .badge {
        font-size: 0.7rem;
      }
      .prl-report-card {
        transition: all 0.3s ease;
      }
      .prl-report-card:hover {
        transform: translateY(-3px);
        border-color: rgba(245, 158, 11, 0.3);
      }
      .modal-backdrop {
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
      }
    `)
  );
}