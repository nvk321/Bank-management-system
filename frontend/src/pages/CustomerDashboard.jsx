import { useEffect, useState } from "react";
import api from "../utils/api";

export default function CustomerDashboard() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id"); // optional if you store it
    api
      .get("/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAccounts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>💰 Customer Dashboard</h2>
      <p>Your Accounts</p>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Account ID</th>
            <th>Type</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.account_id}>
              <td>{a.account_id}</td>
              <td>{a.type}</td>
              <td>{a.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
