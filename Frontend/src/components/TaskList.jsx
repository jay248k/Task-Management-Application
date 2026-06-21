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

  // Pending first, completed at bottom
  const sortedTasks = [
    ...tasks.filter((t) => !t.completed),
    ...tasks.filter((t) => t.completed),
  ];

  const completed = tasks.filter((t) => t.completed).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <>
      {/* Inject responsive styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; font-family: Inter, sans-serif; }

        .tm-root {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f1f3f5;
          font-family: Inter, sans-serif;
        }

        /* ── Navbar ── */
        .tm-nav {
          background: #1a1a2e;
          height: 52px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .tm-nav-brand { color: #fff; font-weight: 700; font-size: 0.95rem; }
        .tm-nav-btn {
          background: #4f8ef7;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        /* ── Alert ── */
        .tm-alert {
          padding: 9px 24px;
          font-size: 0.8rem;
          flex-shrink: 0;
          border-bottom: 1px solid #dee2e6;
        }

        /* ── Body ── */
        .tm-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 20px 24px;
          gap: 14px;
        }

        /* ── Stats row ── */
        .tm-stats {
          display: flex;
          gap: 12px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .tm-stat-card {
          background: #fff;
          border-radius: 8px;
          padding: 12px 18px;
          text-align: center;
          min-width: 90px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
          flex: 1;
        }
        .tm-stat-num { font-size: 1.5rem; font-weight: 700; line-height: 1; }
        .tm-stat-label { font-size: 0.68rem; color: #888; margin-top: 4px; }

        .tm-progress-card {
          background: #fff;
          border-radius: 8px;
          padding: 12px 18px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
          flex: 2;
          min-width: 160px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 7px;
        }
        .tm-progress-bar-bg {
          background: #e9ecef;
          border-radius: 4px;
          height: 7px;
        }
        .tm-progress-bar-fill {
          background: #28a745;
          height: 7px;
          border-radius: 4px;
          transition: width 0.4s ease;
        }

        /* ── Table card ── */
        .tm-table-card {
          flex: 1;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 0;
        }

        /* Desktop table head */
        .tm-thead {
          display: grid;
          grid-template-columns: 36px 1fr 2fr 90px 120px;
          padding: 10px 18px;
          border-bottom: 1px solid #e9ecef;
          background: #f8f9fa;
          flex-shrink: 0;
        }
        .tm-thead span {
          font-size: 0.68rem;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Desktop row */
        .tm-row {
          display: grid;
          grid-template-columns: 36px 1fr 2fr 90px 120px;
          padding: 11px 18px;
          align-items: center;
          border-bottom: 1px solid #f1f3f5;
          transition: background 0.15s;
        }

        .tm-body-scroll { flex: 1; overflow-y: auto; }

        .tm-title {
          font-size: 0.85rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 10px;
        }
        .tm-desc {
          font-size: 0.78rem;
          color: #888;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 10px;
        }
        .tm-badge {
          font-size: 0.67rem;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 20px;
          display: inline-block;
        }
        .tm-actions { display: flex; gap: 6px; }
        .tm-btn-edit, .tm-btn-del {
          font-size: 0.7rem;
          padding: 4px 10px;
          border-radius: 5px;
          cursor: pointer;
          border: 1px solid;
          background: #fff;
          white-space: nowrap;
        }
        .tm-btn-edit { border-color: #ced4da; color: #495057; }
        .tm-btn-del  { border-color: #f5c6cb; color: #dc3545; }
        .tm-btn-edit:hover { background: #f8f9fa; }
        .tm-btn-del:hover  { background: #fff5f5; }

        /* Empty / loading states */
        .tm-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 10px;
          color: #aaa;
          font-size: 0.83rem;
        }

        /* ── MOBILE ── */
        @media (max-width: 600px) {
          .tm-body { padding: 14px 14px; gap: 12px; }
          .tm-nav { padding: 0 14px; }
          .tm-alert { padding: 9px 14px; }

          /* Stack stats 3-col on mobile */
          .tm-stats { flex-wrap: nowrap; }
          .tm-stat-card { padding: 10px 8px; min-width: 0; }
          .tm-stat-num { font-size: 1.2rem; }

          /* Hide progress card on mobile — shown in stats */
          .tm-progress-card { display: none; }

          /* Hide desktop table head */
          .tm-thead { display: none; }

          /* Card-style rows on mobile */
          .tm-row {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            padding: 12px 14px;
            border-bottom: 1px solid #f1f3f5;
            border-left: 3px solid transparent;
          }

          .tm-row-top {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
          }
          .tm-title {
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
            flex: 1;
            font-size: 0.88rem;
          }
          .tm-desc {
            white-space: normal;
            overflow: visible;
            text-overflow: unset;
            padding-right: 0;
            font-size: 0.76rem;
          }
          .tm-row-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-top: 2px;
          }
        }

        /* ── TABLET ── */
        @media (min-width: 601px) and (max-width: 900px) {
          .tm-thead { grid-template-columns: 36px 1fr 90px 120px; }
          .tm-thead .tm-col-desc { display: none; }
          .tm-row  { grid-template-columns: 36px 1fr 90px 120px; }
          .tm-row .tm-desc { display: none; }
        }
      `}</style>

      <div className="tm-root">
        {/* Navbar */}
        <nav className="tm-nav">
          <span className="tm-nav-brand">✓ Task Manager</span>
          <button className="tm-nav-btn" onClick={() => navigate("/create-task")}>
            + New Task
          </button>
        </nav>

        {/* Alert */}
        {alert && (
          <div
            className="tm-alert"
            style={{
              backgroundColor: alert.type === "success" ? "#d4edda" : "#f8d7da",
              color: alert.type === "success" ? "#155724" : "#721c24",
            }}
          >
            {alert.message}
          </div>
        )}

        <div className="tm-body">
          {/* Stats + Progress */}
          <div className="tm-stats">
            {[
              { label: "Total", value: tasks.length, color: "#1a1a2e" },
              { label: "Completed", value: completed, color: "#28a745" },
              { label: "Pending", value: tasks.length - completed, color: "#e67e22" },
            ].map((s) => (
              <div className="tm-stat-card" key={s.label}>
                <div className="tm-stat-num" style={{ color: s.color }}>{s.value}</div>
                <div className="tm-stat-label">{s.label}</div>
              </div>
            ))}

            {tasks.length > 0 && (
              <div className="tm-progress-card">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.72rem", color: "#888", fontWeight: 500 }}>Progress</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1a1a2e" }}>{progress}%</span>
                </div>
                <div className="tm-progress-bar-bg">
                  <div className="tm-progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Table card */}
          <div className="tm-table-card">
            {/* Desktop head */}
            <div className="tm-thead">
              <span></span>
              <span>Title</span>
              <span className="tm-col-desc">Description</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="tm-body-scroll">
              {loading ? (
                <div className="tm-center">
                  <span>Loading tasks…</span>
                </div>
              ) : sortedTasks.length === 0 ? (
                <div className="tm-center">
                  <span style={{ fontSize: "2rem" }}>📋</span>
                  <span>No tasks yet.</span>
                  <button
                    className="tm-nav-btn"
                    style={{ backgroundColor: "#1a1a2e" }}
                    onClick={() => navigate("/create-task")}
                  >
                    Create Task
                  </button>
                </div>
              ) : (
                sortedTasks.map((task, i) => (
                  <div
                    key={task.id}
                    className="tm-row"
                    style={{
                      backgroundColor: task.completed ? "#f6fef9" : "#fff",
                      borderLeft: `3px solid ${task.completed ? "#28a745" : "transparent"}`,
                      borderBottom: i < sortedTasks.length - 1 ? "1px solid #f1f3f5" : "none",
                    }}
                  >
                    {/* Mobile layout uses row-top / row-bottom wrappers */}
                    {/* Desktop: grid columns line up naturally */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task)}
                      style={{ width: "15px", height: "15px", cursor: "pointer", accentColor: "#28a745", flexShrink: 0 }}
                    />

                    <span
                      className="tm-title"
                      style={{
                        color: task.completed ? "#aaa" : "#1a1a2e",
                        textDecoration: task.completed ? "line-through" : "none",
                      }}
                    >
                      {task.title}
                    </span>

                    <span className="tm-desc">{task.description || "—"}</span>

                    <span>
                      <span
                        className="tm-badge"
                        style={{
                          backgroundColor: task.completed ? "#d4edda" : "#fff3cd",
                          color: task.completed ? "#155724" : "#856404",
                        }}
                      >
                        {task.completed ? "Done" : "Pending"}
                      </span>
                    </span>

                    <div className="tm-actions">
                      <button className="tm-btn-edit" onClick={() => navigate(`/edit-task/${task.id}`)}>Edit</button>
                      <button className="tm-btn-del" onClick={() => handleDelete(task.id)}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
