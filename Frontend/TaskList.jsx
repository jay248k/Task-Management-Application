import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask, updateTask } from "../services/taskService";

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(() => showAlert("danger", "Failed to load tasks."))
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showAlert("success", "Task deleted.");
    } catch {
      showAlert("danger", "Failed to delete.");
    }
  };

  const handleToggle = async (task) => {
    try {
      const updated = await updateTask(task.id, { ...task, completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch {
      showAlert("danger", "Failed to update.");
    }
  };

  const completed = tasks.filter((t) => t.completed).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f1f3f5", fontFamily: "Inter, sans-serif" }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: "#1a1a2e", padding: "0 32px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontWeight: 600, fontSize: "1rem", letterSpacing: "0.3px" }}>
          ✓ Task Manager
        </span>
        <button
          onClick={() => navigate("/create-task")}
          style={{ backgroundColor: "#4f8ef7", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 16px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}
        >
          + New Task
        </button>
      </nav>

      {/* Alert */}
      {alert && (
        <div style={{ backgroundColor: alert.type === "success" ? "#d4edda" : "#f8d7da", color: alert.type === "success" ? "#155724" : "#721c24", padding: "10px 32px", fontSize: "0.82rem", flexShrink: 0, borderBottom: "1px solid #dee2e6" }}>
          {alert.message}
        </div>
      )}

      {/* Main — fills remaining height */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "24px 32px", gap: "16px" }}>

        {/* Stats + Progress row */}
        <div style={{ display: "flex", gap: "16px", alignItems: "stretch", flexShrink: 0 }}>
          {[
            { label: "Total", value: tasks.length, color: "#1a1a2e" },
            { label: "Completed", value: completed, color: "#28a745" },
            { label: "Pending", value: tasks.length - completed, color: "#e67e22" },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: "#fff", borderRadius: "8px", padding: "14px 20px", textAlign: "center", minWidth: "100px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.72rem", color: "#888", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}

          {/* Progress bar — takes remaining width */}
          {tasks.length > 0 && (
            <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "8px", padding: "14px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "#888", fontWeight: 500 }}>Progress</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1a1a2e" }}>{progress}%</span>
              </div>
              <div style={{ backgroundColor: "#e9ecef", borderRadius: "4px", height: "8px" }}>
                <div style={{ width: `${progress}%`, backgroundColor: "#28a745", height: "8px", borderRadius: "4px", transition: "width 0.4s ease" }} />
              </div>
            </div>
          )}
        </div>

        {/* Task table — scrollable */}
        <div style={{ flex: 1, backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Table head */}
          <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 2fr 100px 130px", padding: "10px 20px", borderBottom: "1px solid #e9ecef", backgroundColor: "#f8f9fa", flexShrink: 0 }}>
            {["", "Title", "Description", "Status", "Actions"].map((h) => (
              <span key={h} style={{ fontSize: "0.72rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
            ))}
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888", fontSize: "0.85rem" }}>
                Loading tasks…
              </div>
            ) : tasks.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#aaa", gap: "12px" }}>
                <span style={{ fontSize: "2rem" }}>📋</span>
                <span style={{ fontSize: "0.85rem" }}>No tasks yet.</span>
                <button
                  onClick={() => navigate("/create-task")}
                  style={{ backgroundColor: "#1a1a2e", color: "#fff", border: "none", borderRadius: "6px", padding: "7px 18px", fontSize: "0.78rem", cursor: "pointer" }}
                >
                  Create Task
                </button>
              </div>
            ) : (
              tasks.map((task, i) => (
                <div
                  key={task.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr 2fr 100px 130px",
                    padding: "12px 20px",
                    alignItems: "center",
                    borderBottom: i < tasks.length - 1 ? "1px solid #f1f3f5" : "none",
                    backgroundColor: task.completed ? "#f6fef9" : "#fff",
                    borderLeft: `3px solid ${task.completed ? "#28a745" : "transparent"}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task)}
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#28a745" }}
                  />
                  <span style={{ fontSize: "0.875rem", fontWeight: 500, color: task.completed ? "#aaa" : "#1a1a2e", textDecoration: task.completed ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "12px" }}>
                    {task.title}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "12px" }}>
                    {task.description || "—"}
                  </span>
                  <span>
                    <span style={{
                      fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px", borderRadius: "20px",
                      backgroundColor: task.completed ? "#d4edda" : "#fff3cd",
                      color: task.completed ? "#155724" : "#856404",
                    }}>
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => navigate(`/edit-task/${task.id}`)}
                      style={{ fontSize: "0.73rem", padding: "4px 12px", borderRadius: "5px", border: "1px solid #ced4da", backgroundColor: "#fff", cursor: "pointer", color: "#495057" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      style={{ fontSize: "0.73rem", padding: "4px 12px", borderRadius: "5px", border: "1px solid #f5c6cb", backgroundColor: "#fff", cursor: "pointer", color: "#dc3545" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
