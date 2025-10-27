import { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

export default function AddAccount() {
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ customer_id: "", branch_id: "", type: "savings" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Fetch customers
    api.get("/customers", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));

    // Fetch branches
    api.get("/branches", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setBranches(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await api.post("/accounts", form, { headers: { Authorization: `Bearer ${token}` } });
      setMessage(res.data.message);
      setForm({ customer_id: "", branch_id: "", type: "savings" });
    } catch (err) {
      setMessage("Error creating account");
    }
  };

  return (
    <><Navbar />
    <div style={{ padding: 20 }}>
      <h2>Add New Account</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <select name="customer_id" value={form.customer_id} onChange={handleChange} required>
          <option value="">Select Customer</option>
          {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name}</option>)}
        </select>

        <select name="branch_id" value={form.branch_id} onChange={handleChange} required>
          <option value="">Select Branch</option>
          {branches.map(b => <option key={b.branch_id} value={b.branch_id}>{b.name}</option>)}
        </select>

        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="savings">Savings</option>
          <option value="current">Current</option>
        </select>

        <button type="submit" style={{ marginTop: "10px", background: "#0077b6", color: "white", border: "none", padding: "8px", borderRadius: "5px" }}>
          Add Account
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
    </>
  );
}
