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
    <div className="container page">
      <div className="page-header">
        <div>
          <h2>Customer Dashboard</h2>
          <div className="page-sub">Your Accounts</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-wrap">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Account ID</th>
                  <th>Type</th>
                  <th className="right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => (
                  <tr key={a.account_id}>
                    <td>{a.account_id}</td>
                    <td>{a.type}</td>
                    <td className="right">{a.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
