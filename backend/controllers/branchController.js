import db from "../config/db.js";

export const createBranch = async (req, res) => {
  const { name, location } = req.body;
  if (!name) return res.status(400).json({ message: "Branch name required" });

  try {
    const [result] = await db.execute("INSERT INTO branch (name, location) VALUES (?, ?)", [name, location || null]);
    res.json({ message: "Branch created", branch_id: result.insertId });
  } catch (err) {
    console.error("createBranch error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getBranches = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM branch");
    res.json(rows);
  } catch (err) {
    console.error("getBranches error:", err);
    res.status(500).json({ message: err.message });
  }
};
