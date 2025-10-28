import { useEffect, useState } from "react";
import api from "../utils/api";

export default function EmployeeDashboard() {
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
      <h2>🏦 Employee Dashboard</h2>
      <p>Manage Customer Accounts</p>
      <ul>
        {accounts.map((a) => (
          <li key={a.account_id}>
            {a.customer_name} — {a.type} — ₹{a.balance}
          </li>
        ))}
      </ul>
    </div>
  );
}
