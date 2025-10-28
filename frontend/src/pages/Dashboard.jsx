import { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
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
    <>
    <Navbar />
    <div style={{ padding: 20 }}>
      <h2>Accounts</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Type</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.account_id}>
              <td>{a.account_id}</td>
              <td>{a.customer_name}</td>
              <td>{a.type}</td>
              <td>{a.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
