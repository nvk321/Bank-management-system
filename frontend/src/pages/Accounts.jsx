import { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
    };
    fetchAccounts();
  }, []);

return (
  <>
    <Navbar />
    <div style={{ padding: 20 }}>
      <h2>All Accounts</h2>
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ background: "#0077b6", color: "white" }}>
            <th>Account ID</th>
            <th>Customer Name</th>
            <th>Branch Name</th>
            <th>Type</th>
            <th>Balance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length > 0 ? (
            accounts.map((a) => (
              <tr key={a.account_id}>
                <td>{a.account_id}</td>
                <td>{a.customer_name}</td>
                <td>{a.branch_name}</td>
                <td>{a.type}</td>
                <td>{a.balance}</td>
                <td>{a.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No accounts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </>
);
}
