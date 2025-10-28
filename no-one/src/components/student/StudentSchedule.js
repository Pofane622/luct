import React, { useState, useEffect } from 'react';

const StudentSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState('all');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/schedule', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSchedule(data.schedule || []);
      } else {
        setError('Failed to fetch schedule');
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError('Network error');
      // Demo data
      setSchedule([
        {
          id: 1,
          course: 'Software Engineering',
          code: 'SE301',
          day: 'Monday',
          time: '10:00 - 11:30',
          room: 'Lab A',
          instructor: 'Dr. Sarah Johnson',
          type: 'Lecture'
        },
        {
          id: 2,
          course: 'Database Systems',
          code: 'DB201',
          day: 'Tuesday',
          time: '14:00 - 15:30',
          room: 'Room 205',
          instructor: 'Prof. Michael Chen',
          type: 'Lecture'
        },
        {
          id: 3,
          course: 'Web Development',
          code: 'WD101',
          day: 'Friday',
          time: '09:00 - 12:00',
          room: 'Lab B',
          instructor: 'Ms. Emily Davis',
          type: 'Practical'
        },
        {
          id: 4,
          course: 'Software Engineering',
          code: 'SE301',
          day: 'Wednesday',
          time: '10:00 - 11:30',
          room: 'Lab A',
          instructor: 'Dr. Sarah Johnson',
          type: 'Lecture'
        },
        {
          id: 5,
          course: 'Database Systems',
          code: 'DB201',
          day: 'Thursday',
          time: '14:00 - 15:30',
          room: 'Room 205',
          instructor: 'Prof. Michael Chen',
          type: 'Lecture'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const filteredSchedule = selectedDay === 'all'
    ? schedule
    : schedule.filter(s => s.day === selectedDay);

  const getTypeColor = (type) => {
    return type === 'Lecture' ? 'primary' : 'success';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-light">Loading your schedule...</p>
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
    <div className="student-schedule">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-warning mb-0">
          <i className="fas fa-calendar-alt me-2"></i>
          Class Schedule
        </h3>
        <select
          className="form-select form-select-sm w-auto"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          <option value="all">All Days</option>
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {filteredSchedule.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No classes scheduled</h5>
          <p className="text-muted">
            {selectedDay === 'all' ? 'You have no classes this week.' : `No classes on ${selectedDay}.`}
          </p>
        </div>
      ) : (
        <div className="row">
          {filteredSchedule.map(item => (
            <div key={item.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-0" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
                <div className="card-body text-white d-flex flex-column">
                  <div className="mb-3">
                    <h5 className="card-title text-white fw-bold">{item.course}</h5>
                    <div className="d-flex gap-2 mb-2">
                      <span className="badge bg-white text-dark">{item.code}</span>
                      <span className={`badge bg-${getTypeColor(item.type)} text-white`}>
                        {item.type}
                      </span>
                    </div>
                  </div>

                  <div className="schedule-details flex-grow-1">
                    <div className="mb-2">
                      <i className="fas fa-calendar-day me-2"></i>
                      <strong className="text-white">{item.day}</strong>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-clock me-2"></i>
                      <span className="text-white-50">{item.time}</span>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      <span className="text-white-50">{item.room}</span>
                    </div>
                    <div className="mb-3">
                      <i className="fas fa-user-tie me-2"></i>
                      <small className="text-white-50">{item.instructor}</small>
                    </div>
                  </div>

                  <button className="btn btn-light btn-sm w-100 mt-auto">
                    <i className="fas fa-bell me-2"></i>
                    Set Reminder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Weekly Overview */}
      <div className="mt-5">
        <h4 className="text-warning mb-3">
          <i className="fas fa-chart-line me-2"></i>
          Weekly Overview
        </h4>
        <div className="row">
          {days.map(day => {
            const dayClasses = schedule.filter(s => s.day === day);
            return (
              <div key={day} className="col-md-2 mb-3">
                <div className="card text-center border-0 bg-secondary">
                  <div className="card-body py-3">
                    <h6 className="text-warning mb-1">{day.slice(0, 3)}</h6>
                    <div className="fs-4 fw-bold text-light">{dayClasses.length}</div>
                    <small className="text-muted">classes</small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule;
