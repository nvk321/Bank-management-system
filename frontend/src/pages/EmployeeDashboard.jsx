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
    <div className="container page">
      <div className="page-header">
        <div>
          <h2>Employee Dashboard</h2>
          <div className="page-sub">Manage Customer Accounts</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {accounts.length === 0 ? (
            <p className="muted">No accounts available</p>
          ) : (
            <ul style={{ display: 'grid', gap: 8 }}>
              {accounts.map((a) => (
                <li key={a.account_id} style={{ padding: 10, borderRadius: 8, background: '#fbfdff', border: '1px solid #f1f5f9' }}>
                  <strong>{a.customer_name}</strong> — {a.type} — <span style={{ float: 'right' }}>₹{a.balance}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
