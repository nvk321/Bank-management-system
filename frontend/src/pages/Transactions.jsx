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
      <div className="container page">
        <div className="page-header">
          <div>
            <h2>Transactions</h2>
            <div className="page-sub">Create deposits, withdrawals or transfers</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleTransaction} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
              <label style={{ fontWeight: 600 }}>Transaction Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input">
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
                <option value="transfer">Transfer</option>
              </select>

              <input className="input" placeholder="Account ID" value={accountId} onChange={(e) => setAccountId(e.target.value)} />

              {type === "transfer" && (
                <input className="input" placeholder="To Account ID" value={toAccount} onChange={(e) => setToAccount(e.target.value)} />
              )}

              <input className="input" placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

              <div>
                <button type="submit" className="btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
