import express from "express";
import cors from "cors";
import { Client } from 'pg';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Simple logger
const logger = {
  info: (message) => console.log(`[INFO] ${new Date().toISOString()} - ${message}`),
  error: (message) => console.error(`[ERROR] ${new Date().toISOString()} - ${message}`),
  warn: (message) => console.warn(`[WARN] ${new Date().toISOString()} - ${message}`)
};

const app = express();
const JWT_SECRET = "your_jwt_secret_key_here";

app.use(cors());
app.use(express.json());

console.log('🔌 Starting server with DATABASE connection attempts...');

// ========== DATABASE CONNECTION ==========
let db = null;
let useDatabase = false;

const connectToPostgreSQL = async () => {
  try {
    console.log('🔄 Attempting PostgreSQL connection...');

    // First, connect to the default 'postgres' database to create our database if needed
    const tempClient = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'pofane',
      database: 'postgres'
    });

    await tempClient.connect();
    console.log('✅ Connected to postgres database for setup');

    // Check if database exists, create if not
    const dbCheck = await tempClient.query(`
      SELECT datname FROM pg_catalog.pg_database
      WHERE datname = 'luct_reporting_system'
    `);

    if (dbCheck.rows.length === 0) {
      await tempClient.query(`CREATE DATABASE luct_reporting_system`);
      console.log('✅ Database luct_reporting_system created');
    } else {
      console.log('✅ Database luct_reporting_system already exists');
    }

    await tempClient.end();

    // Now connect to our specific database
    db = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'pofane',
      database: 'luct_reporting_system'
    });

    await db.connect();
    console.log('🎉 ✅ PostgreSQL DATABASE CONNECTED SUCCESSFULLY!');
    useDatabase = true;

    // Create tables
    await createTables();

  } catch (error) {
    console.log('❌ PostgreSQL connection failed:', error.message);
    console.log('💡 Using demo data storage instead');
  }
};

const createTables = async () => {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fullName VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'lecturer', 'principal_lecturer', 'program_leader')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');

    // Lecturers table (must be created before courses since courses references it)
    await db.query(`
      CREATE TABLE IF NOT EXISTS lecturers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        specialization VARCHAR(100),
        status VARCHAR(20) DEFAULT 'Available',
        courses_assigned INTEGER DEFAULT 0,
        total_students INTEGER DEFAULT 0,
        rating DECIMAL(3,1) DEFAULT 0.0,
        workload VARCHAR(10) DEFAULT '0%',
        availability VARCHAR(20) DEFAULT 'Full-time',
        join_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Lecturers table ready');

    // Courses table
    await db.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        credits INTEGER NOT NULL,
        level VARCHAR(20) NOT NULL,
        semester VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'Planning',
        assigned_lecturer_id INTEGER REFERENCES lecturers(id),
        students_enrolled INTEGER DEFAULT 0,
        rating DECIMAL(3,1) DEFAULT 0.0,
        color VARCHAR(100),
        modules TEXT[],
        prerequisites TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Courses table ready');

    // Lecturer reports table
    await db.query(`
      CREATE TABLE IF NOT EXISTS lecturer_reports (
        id SERIAL PRIMARY KEY,
        faculty_name VARCHAR(100) NOT NULL,
        class_name VARCHAR(100) NOT NULL,
        week_of_reporting INTEGER NOT NULL,
        date_of_lecture DATE NOT NULL,
        course_name VARCHAR(100) NOT NULL,
        course_code VARCHAR(20) NOT NULL,
        lecturer_name VARCHAR(100) NOT NULL,
        students_present INTEGER NOT NULL,
        total_registered_students INTEGER NOT NULL,
        venue VARCHAR(100) NOT NULL,
        scheduled_time TIME NOT NULL,
        topic_taught TEXT NOT NULL,
        learning_outcomes TEXT NOT NULL,
        recommendations TEXT NOT NULL,
        submitted_by INTEGER REFERENCES users(id),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Lecturer reports table ready');

    // Student ratings table
    await db.query(`
      CREATE TABLE IF NOT EXISTS student_ratings (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES users(id),
        course_code VARCHAR(20) NOT NULL,
        course_name VARCHAR(100) NOT NULL,
        lecturer_name VARCHAR(100) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Student ratings table ready');

  } catch (error) {
    console.log('❌ Table creation failed:', error.message);
  }
};

connectToPostgreSQL();

// Demo data storage - Make this a let so we can modify it
let demoUsers = [
  {
    id: 1,
    username: "demo.student",
    password: "$2b$10$Shpm.r/z3wPUFE7oMDrr8ubBc9LdgfaTWoVps/qHGX9m1LH/vHI6G", // password123
    role: "student",
    fullName: "Demo Student",
    email: "demo.student@luct.ac.ls"
  },
  {
    id: 2,
    username: "demo.lecturer",
    password: "$2b$10$Shpm.r/z3wPUFE7oMDrr8ubBc9LdgfaTWoVps/qHGX9m1LH/vHI6G", // password123
    role: "lecturer",
    fullName: "Demo Lecturer",
    email: "demo.lecturer@luct.ac.ls"
  },
  {
    id: 3,
    username: "demo.supervisor",
    password: "$2b$10$Shpm.r/z3wPUFE7oMDrr8ubBc9LdgfaTWoVps/qHGX9m1LH/vHI6G", // password123
    role: "principal_lecturer",
    fullName: "Demo Supervisor",
    email: "demo.supervisor@luct.ac.ls"
  },
  {
    id: 4,
    username: "demo.director",
    password: "$2b$10$Shpm.r/z3wPUFE7oMDrr8ubBc9LdgfaTWoVps/qHGX9m1LH/vHI6G", // password123
    role: "program_leader",
    fullName: "Demo Director",
    email: "demo.director@luct.ac.ls"
  }
];

// Demo courses data - Updated to match student dashboard courses
let demoCourses = [
  {
    id: 1,
    code: "ICT3101",
    name: "Web Development",
    credits: 15,
    level: "Year 3",
    semester: "Semester 1",
    status: "Active",
    assigned_lecturer_id: 1,
    assigned_lecturer_name: "Dr. Thabo Moloi",
    students_enrolled: 45,
    rating: 4.7,
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    modules: ["HTML", "CSS", "JavaScript", "React"],
    prerequisites: ["ICT2101", "ICT2201"]
  },
  {
    id: 2,
    code: "ICT2202",
    name: "Database Systems",
    credits: 12,
    level: "Year 2",
    semester: "Semester 2",
    status: "Active",
    assigned_lecturer_id: 2,
    assigned_lecturer_name: "Ms. Lerato Nkosi",
    students_enrolled: 38,
    rating: 4.5,
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    modules: ["SQL", "NoSQL", "Database Design", "Normalization"],
    prerequisites: ["ICT1201"]
  },
  {
    id: 3,
    code: "ICT3301",
    name: "Software Engineering",
    credits: 15,
    level: "Year 3",
    semester: "Semester 1",
    status: "Active",
    assigned_lecturer_id: 3,
    assigned_lecturer_name: "Prof. David Chen",
    students_enrolled: 42,
    rating: 4.8,
    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    modules: ["SDLC", "Agile", "Testing", "Project Management"],
    prerequisites: ["ICT2301", "ICT2401"]
  },
  {
    id: 4,
    code: "MATH2101",
    name: "Discrete Mathematics",
    credits: 12,
    level: "Year 2",
    semester: "Semester 1",
    status: "Active",
    assigned_lecturer_id: 4,
    assigned_lecturer_name: "Dr. Anna Petrova",
    students_enrolled: 50,
    rating: 4.6,
    color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    modules: ["Logic", "Sets", "Graphs", "Combinatorics"],
    prerequisites: ["MATH1101"]
  }
];

// Demo lecturers data
let demoLecturers = [
  {
    id: 1,
    name: "Dr. Thabo Moloi",
    email: "t.moloi@university.ac.za",
    specialization: "Software Architecture",
    status: "Active",
    courses_assigned: 3,
    total_students: 125,
    rating: 4.7,
    workload: "85%",
    availability: "Full-time",
    join_date: "2020-03-15"
  },
  {
    id: 2,
    name: "Ms. Lerato Nkosi",
    email: "l.nkosi@university.ac.za",
    specialization: "Database Systems",
    status: "Active",
    courses_assigned: 2,
    total_students: 80,
    rating: 4.5,
    workload: "70%",
    availability: "Full-time",
    join_date: "2021-08-22"
  },
  {
    id: 3,
    name: "Dr. James Wilson",
    email: "j.wilson@university.ac.za",
    specialization: "Machine Learning",
    status: "Available",
    courses_assigned: 1,
    total_students: 35,
    rating: 4.8,
    workload: "45%",
    availability: "Part-time",
    join_date: "2019-11-30"
  },
  {
    id: 4,
    name: "Prof. Sarah Johnson",
    email: "s.johnson@university.ac.za",
    specialization: "Cybersecurity",
    status: "Active",
    courses_assigned: 4,
    total_students: 98,
    rating: 4.9,
    workload: "90%",
    availability: "Full-time",
    join_date: "2018-01-15"
  },
  {
    id: 5,
    name: "Mr. David Brown",
    email: "d.brown@university.ac.za",
    specialization: "Computer Networks",
    status: "Active",
    courses_assigned: 2,
    total_students: 67,
    rating: 4.4,
    workload: "65%",
    availability: "Full-time",
    join_date: "2022-02-10"
  }
];

// Debug endpoint to see all demo users
app.get("/api/debug-users", (req, res) => {
  logger.info(`Request received: ${req.method} ${req.path}`);
  console.log("📋 Debug users endpoint called");
  res.json({
    totalUsers: demoUsers.length,
    users: demoUsers.map(u => ({ 
      id: u.id, 
      username: u.username, 
      role: u.role,
      email: u.email,
      passwordLength: u.password.length,
      passwordPreview: u.password.substring(0, 20) + '...'
    }))
  });
});

// Registration endpoint
app.post("/api/register", async (req, res) => {
  logger.info(`Request received: ${req.method} ${req.path}`);
  const { username, email, password, fullName, role } = req.body;
  console.log("📝 Registration attempt:", username);

  if (!username || !email || !password || !fullName || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed for new user");

    if (useDatabase && db) {
      console.log('💾 Registering user in PostgreSQL database...');

      // Check if user exists in database
      const existingUser = await db.query(
        'SELECT id FROM users WHERE username = $1 OR email = $2',
        [username, email]
      );

      if (existingUser.rows.length > 0) {
        console.log('❌ User already exists:', username);
        return res.status(400).json({ error: "Username or email already exists" });
      }

      // Insert new user
      const result = await db.query(
        'INSERT INTO users (username, email, password, fullName, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [username, email, hashedPassword, fullName, role]
      );

      console.log('🎉 ✅ User registered in PostgreSQL! New user:', username);
      console.log('🆔 User ID:', result.rows[0].id);

      res.json({
        message: "Registration successful!",
        user: { id: result.rows[0].id, username, email, fullName, role }
      });
    } else {
      console.log('💾 Registering user in DEMO storage...');

      // Check if user exists in demo
      const existingUser = demoUsers.find(u => u.username === username || u.email === email);
      if (existingUser) {
        console.log('❌ User already exists:', username);
        return res.status(400).json({ error: "Username or email already exists" });
      }

      // Add to demo storage
      const newUser = {
        id: Date.now(),
        username,
        email,
        password: hashedPassword,
        fullName,
        role
      };
      demoUsers.push(newUser);

      console.log('🎉 ✅ User registered in DEMO! New user:', username);
      console.log('📊 Total demo users now:', demoUsers.length);
      console.log('🔑 Stored password hash:', hashedPassword.substring(0, 20) + '...');

      res.json({
        message: "Registration successful!",
        user: { id: newUser.id, username, email, fullName, role }
      });
    }
  } catch (error) {
    console.log('❌ Registration error:', error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login endpoint - FIXED to properly check demo users
app.post("/api/login", async (req, res) => {
  logger.info(`Request received: ${req.method} ${req.path}`);
  const { username, password } = req.body;
  console.log("🔐 Login attempt:", username);

  try {
    if (useDatabase && db) {
      console.log('💾 Attempting login from PostgreSQL database...');

      // Find user in database
      const result = await db.query(
        'SELECT id, username, email, password, fullName, role FROM users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        console.log('❌ User not found in database:', username);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = result.rows[0];
      console.log('✅ User found:', user.username);
      console.log('🔑 Stored hash:', user.password.substring(0, 20) + '...');

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('🔐 Password comparison result:', isValidPassword);

      if (!isValidPassword) {
        console.log('❌ Invalid password for user:', username);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('🎉 ✅ Login successful from PostgreSQL! User:', user.username, 'Role:', user.role);
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      });
    } else {
      console.log('💾 Attempting login from DEMO storage...');
      console.log("📊 Total demo users available:", demoUsers.length);

      // Find user in demo data
      const user = demoUsers.find(u => u.username === username);

      if (!user) {
        console.log('❌ User not found in demo data:', username);
        console.log('📋 Available users:', demoUsers.map(u => u.username));
        return res.status(401).json({ error: "Invalid credentials" });
      }

      console.log('✅ User found:', user.username);
      console.log('🔑 Stored hash:', user.password.substring(0, 20) + '...');

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('🔐 Password comparison result:', isValidPassword);

      if (!isValidPassword) {
        console.log('❌ Invalid password for user:', username);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('🎉 ✅ Login successful from DEMO! User:', user.username, 'Role:', user.role);
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        }
      });
    }
  } catch (error) {
    console.log('❌ Login error:', error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Verify token endpoint
app.post("/api/verify-token", (req, res) => {
  logger.info(`Request received: ${req.method} ${req.path}`);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified for user:', decoded.username);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Submit report endpoint
app.post("/api/submit-report", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      const {
        facultyName,
        className,
        weekOfReporting,
        dateOfLecture,
        courseName,
        courseCode,
        lecturerName,
        studentsPresent,
        totalRegisteredStudents,
        venue,
        scheduledTime,
        topicTaught,
        learningOutcomes,
        recommendations
      } = req.body;

      const result = await db.query(
        `INSERT INTO lecturer_reports (
          faculty_name, class_name, week_of_reporting, date_of_lecture,
          course_name, course_code, lecturer_name, students_present,
          total_registered_students, venue, scheduled_time, topic_taught,
          learning_outcomes, recommendations, submitted_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
        [
          facultyName, className, weekOfReporting, dateOfLecture,
          courseName, courseCode, lecturerName, studentsPresent,
          totalRegisteredStudents, venue, scheduledTime, topicTaught,
          learningOutcomes, recommendations, decoded.id
        ]
      );

      console.log('📝 Report submitted to PostgreSQL, ID:', result.rows[0].id);
      res.json({ message: "Report submitted successfully!", reportId: result.rows[0].id });
    } else {
      console.log('💾 Report submission logged (demo mode):', req.body);
      res.json({ message: "Report submitted successfully! (Demo mode)" });
    }
  } catch (error) {
    console.log('❌ Report submission error:', error);
    res.status(500).json({ error: "Report submission failed" });
  }
});

// Submit rating endpoint
app.post("/api/submit-rating", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      const { courseCode, courseName, lecturerName, rating, comment } = req.body;

      // Ensure student_id is an integer
      const studentId = parseInt(decoded.id);

      const result = await db.query(
        `INSERT INTO student_ratings (student_id, course_code, course_name, lecturer_name, rating, comment)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [studentId, courseCode, courseName, lecturerName, rating, comment]
      );

      console.log('⭐ Rating submitted to PostgreSQL, ID:', result.rows[0].id);
      res.json({ message: "Rating submitted successfully!", ratingId: result.rows[0].id });
    } else {
      console.log('💾 Rating submission logged (demo mode):', req.body);
      res.json({ message: "Rating submitted successfully! (Demo mode)" });
    }
  } catch (error) {
    console.log('❌ Rating submission error:', error);
    res.status(500).json({ error: "Rating submission failed" });
  }
});

// Get lecturer reports endpoint
app.get("/api/lecturer-reports", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    if (useDatabase && db) {
      const result = await db.query(
        `SELECT lr.*, u.fullName as submitted_by_name
         FROM lecturer_reports lr
         JOIN users u ON lr.submitted_by = u.id
         ORDER BY lr.submitted_at DESC`
      );

      console.log('📋 Retrieved lecturer reports:', result.rows.length);
      logger.info(`Request received: ${req.method} ${req.path}`);
      res.json({ reports: result.rows });
    } else {
      console.log('💾 Lecturer reports requested (demo mode)');
      res.json({ reports: [] });
    }
  } catch (error) {
    console.log('❌ Error fetching lecturer reports:', error);
    res.status(500).json({ error: "Failed to fetch lecturer reports" });
  }
});

// Get student ratings endpoint
app.get("/api/student-ratings", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      const result = await db.query(
        `SELECT sr.*, u.fullName as student_name
         FROM student_ratings sr
         JOIN users u ON sr.student_id = u.id
         ORDER BY sr.rated_at DESC`
      );

      console.log('⭐ Retrieved student ratings:', result.rows.length);
      res.json({ ratings: result.rows });
    } else {
      console.log('💾 Student ratings requested (demo mode)');
      res.json({ ratings: [] });
    }
  } catch (error) {
    console.log('❌ Error fetching student ratings:', error);
    res.status(500).json({ error: "Failed to fetch student ratings" });
  }
});

// Get ratings for a specific lecturer
app.get("/api/my-ratings", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      // Get lecturer's full name from users table
      const lecturerResult = await db.query(
        'SELECT fullName FROM users WHERE id = $1',
        [decoded.id]
      );

      if (lecturerResult.rows.length === 0) {
        return res.status(404).json({ error: "Lecturer not found" });
      }

      const lecturerName = lecturerResult.rows[0].fullname;

      // Get ratings for this lecturer
      const ratingsResult = await db.query(
        `SELECT sr.*, u.fullName as student_name
         FROM student_ratings sr
         JOIN users u ON sr.student_id = u.id
         WHERE sr.lecturer_name = $1
         ORDER BY sr.rated_at DESC`,
        [lecturerName]
      );

      console.log('⭐ Retrieved ratings for lecturer:', lecturerName, 'Count:', ratingsResult.rows.length);
      res.json({ ratings: ratingsResult.rows });
    } else {
      console.log('💾 Lecturer ratings requested (demo mode)');
      res.json({ ratings: [] });
    }
  } catch (error) {
    console.log('❌ Error fetching lecturer ratings:', error);
    res.status(500).json({ error: "Failed to fetch lecturer ratings" });
  }
});

// ========== COURSES ENDPOINTS ==========

// Get all courses
app.get("/api/courses", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    if (useDatabase && db) {
      const result = await db.query(
        `SELECT c.*, l.name as assigned_lecturer_name
         FROM courses c
         LEFT JOIN lecturers l ON c.assigned_lecturer_id = l.id
         ORDER BY c.created_at DESC`
      );

      console.log('📚 Retrieved courses:', result.rows.length);
      logger.info(`Request received: ${req.method} ${req.path}`);
      res.json({ courses: result.rows });
    } else {
      console.log('💾 Courses requested (demo mode)');
      res.json({ courses: demoCourses });
    }
  } catch (error) {
    console.log('❌ Error fetching courses:', error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// Create a new course
app.post("/api/courses", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      const { code, name, credits, level, semester, modules, prerequisites } = req.body;

      // Check if course code already exists
      const existingCourse = await db.query(
        'SELECT id FROM courses WHERE code = $1',
        [code]
      );

      if (existingCourse.rows.length > 0) {
        return res.status(400).json({ error: "Course code already exists" });
      }

      const result = await db.query(
        `INSERT INTO courses (code, name, credits, level, semester, modules, prerequisites)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [code, name, credits, level, semester, modules || [], prerequisites || []]
      );

      console.log('📚 Course created in PostgreSQL, ID:', result.rows[0].id);
      res.json({ message: "Course created successfully!", courseId: result.rows[0].id });
    } else {
      // Demo mode: actually add to demoCourses array
      const { code, name, credits, level, semester, modules, prerequisites } = req.body;

      // Check if course code already exists
      const existingCourse = demoCourses.find(c => c.code === code);
      if (existingCourse) {
        return res.status(400).json({ error: "Course code already exists" });
      }

      const newCourse = {
        id: Date.now(), // Simple ID generation for demo
        code,
        name,
        credits: parseInt(credits),
        level,
        semester,
        status: 'Planning',
        assigned_lecturer_id: null,
        assigned_lecturer_name: null,
        students_enrolled: 0,
        rating: 0,
        color: "linear-gradient(135deg, #" + Math.floor(Math.random()*16777215).toString(16) + " 0%, #" + Math.floor(Math.random()*16777215).toString(16) + " 100%)",
        modules: modules || [],
        prerequisites: prerequisites || []
      };

      demoCourses.push(newCourse);
      console.log('📚 Course added to demo data, ID:', newCourse.id);
      res.json({ message: "Course created successfully!", courseId: newCourse.id });
    }
  } catch (error) {
    console.log('❌ Course creation error:', error);
    res.status(500).json({ error: "Course creation failed" });
  }
});

// Update a course
app.put("/api/courses/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const courseId = req.params.id;
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      const { code, name, credits, level, semester, status, modules, prerequisites } = req.body;

      const result = await db.query(
        `UPDATE courses
         SET code = $1, name = $2, credits = $3, level = $4, semester = $5,
             status = $6, modules = $7, prerequisites = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = $9 RETURNING id`,
        [code, name, credits, level, semester, status, modules || [], prerequisites || [], courseId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      console.log('📚 Course updated in PostgreSQL, ID:', result.rows[0].id);
      res.json({ message: "Course updated successfully!" });
    } else {
      // Demo mode: actually update the course in demoCourses array
      const courseIndex = demoCourses.findIndex(c => c.id.toString() === courseId);
      if (courseIndex === -1) {
        return res.status(404).json({ error: "Course not found" });
      }

      const { code, name, credits, level, semester, status, modules, prerequisites } = req.body;

      // Check if new code conflicts with existing courses (excluding current one)
      const existingCourse = demoCourses.find(c => c.code === code && c.id.toString() !== courseId);
      if (existingCourse) {
        return res.status(400).json({ error: "Course code already exists" });
      }

      demoCourses[courseIndex] = {
        ...demoCourses[courseIndex],
        code,
        name,
        credits: parseInt(credits),
        level,
        semester,
        status,
        modules: modules || [],
        prerequisites: prerequisites || []
      };

      console.log('📚 Course updated in demo data, ID:', courseId);
      res.json({ message: "Course updated successfully!" });
    }
  } catch (error) {
    console.log('❌ Course update error:', error);
    res.status(500).json({ error: "Course update failed" });
  }
});

// Delete a course
app.delete("/api/courses/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const courseId = req.params.id;
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      const result = await db.query(
        'DELETE FROM courses WHERE id = $1 RETURNING id',
        [courseId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      console.log('📚 Course deleted from PostgreSQL, ID:', result.rows[0].id);
      res.json({ message: "Course deleted successfully!" });
    } else {
      // Demo mode: actually remove the course from demoCourses array
      const courseIndex = demoCourses.findIndex(c => c.id.toString() === courseId);
      if (courseIndex === -1) {
        return res.status(404).json({ error: "Course not found" });
      }

      demoCourses.splice(courseIndex, 1);
      console.log('📚 Course deleted from demo data, ID:', courseId);
      res.json({ message: "Course deleted successfully!" });
    }
  } catch (error) {
    console.log('❌ Course deletion error:', error);
    res.status(500).json({ error: "Course deletion failed" });
  }
});

// Assign lecturer to course
app.post("/api/courses/:id/assign/:lecturerId", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const courseId = req.params.id;
    const lecturerId = req.params.lecturerId;
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      // Update course assignment
      const courseResult = await db.query(
        'UPDATE courses SET assigned_lecturer_id = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id',
        [lecturerId, 'Active', courseId]
      );

      if (courseResult.rows.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Update lecturer's course count
      await db.query(
        'UPDATE lecturers SET courses_assigned = courses_assigned + 1 WHERE id = $1',
        [lecturerId]
      );

      console.log('👨‍🏫 Lecturer assigned to course:', courseId, 'Lecturer:', lecturerId);
      res.json({ message: "Lecturer assigned successfully!" });
    } else {
      // Demo mode: actually update the course assignment in demoCourses array
      const courseIndex = demoCourses.findIndex(c => c.id.toString() === courseId);
      if (courseIndex === -1) {
        return res.status(404).json({ error: "Course not found" });
      }

      const lecturerIndex = demoLecturers.findIndex(l => l.id.toString() === lecturerId);
      if (lecturerIndex === -1) {
        return res.status(404).json({ error: "Lecturer not found" });
      }

      demoCourses[courseIndex] = {
        ...demoCourses[courseIndex],
        assigned_lecturer_id: parseInt(lecturerId),
        assigned_lecturer_name: demoLecturers[lecturerIndex].name,
        status: 'Active'
      };

      // Update lecturer's course count
      demoLecturers[lecturerIndex].courses_assigned += 1;

      console.log('👨‍🏫 Lecturer assigned to course in demo data:', courseId, 'Lecturer:', lecturerId);
      res.json({ message: "Lecturer assigned successfully!" });
    }
  } catch (error) {
    console.log('❌ Lecturer assignment error:', error);
    res.status(500).json({ error: "Lecturer assignment failed" });
  }
});

// ========== LECTURERS ENDPOINTS ==========

// Get all lecturers
app.get("/api/lecturers", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    if (useDatabase && db) {
      const result = await db.query(
        'SELECT * FROM lecturers ORDER BY created_at DESC'
      );

      console.log('👨‍🏫 Retrieved lecturers:', result.rows.length);
      logger.info(`Request received: ${req.method} ${req.path}`);
      res.json({ lecturers: result.rows });
    } else {
      console.log('💾 Lecturers requested (demo mode)');
      res.json({ lecturers: demoLecturers });
    }
  } catch (error) {
    console.log('❌ Error fetching lecturers:', error);
    res.status(500).json({ error: "Failed to fetch lecturers" });
  }
});

// Create a new lecturer
app.post("/api/lecturers", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      const { name, email, specialization, availability, joinDate } = req.body;

      // Check if lecturer email already exists
      const existingLecturer = await db.query(
        'SELECT id FROM lecturers WHERE email = $1',
        [email]
      );

      if (existingLecturer.rows.length > 0) {
        return res.status(400).json({ error: "Lecturer email already exists" });
      }

      const result = await db.query(
        `INSERT INTO lecturers (name, email, specialization, availability, join_date)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [name, email, specialization, availability, joinDate]
      );

      console.log('👨‍🏫 Lecturer created in PostgreSQL, ID:', result.rows[0].id);
      res.json({ message: "Lecturer created successfully!", lecturerId: result.rows[0].id });
    } else {
      console.log('💾 Lecturer creation logged (demo mode):', req.body);
      res.json({ message: "Lecturer created successfully! (Demo mode)" });
    }
  } catch (error) {
    console.log('❌ Lecturer creation error:', error);
    res.status(500).json({ error: "Lecturer creation failed" });
  }
});

// Update a lecturer
app.put("/api/lecturers/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const lecturerId = req.params.id;
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      const { name, email, specialization, status, workload, availability } = req.body;

      const result = await db.query(
        `UPDATE lecturers
         SET name = $1, email = $2, specialization = $3, status = $4,
             workload = $5, availability = $6, updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 RETURNING id`,
        [name, email, specialization, status, workload, availability, lecturerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Lecturer not found" });
      }

      console.log('👨‍🏫 Lecturer updated in PostgreSQL, ID:', result.rows[0].id);
      res.json({ message: "Lecturer updated successfully!" });
    } else {
      console.log('💾 Lecturer update logged (demo mode):', req.body);
      res.json({ message: "Lecturer updated successfully! (Demo mode)" });
    }
  } catch (error) {
    console.log('❌ Lecturer update error:', error);
    res.status(500).json({ error: "Lecturer update failed" });
  }
});

// Delete a lecturer
app.delete("/api/lecturers/:id", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const lecturerId = req.params.id;
    logger.info(`Request received: ${req.method} ${req.path}`);

    if (useDatabase && db) {
      const result = await db.query(
        'DELETE FROM lecturers WHERE id = $1 RETURNING id',
        [lecturerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Lecturer not found" });
      }

      console.log('👨‍🏫 Lecturer deleted from PostgreSQL, ID:', result.rows[0].id);
      res.json({ message: "Lecturer deleted successfully!" });
    } else {
      console.log('💾 Lecturer deletion logged (demo mode):', lecturerId);
      res.json({ message: "Lecturer deleted successfully! (Demo mode)" });
    }
  } catch (error) {
    console.log('❌ Lecturer deletion error:', error);
    res.status(500).json({ error: "Lecturer deletion failed" });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  logger.info(`Request received: ${req.method} ${req.path}`);
  res.json({
    message: "🚀 Server is running!",
    database: useDatabase ? "CONNECTED to PostgreSQL" : "Using DEMO data",
    totalDemoUsers: demoUsers.length,
    timestamp: new Date().toISOString()
  });
});

// Try different ports starting from 5000
const startServer = (port = 5000) => {
  const server = app.listen(port, () => {
    console.log(`✅ LUCT Backend running on http://localhost:${port}`);
    console.log("🔐 Authentication system ready");
    console.log("📧 Demo accounts available:");
    console.log("   👨‍🎓 demo.student / password123");
    console.log("   👨‍🏫 demo.lecturer / password123");
    console.log("   👨‍💼 demo.supervisor / password123");
    console.log("   👩‍💼 demo.director / password123");
    console.log(`📊 Currently ${demoUsers.length} users in demo data`);
    console.log(`🔍 Debug endpoint: http://localhost:${port}/api/debug-users`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.log('❌ Server error:', err);
    }
  });
};

// Start the server
startServer();