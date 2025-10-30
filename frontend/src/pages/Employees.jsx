import { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/employees", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header">
          <div>
            <h2>Employee List</h2>
            <div className="page-sub">Manage and review employee records</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {employees.length === 0 ? (
              <p className="muted">No employees found</p>
            ) : (
              <div className="table-wrap">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Branch</th>
                      <th>Username</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((e) => (
                      <tr key={e.employee_id}>
                        <td>{e.employee_id}</td>
                        <td style={{ fontWeight: 600 }}>{e.name}</td>
                        <td>{e.branch_name || 'N/A'}</td>
                        <td>{e.username}</td>
                        <td>{e.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
