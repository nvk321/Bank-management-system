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
      <div style={{ padding: 20 }}>
        <h2>Add New Customer</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
<input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

          <button type="submit" style={{ marginTop: "10px", background: "#0077b6", color: "white", border: "none", padding: "8px", borderRadius: "5px" }}>
            Add Customer
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}
