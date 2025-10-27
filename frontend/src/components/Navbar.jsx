import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // 👈 get role from localStorage

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // 👇 Define which links each role can see
  const navLinks = [
  { to: "/dashboard", label: "Dashboard", roles: ["admin", "employee", "customer"] },
  { to: "/transactions", label: "Transactions", roles: ["admin", "employee", "customer"] },
  { to: "/accounts", label: "Accounts", roles: ["admin", "employee"] },
  { to: "/add-customer", label: "Add Customer", roles: ["admin"] },
  { to: "/add-account", label: "Add Account", roles: ["admin", "employee"] },
  { to: "/add-employee", label: "Add Employee", roles: ["admin"] }, // ✅ new
  { to: "/employees", label: "View Employees", roles: ["admin"] }, // ✅ new
];

  return (
    <nav
      style={{
        background: "#0077b6",
        color: "white",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "8px",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>🏦 MyBank</div>
      <div>
        {navLinks
          .filter((link) => link.roles.includes(role)) // 👈 show only allowed links
          .map((link) => (
            <Link key={link.to} to={link.to} style={linkStyle}>
              {link.label}
            </Link>
          ))}

        <button
          onClick={handleLogout}
          style={{
            background: "red",
            color: "white",
            border: "none",
            marginLeft: "10px",
            padding: "6px 12px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  marginRight: "10px",
  fontWeight: "500",
};
