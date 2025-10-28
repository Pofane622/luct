import React, { useState, useEffect } from 'react';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Network error');
      // Demo data
      setCourses([
        {
          id: 1,
          name: 'Software Engineering',
          code: 'SE301',
          instructor: 'Dr. Sarah Johnson',
          credits: 3,
          schedule: 'Mon/Wed 10:00-11:30',
          room: 'Lab A'
        },
        {
          id: 2,
          name: 'Database Systems',
          code: 'DB201',
          instructor: 'Prof. Michael Chen',
          credits: 3,
          schedule: 'Tue/Thu 14:00-15:30',
          room: 'Room 205'
        },
        {
          id: 3,
          name: 'Web Development',
          code: 'WD101',
          instructor: 'Ms. Emily Davis',
          credits: 2,
          schedule: 'Fri 09:00-12:00',
          room: 'Lab B'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-light">Loading your courses...</p>
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
    <div className="my-courses">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-warning mb-0">
          <i className="fas fa-book-open me-2"></i>
          My Courses
        </h3>
        <span className="badge bg-warning text-dark fs-6">
          {courses.length} Course{courses.length !== 1 ? 's' : ''}
        </span>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No courses enrolled</h5>
          <p className="text-muted">You haven't enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="row">
          {courses.map(course => (
            <div key={course.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-0" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <div className="card-body text-white d-flex flex-column">
                  <div className="mb-3">
                    <h5 className="card-title text-white fw-bold">{course.name}</h5>
                    <span className="badge bg-white text-dark mb-2">{course.code}</span>
                  </div>

                  <div className="course-details flex-grow-1">
                    <div className="mb-2">
                      <i className="fas fa-user-tie me-2"></i>
                      <small className="text-white-50">{course.instructor}</small>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-calendar me-2"></i>
                      <small className="text-white-50">{course.schedule}</small>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      <small className="text-white-50">{course.room}</small>
                    </div>
                    <div className="mb-3">
                      <i className="fas fa-graduation-cap me-2"></i>
                      <small className="text-white-50">{course.credits} Credits</small>
                    </div>
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
    </div>
  );
};

export default MyCourses;
