import { useEffect, useState, useMemo } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

/**
 * Modern Accounts page
 * - Tailwind CSS required
 */

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/accounts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mounted) setAccounts(res.data || []);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        if (mounted) setAccounts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAccounts();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (!q) return true;
      // match account_id, customer_name, branch_name
      const matchAccountId = String(a.account_id).includes(q);
      const matchCustomer = (a.customer_name || "").toLowerCase().includes(q);
      const matchBranch = (a.branch_name || "").toLowerCase().includes(q);
      return matchAccountId || matchCustomer || matchBranch;
    });
  }, [accounts, query, typeFilter, statusFilter]);

  const exportCSV = () => {
    if (!filtered.length) return;
    const header = ["account_id", "customer_name", "branch_name", "type", "balance", "status"];
    const rows = filtered.map((r) =>
      header.map((h) => (r[h] !== undefined && r[h] !== null ? String(r[h]) : "")).join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accounts_export_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header">
          <div>
            <h2>All Accounts</h2>
            <div className="page-sub">Overview of accounts — customer, branch, balance and status.</div>
          </div>

          <div className="controls">
            <input
              type="text"
              placeholder="Search by account / customer / branch"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input"
              style={{ minWidth: 220 }}
            />

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input">
              <option value="all">All Types</option>
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button onClick={exportCSV} className="btn">Export CSV</button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Loading accounts…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No accounts found.</div>
            ) : (
              <div className="table-wrap">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Customer</th>
                      <th>Branch</th>
                      <th>Type</th>
                      <th className="right">Balance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.account_id}>
                        <td>#{a.account_id}</td>
                        <td>{a.customer_name || '—'}</td>
                        <td>{a.branch_name || '—'}</td>
                        <td><span className="tag type">{a.type}</span></td>
                        <td className="right">{Number(a.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>
                          {a.status === 'active' ? (
                            <span className="tag active">Active</span>
                          ) : (
                            <span className="tag inactive">Inactive</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="card-footer">Showing <strong>{filtered.length}</strong> of <strong>{accounts.length}</strong> accounts</div>
        </div>
      </div>
    </>
  );
}
