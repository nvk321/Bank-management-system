import bcrypt from "bcrypt";
import db from "../config/db.js"; // make sure this is correct

export const createCustomer = async (req, res) => {
  const { username, password, name, email, phone, address } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ message: "username, password, and name are required" });
  }

  try {
    const saltRounds = Number(process.env.BCRYPT_ROUNDS || 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [userResult] = await conn.execute(
        "INSERT INTO user (username, password, role, email) VALUES (?, ?, 'customer', ?)",
        [username, hashed, email || `${username}@example.com`]
      );

      const user_id = userResult.insertId;

      const [customerResult] = await conn.execute(
        "INSERT INTO customer (user_id, name, phone, address) VALUES (?, ?, ?, ?)",
        [user_id, name, phone, address]
      );

      await conn.commit();

      res.status(201).json({
        message: "Customer created",
        user_id,
        customer_id: customerResult.insertId,
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ message: "Error creating customer" });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT customer_id, name FROM customer ORDER BY name");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ message: "Error fetching customers" });
  }
};
