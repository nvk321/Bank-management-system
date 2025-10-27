import db from "../config/db.js";

export const getAccounts = (req, res) => {
  const user = req.user; // from JWT middleware

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // 🧩 If customer — show only their own accounts
  if (user.role === "customer") {
    const sql = `
      SELECT a.account_id, a.type, a.balance, a.status, b.name AS branch_name
      FROM account a
      LEFT JOIN branch b ON a.branch_id = b.branch_id
      WHERE a.customer_id = (
        SELECT customer_id FROM customer WHERE user_id = ?
      )`;

    db.query(sql, [user.id], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      return res.json(result);
    });

  } else {
    // 🧩 Admin or employee — can view all accounts
    const sql = `
      SELECT a.account_id, a.type, a.balance, a.status, 
             c.name AS customer_name, b.name AS branch_name
      FROM account a
      LEFT JOIN customer c ON a.customer_id = c.customer_id
      LEFT JOIN branch b ON a.branch_id = b.branch_id`;

    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(result);
    });
  }
};

export const createAccount = (req, res) => {
  const { customer_id, branch_id, type } = req.body;

  if (!customer_id || !branch_id || !type) {
    return res.status(400).json({ message: "customer_id, branch_id, and type are required" });
  }

  db.query(
    "INSERT INTO account (customer_id, branch_id, type, balance, status) VALUES (?, ?, ?, 0, 'active')",
    [customer_id, branch_id, type],
    (err, result) => {
      if (err) {
        console.error("SQL Error (createAccount):", err);
        return res.status(500).json({ message: err.message });
      }
      res.json({ message: "Account created successfully", account_id: result.insertId });
    }
  );
};

export const getAccountsByCustomer = (req, res) => {
  const { customerId } = req.params;
  db.query("SELECT * FROM account WHERE customer_id = ?", [customerId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
};
