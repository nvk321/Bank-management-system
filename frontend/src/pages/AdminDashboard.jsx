import { useEffect, useState } from "react";
import api from "../utils/api";

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/accounts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setAccounts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>👑 Admin Dashboard</h2>
      <p>All Bank Accounts</p>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Branch</th>
            <th>Type</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.account_id}>
              <td>{a.account_id}</td>
              <td>{a.customer_name}</td>
              <td>{a.branch_name}</td>
              <td>{a.type}</td>
              <td>{a.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
