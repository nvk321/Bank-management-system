import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import AddCustomer from "./pages/AddCustomer";
import AddAccount from "./pages/AddAccount";
import AddEmployee from "./pages/AddEmployee";
import Employees from "./pages/Employees";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Common Protected Pages */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/transactions"
          element={token ? <Transactions /> : <Navigate to="/" />}
        />
        <Route
          path="/accounts"
          element={token ? <Accounts /> : <Navigate to="/" />}
        />
        <Route
          path="/add-customer"
          element={token ? <AddCustomer /> : <Navigate to="/" />}
        />
        <Route
          path="/add-account"
          element={token ? <AddAccount /> : <Navigate to="/" />}
        />
        <Route
          path="/add-employee"
          element={token ? <AddEmployee /> : <Navigate to="/" />}
        />
        <Route
          path="/employees"
          element={token ? <Employees /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
