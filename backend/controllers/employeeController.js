// backend/controllers/employeeController.js
import db from "../config/db.js";
import bcrypt from "bcrypt";

export const createEmployee = async (req, res) => {
  const { name, branch_id, username, password, email } = req.body;
  if (!username || !password || !name)
    return res.status(400).json({ message: "username, password, and name are required" });

  try {
    const saltRounds = Number(process.env.BCRYPT_ROUNDS || 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [userResult] = await conn.execute(
        "INSERT INTO user (username, password, role, email) VALUES (?, ?, 'employee', ?)",
        [username, hashed, email || `${username}@example.com`]
      );

      const user_id = userResult.insertId;

      const [empResult] = await conn.execute(
        "INSERT INTO employee (user_id, name, branch_id) VALUES (?, ?, ?)",
        [user_id, name, branch_id || null]
      );

      await conn.commit();

      res.status(201).json({
        message: "Employee created successfully",
        user_id,
        employee_id: empResult.insertId,
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("createEmployee error:", err);
    res.status(500).json({ message: "Error creating employee" });
  }
};

// 🧾 List all employees (admin only)
export const getEmployees = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.employee_id, e.name, b.name AS branch_name, u.username, u.email
       FROM employee e
       LEFT JOIN branch b ON e.branch_id = b.branch_id
       LEFT JOIN user u ON e.user_id = u.user_id
       ORDER BY e.name`
    );
    res.json(rows);
  } catch (err) {
    console.error("getEmployees error:", err);
    res.status(500).json({ message: err.message });
  }
};
