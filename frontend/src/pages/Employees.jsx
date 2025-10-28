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
      <div className="min-h-screen bg-gray-50 p-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Employee List
        </h2>

        {employees.length === 0 ? (
          <p className="text-center text-gray-500">No employees found</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-200">
            <table className="min-w-full border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Branch</th>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e, index) => (
                  <tr
                    key={e.employee_id}
                    className={`border-b hover:bg-blue-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2">{e.employee_id}</td>
                    <td className="px-4 py-2 font-semibold text-gray-700">{e.name}</td>
                    <td className="px-4 py-2">{e.branch_name || "N/A"}</td>
                    <td className="px-4 py-2">{e.username}</td>
                    <td className="px-4 py-2">{e.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
