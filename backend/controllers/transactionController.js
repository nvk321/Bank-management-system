import db from "../config/db.js";

export const deposit = (req, res) => {
  const { account_id, amount } = req.body;
  db.query("CALL deposit_amount(?, ?)", [account_id, amount], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Deposit successful" });
  });
};

export const withdraw = (req, res) => {
  const { account_id, amount } = req.body;
  db.query("CALL withdraw_amount(?, ?)", [account_id, amount], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Withdrawal successful" });
  });
};

export const transfer = (req, res) => {
  const { from_account, to_account, amount } = req.body;
  db.query("CALL transfer_amount(?, ?, ?)", [from_account, to_account, amount], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: "Transfer successful" });
  });
};
