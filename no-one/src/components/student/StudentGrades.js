import React, { useState, useEffect } from 'react';

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('all');

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/grades', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGrades(data.grades || []);
      } else {
        setError('Failed to fetch grades');
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
      setError('Network error');
      // Demo data
      setGrades([
        {
          id: 1,
          course: 'Software Engineering',
          code: 'SE301',
          grade: 'A',
          points: 4.0,
          semester: 'Semester 2, 2024',
          credits: 3,
          status: 'Completed'
        },
        {
          id: 2,
          course: 'Database Systems',
          code: 'DB201',
          grade: 'B+',
          points: 3.5,
          semester: 'Semester 2, 2024',
          credits: 3,
          status: 'Completed'
        },
        {
          id: 3,
          course: 'Web Development',
          code: 'WD101',
          grade: 'A-',
          points: 3.7,
          semester: 'Semester 1, 2024',
          credits: 2,
          status: 'Completed'
        },
        {
          id: 4,
          course: 'Data Structures',
          code: 'DS202',
          grade: 'In Progress',
          points: null,
          semester: 'Semester 2, 2024',
          credits: 3,
          status: 'In Progress'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade === 'In Progress') return 'secondary';
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'primary';
    if (grade.startsWith('C')) return 'warning';
    if (grade.startsWith('D') || grade.startsWith('F')) return 'danger';
    return 'secondary';
  };

  const calculateGPA = () => {
    const completedGrades = grades.filter(g => g.status === 'Completed' && g.points);
    if (completedGrades.length === 0) return 0;

    const totalPoints = completedGrades.reduce((sum, g) => sum + (g.points * g.credits), 0);
    const totalCredits = completedGrades.reduce((sum, g) => sum + g.credits, 0);

    return (totalPoints / totalCredits).toFixed(2);
  };

  const filteredGrades = selectedSemester === 'all'
    ? grades
    : grades.filter(g => g.semester === selectedSemester);

  const semesters = [...new Set(grades.map(g => g.semester))];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-light">Loading your grades...</p>
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
    <div className="student-grades">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-warning mb-0">
          <i className="fas fa-chart-bar me-2"></i>
          Grades & Performance
        </h3>
        <div className="d-flex align-items-center gap-3">
          <div className="text-center">
            <div className="fs-4 fw-bold text-success">{calculateGPA()}</div>
            <small className="text-muted">Current GPA</small>
          </div>
          <select
            className="form-select form-select-sm"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="all">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredGrades.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No grades available</h5>
          <p className="text-muted">Your grades will appear here once they are posted.</p>
        </div>
      ) : (
        <div className="row">
          {filteredGrades.map(grade => (
            <div key={grade.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-0" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
                <div className="card-body text-white d-flex flex-column">
                  <div className="mb-3">
                    <h5 className="card-title text-white fw-bold">{grade.course}</h5>
                    <span className="badge bg-white text-dark mb-2">{grade.code}</span>
                  </div>

                  <div className="grade-display text-center mb-3">
                    <div className={`grade-badge badge bg-${getGradeColor(grade.grade)} fs-4 px-3 py-2`}>
                      {grade.grade}
                    </div>
                    {grade.points && (
                      <small className="text-white-50 d-block mt-1">
                        {grade.points} points
                      </small>
                    )}
                  </div>

                  <div className="grade-details flex-grow-1">
                    <div className="mb-2">
                      <i className="fas fa-calendar me-2"></i>
                      <small className="text-white-50">{grade.semester}</small>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-graduation-cap me-2"></i>
                      <small className="text-white-50">{grade.credits} Credits</small>
                    </div>
                    <div className="mb-3">
                      <span className={`badge bg-${grade.status === 'Completed' ? 'success' : 'warning'} text-white`}>
                        {grade.status}
                      </span>
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

export default StudentGrades;
