import db from "../config/db.js";

export const deposit = async (req, res) => {
  const { account_id, amount } = req.body;
  try {
    await db.query("CALL deposit_amount(?, ?)", [account_id, amount]);
    res.json({ message: "Deposit successful" });
  } catch (err) {
    console.error("deposit error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const withdraw = async (req, res) => {
  const { account_id, amount } = req.body;
  try {
    await db.query("CALL withdraw_amount(?, ?)", [account_id, amount]);
    res.json({ message: "Withdrawal successful" });
  } catch (err) {
    console.error("withdraw error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const transfer = async (req, res) => {
  const { from_account, to_account, amount } = req.body;
  try {
    await db.query("CALL transfer_amount(?, ?, ?)", [from_account, to_account, amount]);
    res.json({ message: "Transfer successful" });
  } catch (err) {
    console.error("transfer error:", err);
    res.status(500).json({ message: err.message });
  }
};
