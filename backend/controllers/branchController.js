import db from "../config/db.js";

export const createBranch = (req, res) => {
  const { name, location } = req.body;
  if (!name) return res.status(400).json({ message: "Branch name required" });

  db.query("INSERT INTO branch (name, location) VALUES (?, ?)", [name, location || null], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Branch created", branch_id: result.insertId });
  });
};

export const getBranches = (req, res) => {
  db.query("SELECT * FROM branch", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
};
