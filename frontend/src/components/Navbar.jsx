import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", roles: ["admin", "employee", "customer"] },
    { to: "/transactions", label: "Transactions", roles: ["admin", "employee", "customer"] },
    { to: "/accounts", label: "Accounts", roles: ["admin", "employee"] },
    { to: "/add-customer", label: "Add Customer", roles: ["admin"] },
    { to: "/add-account", label: "Add Account", roles: ["admin", "employee"] },
    { to: "/add-employee", label: "Add Employee", roles: ["admin"] },
    { to: "/employees", label: "View Employees", roles: ["admin"] },
  ];

  return (
    <header className="site-header">
      <div className="container">
        <div className="brand">
          <div className="logo">MB</div>
          <div>
            <h1>MyBank</h1>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 3 }}>Banking Admin Portal</div>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="nav-links">
            {navLinks
              .filter((link) => link.roles.includes(role))
              .map((link) => (
                <Link key={link.to} to={link.to}>{link.label}</Link>
              ))}
          </div>

          <div className="user-actions">
            <button className="btn ghost" onClick={() => navigate('/profile')}>Profile</button>
            <div className="avatar">{(localStorage.getItem('username')||'U').slice(0,1).toUpperCase()}</div>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      </div>
    </header>
  );
}
