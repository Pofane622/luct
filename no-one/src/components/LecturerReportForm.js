// src/components/LecturerReportForm.js
import React, { useState } from "react";

const LecturerReportForm = () => {
  const [formData, setFormData] = useState({
    facultyName: "",
    className: "",
    weekOfReporting: "",
    dateOfLecture: "",
    courseName: "",
    courseCode: "",
    lecturerName: "",
    studentsPresent: "",
    totalRegisteredStudents: "",
    venue: "",
    scheduledTime: "",
    topicTaught: "",
    learningOutcomes: "",
    recommendations: "",
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting report:", formData);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Report submitted successfully!');
        setSubmittedData({...formData});
        setIsSubmitted(true);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Error submitting report. Please try again.');
    }
  };

  const handleNewReport = () => {
    // Reset form completely for new entry
    setFormData({
      facultyName: "",
      className: "",
      weekOfReporting: "",
      dateOfLecture: "",
      courseName: "",
      courseCode: "",
      lecturerName: "",
      studentsPresent: "",
      totalRegisteredStudents: "",
      venue: "",
      scheduledTime: "",
      topicTaught: "",
      learningOutcomes: "",
      recommendations: "",
    });
    setSubmittedData(null);
    setIsSubmitted(false);
  };

  // Display submitted data after successful submission
  if (isSubmitted && submittedData) {
    return React.createElement("div", { className: "container mt-4" },
      React.createElement("div", { className: "card shadow-sm" },
        React.createElement("div", { className: "card-header bg-success text-white" },
          React.createElement("h3", null, "Report Submitted Successfully!")
        ),
        React.createElement("div", { className: "card-body" },
          React.createElement("h4", { className: "mb-4" }, "Submitted Report Details:"),
          
          // Faculty Name
          React.createElement("div", { className: "row mb-3" },
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Faculty Name: "),
              React.createElement("span", null, submittedData.facultyName || "Not provided")
            ),
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Class Name: "),
              React.createElement("span", null, submittedData.className || "Not provided")
            )
          ),
          
          // Week of Reporting and Date of Lecture
          React.createElement("div", { className: "row mb-3" },
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Week of Reporting: "),
              React.createElement("span", null, submittedData.weekOfReporting || "Not provided")
            ),
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Date of Lecture: "),
              React.createElement("span", null, submittedData.dateOfLecture || "Not provided")
            )
          ),
          
          // Course Name and Course Code
          React.createElement("div", { className: "row mb-3" },
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Course Name: "),
              React.createElement("span", null, submittedData.courseName || "Not provided")
            ),
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Course Code: "),
              React.createElement("span", null, submittedData.courseCode || "Not provided")
            )
          ),
          
          // Lecturer's Name and Venue
          React.createElement("div", { className: "row mb-3" },
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Lecturer's Name: "),
              React.createElement("span", null, submittedData.lecturerName || "Not provided")
            ),
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Venue: "),
              React.createElement("span", null, submittedData.venue || "Not provided")
            )
          ),
          
          // Students Present and Total Registered Students
          React.createElement("div", { className: "row mb-3" },
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Students Present: "),
              React.createElement("span", null, submittedData.studentsPresent || "Not provided")
            ),
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Total Registered Students: "),
              React.createElement("span", null, submittedData.totalRegisteredStudents || "Not provided")
            )
          ),
          
          // Scheduled Lecture Time
          React.createElement("div", { className: "row mb-3" },
            React.createElement("div", { className: "col-md-6" },
              React.createElement("strong", null, "Scheduled Lecture Time: "),
              React.createElement("span", null, submittedData.scheduledTime || "Not provided")
            )
          ),
          
          // Topic Taught
          React.createElement("div", { className: "mb-3" },
            React.createElement("strong", null, "Topic Taught: "),
            React.createElement("br"),
            React.createElement("span", null, submittedData.topicTaught || "Not provided")
          ),
          
          // Learning Outcomes
          React.createElement("div", { className: "mb-3" },
            React.createElement("strong", null, "Learning Outcomes: "),
            React.createElement("br"),
            React.createElement("span", { style: { whiteSpace: 'pre-wrap' } }, submittedData.learningOutcomes || "Not provided")
          ),
          
          // Recommendations
          React.createElement("div", { className: "mb-4" },
            React.createElement("strong", null, "Lecturer's Recommendations: "),
            React.createElement("br"),
            React.createElement("span", { style: { whiteSpace: 'pre-wrap' } }, submittedData.recommendations || "Not provided")
          ),
          
          React.createElement("button", {
            type: "button",
            className: "btn btn-primary",
            onClick: handleNewReport
          }, "Submit Another Report")
        )
      )
    );
  }

  // Main form - return the complete form with ALL fields
  return React.createElement("div", { className: "container mt-4" },
    React.createElement("div", { className: "card shadow-sm" },
      React.createElement("div", { className: "card-header bg-primary text-white" },
        React.createElement("h3", null, "Lecturer Report Form")
      ),
      React.createElement("div", { className: "card-body" },
        React.createElement("form", { onSubmit: handleSubmit },
          
          // Faculty Name
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Faculty Name"),
            React.createElement("input", {
              type: "text",
              className: "form-control",
              name: "facultyName",
              value: formData.facultyName,
              onChange: handleChange,
              required: true
            })
          ),

          // Class Name
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Class Name"),
            React.createElement("input", {
              type: "text",
              className: "form-control",
              name: "className",
              value: formData.className,
              onChange: handleChange,
              required: true
            })
          ),

          // Week of Reporting
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Week of Reporting"),
            React.createElement("input", {
              type: "number",
              className: "form-control",
              name: "weekOfReporting",
              value: formData.weekOfReporting,
              onChange: handleChange,
              min: "1",
              max: "15",
              required: true
            })
          ),

          // Date of Lecture
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Date of Lecture"),
            React.createElement("input", {
              type: "date",
              className: "form-control",
              name: "dateOfLecture",
              value: formData.dateOfLecture,
              onChange: handleChange,
              required: true
            })
          ),

          // Course Name
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Course Name"),
            React.createElement("input", {
              type: "text",
              className: "form-control",
              name: "courseName",
              value: formData.courseName,
              onChange: handleChange,
              required: true
            })
          ),

          // Course Code
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Course Code"),
            React.createElement("input", {
              type: "text",
              className: "form-control",
              name: "courseCode",
              value: formData.courseCode,
              onChange: handleChange,
              required: true
            })
          ),

          // Lecturer's Name
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Lecturer's Name"),
            React.createElement("input", {
              type: "text",
              className: "form-control",
              name: "lecturerName",
              value: formData.lecturerName,
              onChange: handleChange,
              required: true
            })
          ),

          // Students Present
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Actual Number of Students Present"),
            React.createElement("input", {
              type: "number",
              className: "form-control",
              name: "studentsPresent",
              value: formData.studentsPresent,
              onChange: handleChange,
              min: "0",
              required: true
            })
          ),

          // Total Registered Students
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Total Number of Registered Students"),
            React.createElement("input", {
              type: "number",
              className: "form-control",
              name: "totalRegisteredStudents",
              value: formData.totalRegisteredStudents,
              onChange: handleChange,
              min: "0",
              required: true
            })
          ),

          // Venue
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Venue of the Class"),
            React.createElement("input", {
              type: "text",
              className: "form-control",
              name: "venue",
              value: formData.venue,
              onChange: handleChange,
              required: true
            })
          ),

          // Scheduled Lecture Time
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Scheduled Lecture Time"),
            React.createElement("input", {
              type: "time",
              className: "form-control",
              name: "scheduledTime",
              value: formData.scheduledTime,
              onChange: handleChange,
              required: true
            })
          ),

          // Topic Taught
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Topic Taught"),
            React.createElement("input", {
              type: "text",
              className: "form-control",
              name: "topicTaught",
              value: formData.topicTaught,
              onChange: handleChange,
              required: true
            })
          ),

          // Learning Outcomes
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Learning Outcomes of the Topic"),
            React.createElement("textarea", {
              className: "form-control",
              rows: "3",
              name: "learningOutcomes",
              value: formData.learningOutcomes,
              onChange: handleChange,
              required: true
            })
          ),

          // Recommendations
          React.createElement("div", { className: "mb-3" },
            React.createElement("label", { className: "form-label" }, "Lecturer's Recommendations"),
            React.createElement("textarea", {
              className: "form-control",
              rows: "4",
              name: "recommendations",
              value: formData.recommendations,
              onChange: handleChange,
              required: true
            })
          ),

          React.createElement("button", { 
            type: "submit", 
            className: "btn btn-success w-100" 
          }, "Submit Report")
        )
      )
    )
  );
};

export default LecturerReportForm;