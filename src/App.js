// Root component — manages all state, passes props down

import { useState } from "react";
import Header       from "./components/Header";
import TabBar       from "./components/TabBar";
import Dashboard    from "./components/Dashboard";
import LeaveHistory from "./components/LeaveHistory";
import ApplyLeave   from "./components/ApplyLeave";
import { EMPLOYEES, LEAVE_TYPES, INITIAL_LEAVES } from "./constants";

export default function App() {
  const [leaves, setLeaves]               = useState(INITIAL_LEAVES);
  const [activeTab, setActiveTab]         = useState("dashboard");
  const [filterEmployee, setFilterEmployee] = useState("All");
  const [filterStatus, setFilterStatus]   = useState("All");
  const [nextId, setNextId]               = useState(4);
  const [form, setForm] = useState({
    employee: EMPLOYEES[0], type: LEAVE_TYPES[0],
    from: "", to: "", reason: "",
  });

  const counts = {
    total:    leaves.length,
    approved: leaves.filter((l) => l.status === "Approved").length,
    pending:  leaves.filter((l) => l.status === "Pending").length,
    rejected: leaves.filter((l) => l.status === "Rejected").length,
  };

  function handleFormChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    if (!form.from || !form.to || !form.reason)
      return alert("Please fill all fields");
    setLeaves((prev) => [...prev, { ...form, id: nextId, status: "Pending" }]);
    setNextId((n) => n + 1);
    setForm({ employee: EMPLOYEES[0], type: LEAVE_TYPES[0], from: "", to: "", reason: "" });
    setActiveTab("history");
  }

  function handleApprove(id) {
    setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, status: "Approved" } : l));
  }

  function handleReject(id) {
    setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, status: "Rejected" } : l));
  }

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", minHeight: "100vh", background: "#f1f5f9" }}>
      <Header onApplyClick={() => setActiveTab("apply")} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
        {activeTab === "dashboard" && <Dashboard leaves={leaves} counts={counts} />}
        {activeTab === "history"   && (
          <LeaveHistory
            leaves={leaves} employees={EMPLOYEES}
            filterEmployee={filterEmployee} filterStatus={filterStatus}
            onFilterEmployee={setFilterEmployee} onFilterStatus={setFilterStatus}
            onApprove={handleApprove} onReject={handleReject}
          />
        )}
        {activeTab === "apply" && (
          <ApplyLeave
            form={form} employees={EMPLOYEES} leaveTypes={LEAVE_TYPES}
            onChange={handleFormChange} onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}