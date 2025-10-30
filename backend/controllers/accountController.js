import db from "../config/db.js";

export const getAccounts = async (req, res) => {
  const user = req.user; // from JWT middleware

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  try {
    if (user.role === "customer") {
      const sql = `
        SELECT a.account_id, a.type, a.balance, a.status, b.name AS branch_name
        FROM account a
        LEFT JOIN branch b ON a.branch_id = b.branch_id
        WHERE a.customer_id = (
          SELECT customer_id FROM customer WHERE user_id = ?
        )`;
      const [rows] = await db.query(sql, [user.id]);
      return res.json(rows);
    }

    const sql = `
      SELECT a.account_id, a.type, a.balance, a.status,
             c.name AS customer_name, b.name AS branch_name
      FROM account a
      LEFT JOIN customer c ON a.customer_id = c.customer_id
      LEFT JOIN branch b ON a.branch_id = b.branch_id`;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("getAccounts error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createAccount = async (req, res) => {
  const { customer_id, branch_id, type } = req.body;

  if (!customer_id || !branch_id || !type) {
    return res.status(400).json({ message: "customer_id, branch_id, and type are required" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO account (customer_id, branch_id, type, balance, status) VALUES (?, ?, ?, 0, 'active')",
      [customer_id, branch_id, type]
    );
    res.json({ message: "Account created successfully", account_id: result.insertId });
  } catch (err) {
    console.error("createAccount SQL Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAccountsByCustomer = async (req, res) => {
  const { customerId } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM account WHERE customer_id = ?", [customerId]);
    res.json(rows);
  } catch (err) {
    console.error("getAccountsByCustomer error:", err);
    res.status(500).json({ message: err.message });
  }
};
