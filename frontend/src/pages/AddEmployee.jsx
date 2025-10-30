import { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

export default function AddEmployee() {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    branch_id: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/branches", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setBranches(res.data))
      .catch((err) => console.error("Error fetching branches:", err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await api.post("/employees", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
      setForm({ name: "", username: "", password: "", email: "", branch_id: "" });
    } catch (err) {
      console.error(err);
      setMessage("Error creating employee");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header">
          <div>
            <h2>Add New Employee</h2>
            <div className="page-sub">Create an employee account and assign to a branch</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
              <input type="text" name="name" placeholder="Employee Name" value={form.name} onChange={handleChange} required className="input" />
              <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="input" />
              <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required className="input" />
              <input type="email" name="email" placeholder="Email (optional)" value={form.email} onChange={handleChange} className="input" />
              <select name="branch_id" value={form.branch_id} onChange={handleChange} required className="input">
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b.branch_id} value={b.branch_id}>{b.name}</option>
                ))}
              </select>

              <button type="submit" className="btn">Add Employee</button>
            </form>

            {message && (
              <p style={{ marginTop: 12, textAlign: 'center', fontWeight: 600, color: message.includes('Error') ? 'var(--danger)' : 'var(--success)' }}>{message}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
