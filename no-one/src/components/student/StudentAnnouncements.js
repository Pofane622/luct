import React, { useState, useEffect } from 'react';

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/student/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      } else {
        setError('Failed to fetch announcements');
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Network error');
      // Demo data
      setAnnouncements([
        {
          id: 1,
          title: 'Midterm Schedule Posted',
          content: 'The midterm examination schedule for Semester 2 has been published. Please check your student portal for details. All examinations will be conducted in the main hall.',
          priority: 'important',
          category: 'academic',
          date: '2024-03-15',
          author: 'Registrar\'s Office'
        },
        {
          id: 2,
          title: 'Library Extended Hours',
          content: 'During midterm weeks, the main library will remain open until 11 PM from Monday to Thursday. This is to provide additional study space for students.',
          priority: 'info',
          category: 'facilities',
          date: '2024-03-12',
          author: 'University Library'
        },
        {
          id: 3,
          title: 'Career Fair Next Week',
          content: 'Join us for the annual Career Fair on March 20th. Over 50 companies will be present offering internship and job opportunities.',
          priority: 'info',
          category: 'career',
          date: '2024-03-10',
          author: 'Career Services'
        },
        {
          id: 4,
          title: 'System Maintenance Notice',
          content: 'The student portal will be undergoing maintenance on March 18th from 2 AM to 4 AM. Services may be temporarily unavailable during this time.',
          priority: 'warning',
          category: 'technical',
          date: '2024-03-08',
          author: 'IT Department'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'important': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'primary';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'important': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-bell';
    }
  };

  const filteredAnnouncements = filter === 'all'
    ? announcements
    : announcements.filter(a => a.category === filter);

  const categories = [...new Set(announcements.map(a => a.category))];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-light">Loading announcements...</p>
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
    <div className="student-announcements">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-warning mb-0">
          <i className="fas fa-bullhorn me-2"></i>
          Announcements
        </h3>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <span className="badge bg-warning text-dark">
            {filteredAnnouncements.length} Announcement{filteredAnnouncements.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-bullhorn fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No announcements</h5>
          <p className="text-muted">There are no announcements in this category.</p>
        </div>
      ) : (
        <div className="row">
          {filteredAnnouncements.map(announcement => (
            <div key={announcement.id} className="col-12 mb-4">
              <div className="card border-0" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
                <div className="card-body text-white">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <i className={`fas ${getPriorityIcon(announcement.priority)} me-2`}></i>
                        <h5 className="card-title text-white fw-bold mb-0">{announcement.title}</h5>
                        <span className={`badge bg-${getPriorityColor(announcement.priority)} text-white ms-2`}>
                          {announcement.priority}
                        </span>
                      </div>
                      <div className="announcement-meta text-white-50 small mb-2">
                        <i className="fas fa-user me-1"></i>
                        {announcement.author} •
                        <i className="fas fa-calendar ms-2 me-1"></i>
                        {new Date(announcement.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="announcement-content">
                    <p className="text-white mb-3">{announcement.content}</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-white text-dark">
                      {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                    </span>
                    <button className="btn btn-light btn-sm">
                      <i className="fas fa-eye me-2"></i>
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAnnouncements;
