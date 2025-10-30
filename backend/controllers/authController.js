import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM user WHERE username = ?", [username]);
    if (!rows || rows.length === 0) return res.status(401).json({ message: "User not found" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ message: "Login successful", token, role: user.role, userId: user.user_id });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ message: "DB error" });
  }
};

// seed admin (call ONCE). After use, delete or secure this route.
export const seedAdmin = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Provide username and password" });

  try {
    const saltRounds = Number(process.env.BCRYPT_ROUNDS || 10);
    const hashed = await bcrypt.hash(password, saltRounds);
    const [result] = await db.execute(
      "INSERT INTO user (username, password, role, email) VALUES (?, ?, 'admin', ?)",
      [username, hashed, email || `${username}@example.com`]
    );
    res.json({ message: "Admin created", user_id: result.insertId });
  } catch (err) {
    console.error("seedAdmin error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Register a normal user and (optionally) a customer record in same call
// body: { username, password, email, role }  role: 'customer'|'employee'
export const registerUser = async (req, res) => {
  const { username, password, email, role, name, address, phone, branch_id } = req.body;
  if (!username || !password || !role) return res.status(400).json({ message: "username, password and role required" });

  try {
    const saltRounds = Number(process.env.BCRYPT_ROUNDS || 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.execute(
        "INSERT INTO user (username, password, role, email) VALUES (?, ?, ?, ?)",
        [username, hashed, role, email || `${username}@example.com`]
      );
      const uid = result.insertId;

      if (role === "customer") {
        const [res2] = await conn.execute(
          "INSERT INTO customer (user_id, name, address, phone) VALUES (?, ?, ?, ?)",
          [uid, name || username, address || null, phone || null]
        );
        await conn.commit();
        return res.json({ message: "Customer user created", user_id: uid, customer_id: res2.insertId });
      }

      if (role === "employee") {
        const [res3] = await conn.execute(
          "INSERT INTO employee (user_id, name, branch_id) VALUES (?, ?, ?)",
          [uid, name || username, branch_id || null]
        );
        await conn.commit();
        return res.json({ message: "Employee user created", user_id: uid, employee_id: res3.insertId });
      }

      await conn.commit();
      return res.json({ message: "User created", user_id: uid });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: err.message });
  }
};
