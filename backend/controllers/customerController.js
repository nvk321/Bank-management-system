import bcrypt from "bcrypt";
import db from "../config/db.js"; // make sure this is correct

export const createCustomer = async (req, res) => {
  const { username, password, name, email, phone, address } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ message: "username, password, and name are required" });
  }

  try {
    // 1️⃣ Create user first
    const hashed = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO user (username, password, role, email) VALUES (?, ?, 'customer', ?)",
      [username, hashed, email || `${username}@example.com`],
      (err, userResult) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({ message: "Error creating user" });
        }

        const user_id = userResult.insertId;

        // 2️⃣ Create customer linked to user_id
        db.query(
          "INSERT INTO customer (user_id, name, phone, address) VALUES (?, ?, ?, ?)",
          [user_id, name, phone, address],
          (err2, customerResult) => {
            if (err2) {
              console.error("Error creating customer:", err2);
              return res.status(500).json({ message: "Error creating customer" });
            }

            res.status(201).json({
              message: "Customer created",
              user_id,
              customer_id: customerResult.insertId,
            });
          }
        );
      }
    );
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ message: "Error creating customer" });
  }
};

export const getCustomers = (req, res) => {
  db.query(
    "SELECT customer_id, name FROM customer ORDER BY name",
    (err, results) => {
      if (err) {
        console.error("Error fetching customers:", err);
        return res.status(500).json({ message: "Error fetching customers" });
      }
      res.json(results);
    }
  );
};
