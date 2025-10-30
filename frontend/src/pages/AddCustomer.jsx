import { useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

export default function AddCustomer() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/customers", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
      setForm({ name: "", email: "", phone: "", address: "" });
    } catch (err) {
      setMessage("Error creating customer");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header">
          <div>
            <h2>Add New Customer</h2>
            <div className="page-sub">Create a new customer record</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
              <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="input" />
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="input" />
              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="input" />
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required className="input" />
              <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required className="input" />
              <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="input" />

              <button type="submit" className="btn">Add Customer</button>
            </form>
            {message && <p style={{ marginTop: 12 }}>{message}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
