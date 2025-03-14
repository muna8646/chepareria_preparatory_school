require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL DB Pool Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Muna21/06058#",
  database: process.env.DB_NAME || "chepareria_preparatory_school",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  }
});

const upload = multer({ storage: storage });

// Request Logging Middleware (Debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});

// JWT Middleware to verify tokens
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(' ')[1]; // Remove "Bearer " prefix

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token." });
    }
    req.user = decoded;
    next();
  });
};

// Auto-create default admin user if none exists
const createDefaultAdmin = async () => {
  try {
    const conn = await db.getConnection();

    // Optional: Set to true to forcefully recreate the admin
    const forceCreateAdmin = false;

    // Check for existing admin users
    const [admins] = await conn.execute(
      "SELECT id FROM chepareria_users WHERE role = 'admin'"
    );

    if (admins.length === 0 || forceCreateAdmin) {
      const defaultUsername = "admin";
      const defaultEmail = "admin@chepareria.com";
      const defaultPassword = "admin123";

      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      if (forceCreateAdmin && admins.length > 0) {
        // Delete existing admins if forcing
        await conn.execute("DELETE FROM chepareria_users WHERE role = 'admin'");
        console.log("⚠️ Existing admin users deleted.");
      }

      const [result] = await conn.execute(
        `INSERT INTO chepareria_users (username, email, password, role) 
         VALUES (?, ?, ?, ?)`,
        [defaultUsername, defaultEmail, hashedPassword, "admin"]
      );

      const adminId = result.insertId;

      console.log("✅ Default admin user created!");
      console.log(`   ➤ Username: ${defaultUsername}`);
      console.log(`   ➤ Email: ${defaultEmail}`);
      console.log(`   ➤ Password: ${defaultPassword}`);
      console.log(`   ➤ ID: ${adminId}`);
    } else {
      console.log("✅ Admin user already exists in the system.");
    }

    conn.release();
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
};

// Register User Route
app.post("/register", async (req, res) => {
  const conn = await db.getConnection();

  try {
    const {
      username,
      email,
      password,
      role,
      full_name,
      admission_number,
      phone_number,
      national_id,
      address,
      specialization,
      qualification,
      date_of_hire,
      parent_id,
      student_id,
      class_id,
    } = req.body;

    // Ensure required fields are present
    if (!username || !role || !password) {
      return res.status(400).json({
        message: "Username, role, and password are required."
      });
    }

    // Convert role to lowercase for consistency
    const userRole = role.toLowerCase();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into chepareria_users
    const [userResult] = await conn.execute(
      `INSERT INTO chepareria_users (username, email, password, role) 
       VALUES (?, ?, ?, ?)`,
      [username, email || null, hashedPassword, userRole]
    );

    const userId = userResult.insertId;

    console.log(`✅ New user registered in chepareria_users with ID ${userId} and role ${userRole}`);

    // Switch to insert into role-specific table
    switch (userRole) {
      case "admin":
        console.log(`✅ Admin '${username}' registered.`);
        break;

      case "teacher":
        console.log(`✅ Teacher '${username}' being added to teachers table.`);
        await conn.execute(
          `INSERT INTO teachers 
            (id, full_name, phone_number, national_id, address, specialization, qualification, date_of_hire)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            full_name,
            phone_number,
            national_id,
            address,
            specialization,
            qualification,
            date_of_hire
          ]
        );
        break;

      case "student":
        console.log(`✅ Student '${username}' being added to students table.`);
        await conn.execute(
          `INSERT INTO students 
            (id, full_name, admission_number, class_id, parent_id) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            userId,
            full_name,
            admission_number,
            class_id || null,
            parent_id || null
          ]
        );
        break;

      case "parent":
        console.log(`✅ Parent '${username}' being added to parents table.`);
        await conn.execute(
          `INSERT INTO parents 
            (id, full_name, phone_number, national_id, student_id) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            userId,
            full_name,
            phone_number,
            national_id,
            student_id || null
          ]
        );
        break;

      case "secretary":
        console.log(`✅ Secretary '${username}' being added to secretaries table.`);
        await conn.execute(
          `INSERT INTO secretaries 
            (id, full_name, phone_number, national_id, address, date_of_hire)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            userId,
            full_name,
            phone_number,
            national_id,
            address,
            date_of_hire
          ]
        );
        break;

      default:
        console.log(`❌ Invalid role provided: ${role}`);
        return res.status(400).json({ message: "Invalid role provided." });
    }

    res.status(201).json({ message: `${role} registered successfully.` });

  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  } finally {
    conn.release();
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required." });
    }

    const conn = await db.getConnection();

    // Fetch user by email or username
    const [users] = await conn.execute(
      "SELECT * FROM chepareria_users WHERE email = ? OR username = ?",
      [identifier, identifier]
    );

    conn.release();

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = users[0];
    console.log("✅ User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Convert role to lowercase for validation
    const userRole = user.role.toLowerCase();

    // Validate the role
    const validRoles = ["admin", "teacher", "parent", "student", "secretary"];
    if (!validRoles.includes(userRole)) {
      console.error("❌ Invalid role in database:", userRole);
      return res.status(400).json({ message: "Invalid role detected." });
    }

    const token = jwt.sign(
      { id: user.id, role: userRole }, // Use lowercase role
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: userRole // Return lowercase role
      },
      redirectUrl: getRedirectUrl(userRole)
    });

    console.log("✅ Login successful for user:", user.username);

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Function to get redirect URL based on role
function getRedirectUrl(role) {
  switch (role) {
    case "admin":
      return "/AdminDashboard";
    case "teacher":
      return "/TeacherDashboard";
    case "parent":
      return "/parent/dashboard";
    case "student":
      return "/student/dashboard";
    case "secretary":
      return "/secretary/dashboard";
    default:
      return "/";
  }
}

// Protected Routes (Examples)
app.get("/students", verifyToken, async (req, res) => {
  try {
    const [students] = await db.execute(`
      SELECT s.*, u.username 
      FROM students s
      JOIN chepareria_users u ON s.id = u.id
    `);
    res.json(students);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.get("/teachers", verifyToken, async (req, res) => {
  try {
    const [teachers] = await db.execute(`
      SELECT 
        t.*, 
        u.username, 
        u.email,
        u.role 
      FROM teachers t
      JOIN chepareria_users u ON t.id = u.id
      WHERE u.role = 'teacher'
    `);    
    res.json(teachers);
  } catch (error) {
    console.error("❌ Error fetching teachers:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.get("/parents", verifyToken, async (req, res) => {
  try {
    const [parents] = await db.execute(`
      SELECT p.*, u.username 
      FROM parents p
      JOIN chepareria_users u ON p.id = u.id
    `);
    res.json(parents);
  } catch (error) {
    console.error("❌ Error fetching parents:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.get("/teacher/classes", verifyToken, async (req, res) => {
  try {
    const [classes] = await db.execute(
      `SELECT * FROM classes WHERE teacher_id = ?`,
      [req.user.id]
    );
    res.json(classes);
  } catch (error) {
    console.error("❌ Error fetching classes:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.get("/announcements", verifyToken, async (req, res) => {
  try {
    const [announcements] = await db.execute(
      `SELECT * FROM announcements ORDER BY created_at DESC`
    );
    res.json(announcements);
  } catch (error) {
    console.error("❌ Error fetching announcements:", error);
    res.status(500).json({ message: "Server error." });
  }
});

app.get("/stats", verifyToken, async (req, res) => {
  try {
    const [stats] = await db.execute(`
      SELECT 
        (SELECT COUNT(*) FROM students) AS total_students,
        (SELECT COUNT(*) FROM teachers) AS total_teachers,
        (SELECT COUNT(*) FROM parents) AS total_parents
    `);
    res.json(stats[0]);
  } catch (error) {
    console.error("❌ Stats error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Add Event Route
app.post("/api/events", upload.single('image'), async (req, res) => {
  const conn = await db.getConnection();

  try {
    const { title, description, date, time, location, category } = req.body;
    const imagePath = req.file ? req.file.path : null;

    // Validate required fields
    if (!title || !date || !location || !category) {
      return res.status(400).json({ message: "Title, date, location, and category are required." });
    }

    // Insert event into the database
    const [result] = await conn.execute(
      `INSERT INTO events (title, description, date, time, location, category, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, date, time, location, category, imagePath]
    );

    res.status(201).json({ message: "Event added successfully!", eventId: result.insertId });
  } catch (error) {
    console.error("❌ Error adding event:", error);
    res.status(500).json({ message: "Server error during event addition." });
  } finally {
    conn.release();
  }
});

// Get All Events Route
app.get("/api/events", async (req, res) => {
  console.log("Fetching events..."); // Debug log
  const conn = await db.getConnection();
  try {
    const [events] = await conn.execute("SELECT * FROM events ORDER BY date DESC");
    console.log("Events fetched:", events); // Debug log
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    res.status(500).json({ message: "Server error during event retrieval." });
  } finally {
    conn.release();
  }
});

// Fetch teacher profile
app.get("/teacher-profile", verifyToken, async (req, res) => {
  const conn = await db.getConnection();
  try {
    const [teacher] = await conn.execute(
      "SELECT full_name, email FROM teachers WHERE id = ?",
      [req.user.id]
    );

    if (teacher.length === 0) return res.status(404).json({ error: "Teacher not found" });

    res.json(teacher[0]);
  } catch (err) {
    console.error("❌ Error fetching teacher profile:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
});

// Update teacher profile
app.put("/teacher-profile/update", verifyToken, async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { full_name, email } = req.body;

    await conn.execute(
      "UPDATE teachers SET full_name = ?, email = ? WHERE id = ?",
      [full_name, email, req.user.id]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  } finally {
    conn.release();
  }
});

app.put('/users/:id', verifyToken, async (req, res) => {
  const conn = await db.getConnection();

  try {
    const userId = req.params.id;
    const {
      username,
      email,
      role, // New role!
      full_name,
      phone_number,
      national_id,
      address,
      specialization,
      qualification,
      date_of_hire,
      admission_number,
      parent_id,
      student_id,
      class_id
    } = req.body;

    // Fetch existing user + role
    const [users] = await conn.execute(
      `SELECT role FROM chepareria_users WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const currentRole = users[0].role;

    // Update chepareria_users base data
    await conn.execute(
      `UPDATE chepareria_users SET username = ?, email = ?, role = ? WHERE id = ?`,
      [username, email, role, userId]
    );

    // Delete from the old role table if role changed
    if (role !== currentRole) {
      if (currentRole === "teacher") {
        await conn.execute(`DELETE FROM teachers WHERE id = ?`, [userId]);
      } else if (currentRole === "secretary") {
        await conn.execute(`DELETE FROM secretaries WHERE id = ?`, [userId]);
      } else if (currentRole === "student") {
        await conn.execute(`DELETE FROM students WHERE id = ?`, [userId]);
      } else if (currentRole === "parent") {
        await conn.execute(`DELETE FROM parents WHERE id = ?`, [userId]);
      }
    }

    // Insert/update in the new role table
    if (role === "teacher") {
      await conn.execute(
        `INSERT INTO teachers (id, full_name, phone_number, national_id, address, specialization, qualification, date_of_hire)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         phone_number = VALUES(phone_number),
         national_id = VALUES(national_id),
         address = VALUES(address),
         specialization = VALUES(specialization),
         qualification = VALUES(qualification),
         date_of_hire = VALUES(date_of_hire)
        `,
        [userId, full_name, phone_number, national_id, address, specialization, qualification, date_of_hire]
      );
    } else if (role === "secretary") {
      await conn.execute(
        `INSERT INTO secretaries (id, full_name, phone_number, national_id, address)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         phone_number = VALUES(phone_number),
         national_id = VALUES(national_id),
         address = VALUES(address)
        `,
        [userId, full_name, phone_number, national_id, address]
      );
    } else if (role === "student") {
      await conn.execute(
        `INSERT INTO students (id, full_name, admission_number, class_id, parent_id)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         admission_number = VALUES(admission_number),
         class_id = VALUES(class_id),
         parent_id = VALUES(parent_id)
        `,
        [userId, full_name, admission_number, class_id, parent_id]
      );
    } else if (role === "parent") {
      await conn.execute(
        `INSERT INTO parents (id, full_name, phone_number, national_id, student_id)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         full_name = VALUES(full_name),
         phone_number = VALUES(phone_number),
         national_id = VALUES(national_id),
         student_id = VALUES(student_id)
        `,
        [userId, full_name, phone_number, national_id, student_id]
      );
    }

    res.json({ message: `User updated successfully. Now a ${role}.` });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ error: "Failed to update user." });
  } finally {
    conn.release();
  }
});

app.get("/secretaries", verifyToken, async (req, res) => {
  try {
    const [secretaries] = await db.execute(`
      SELECT s.*, u.username, u.email
      FROM secretaries s
      JOIN chepareria_users u ON s.id = u.id
    `);

    res.json(secretaries);
  } catch (error) {
    console.error("❌ Error fetching secretaries:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Fetch all roles from the database
app.get("/roles", async (req, res) => {
  try {
    const [roles] = await db.execute(
      "SELECT DISTINCT role FROM chepareria_users"
    );
    res.json(roles.map((role) => role.role)); // Extract role names
  } catch (error) {
    console.error("❌ Error fetching roles:", error);
    res.status(500).json({ message: "Server error while fetching roles." });
  }
});

app.post('/students', async (req, res) => {
  const {
    full_name,
    admission_number,
    class_id,
    date_of_admission,
    parent_guardian
  } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Add the student
    const [studentResult] = await connection.query(
      'INSERT INTO students (full_name, admission_number, class_id, date_of_admission) VALUES (?, ?, ?, ?)',
      [full_name, admission_number, class_id, date_of_admission]
    );

    const studentId = studentResult.insertId;

    // 2. Add the parent directly linked to the student
    const { name, relationship, phone, email, address } = parent_guardian;

    await connection.query(
      'INSERT INTO parents (full_name, phone_number, national_id, student_id) VALUES (?, ?, ?, ?)',
      [name, phone, address, studentId] // using 'address' as national_id in this example
    );

    await connection.commit();
    res.json({ success: true, message: 'Student and parent added successfully!' });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add student and parent.' });
  } finally {
    connection.release();
  }
});


app.get('/api/classes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, class_name FROM classes');
    
    res.json({
      success: true,
      classes: rows
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes'
    });
  }
});



// Start server and create default admin
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await createDefaultAdmin();
});