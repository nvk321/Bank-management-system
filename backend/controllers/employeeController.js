// backend/controllers/employeeController.js
import db from "../config/db.js";

export const createEmployee = (req, res) => {
  const { name, branch_id, username, password, email } = req.body;
  if (!username || !password || !name)
    return res.status(400).json({ message: "username, password, and name are required" });

  // 1️⃣ Create a user entry
  import("bcrypt").then(async ({ default: bcrypt }) => {
    try {
      const hashed = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO user (username, password, role, email) VALUES (?, ?, 'employee', ?)",
        [username, hashed, email || `${username}@example.com`],
        (err, userResult) => {
          if (err) {
            console.error("Error creating user:", err);
            return res.status(500).json({ message: "Error creating user" });
          }

          const user_id = userResult.insertId;

          // 2️⃣ Create employee linked to that user
          db.query(
            "INSERT INTO employee (user_id, name, branch_id) VALUES (?, ?, ?)",
            [user_id, name, branch_id || null],
            (err2, empResult) => {
              if (err2) {
                console.error("Error creating employee:", err2);
                return res.status(500).json({ message: "Error creating employee" });
              }

              res.status(201).json({
                message: "Employee created successfully",
                user_id,
                employee_id: empResult.insertId,
              });
            }
          );
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

// 🧾 List all employees (admin only)
export const getEmployees = (req, res) => {
  db.query(
    `SELECT e.employee_id, e.name, b.name AS branch_name, u.username, u.email
     FROM employee e
     LEFT JOIN branch b ON e.branch_id = b.branch_id
     LEFT JOIN user u ON e.user_id = u.user_id
     ORDER BY e.name`,
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    }
  );
};
