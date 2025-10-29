import { useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

export default function Transactions() {
  const [accountId, setAccountId] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("deposit");

  const handleTransaction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      let endpoint = "";
      let data = {};

      if (type === "deposit") {
        endpoint = "/transactions/deposit";
        data = { account_id: accountId, amount };
      } else if (type === "withdraw") {
        endpoint = "/transactions/withdraw";
        data = { account_id: accountId, amount };
      } else if (type === "transfer") {
        endpoint = "/transactions/transfer";
        data = { from_account: accountId, to_account: toAccount, amount };
      }

      const res = await api.post(endpoint, data, { headers });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Transaction failed");
    }
  };

  return (
    <>
    <Navbar />
    <div style={{ padding: 20 }}>
      <h2>Transactions</h2>
      <form onSubmit={handleTransaction}>
        <label>Transaction Type: </label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
          <option value="transfer">Transfer</option>
        </select>
        <br /><br />
        <input
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        /><br /><br />
        {type === "transfer" && (
          <>
            <input
              placeholder="To Account ID"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
            /><br /><br />
          </>
        )}
        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        /><br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
    </>
  );
}
