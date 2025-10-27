import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const loginUser = (req, res) => {
  const { username, password } = req.body;
  db.query("SELECT * FROM user WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err.message });
    if (results.length === 0) return res.status(401).json({ message: "User not found" });

    const user = results[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ message: "Login successful", token, role: user.role, userId: user.user_id });
  });
};

// seed admin (call ONCE). After use, delete or secure this route.
export const seedAdmin = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Provide username and password" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    db.query("INSERT INTO user (username, password, role, email) VALUES (?, ?, 'admin', ?)",
      [username, hashed, email || `${username}@example.com`],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Admin created", user_id: result.insertId });
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Register a normal user and (optionally) a customer record in same call
// body: { username, password, email, role }  role: 'customer'|'employee'
export const registerUser = async (req, res) => {
  const { username, password, email, role, name, address, phone, branch_id } = req.body;
  if (!username || !password || !role) return res.status(400).json({ message: "username, password and role required" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    db.query("INSERT INTO user (username, password, role, email) VALUES (?, ?, ?, ?)",
      [username, hashed, role, email || `${username}@example.com`],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        const uid = result.insertId;

        if (role === "customer") {
          // create customer row linked to user
          db.query("INSERT INTO customer (user_id, name, address, phone) VALUES (?, ?, ?, ?)",
            [uid, name || username, address || null, phone || null],
            (err2, res2) => {
              if (err2) return res.status(500).json({ message: err2.message });
              return res.json({ message: "Customer user created", user_id: uid, customer_id: res2.insertId });
            });
        } else if (role === "employee") {
          // create employee row (branch_id optional)
          db.query("INSERT INTO employee (user_id, name, branch_id) VALUES (?, ?, ?)",
            [uid, name || username, branch_id || null],
            (err3, res3) => {
              if (err3) return res.status(500).json({ message: err3.message });
              return res.json({ message: "Employee user created", user_id: uid, employee_id: res3.insertId });
            });
        } else {
          res.json({ message: "User created", user_id: uid });
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
