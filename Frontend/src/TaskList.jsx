import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, deleteTask, updateTask } from "../services/taskService";

export const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      showAlert("danger", "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showAlert("success", "Task deleted successfully.");
    } catch {
      showAlert("danger", "Failed to delete task.");
    }
  };

  const handleToggle = async (task) => {
    try {
      const updated = await updateTask(task.id, {
        ...task,
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch {
      showAlert("danger", "Failed to update task.");
    }
  };

  const completed = tasks.filter((t) => t.completed).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav
        className="navbar navbar-dark sticky-top"
        style={{ backgroundColor: "#2c3e50" }}
      >
        <div className="container-fluid px-3">
          <span className="navbar-brand fw-semibold" style={{ fontSize: "clamp(0.95rem, 4vw, 1.1rem)" }}>
            ✓ Task Manager
          </span>
          <button
            className="btn btn-sm btn-light fw-medium"
            style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            onClick={() => navigate("/create-task")}
          >
            + New Task
          </button>
        </div>
      </nav>

      <div className="container-fluid px-3 px-md-4 py-3" style={{ maxWidth: "720px" }}>
        {/* Alert */}
        {alert && (
          <div
            className={`alert alert-${alert.type} alert-dismissible py-2 px-3`}
            role="alert"
            style={{ fontSize: "0.875rem" }}
          >
            {alert.message}
            <button
              type="button"
              className="btn-close btn-sm"
              onClick={() => setAlert(null)}
            />
          </div>
        )}

        {/* Stats Row — 3 equal columns on all sizes */}
        <div className="row g-2 mb-3">
          {[
            { label: "Total", value: tasks.length, color: "#2c3e50" },
            { label: "Done", value: completed, color: "#27ae60" },
            { label: "Pending", value: tasks.length - completed, color: "#e67e22" },
          ].map((stat) => (
            <div className="col-4" key={stat.label}>
              <div className="card border-0 shadow-sm text-center py-2 py-md-3 h-100">
                <div
                  className="fw-bold"
                  style={{
                    color: stat.color,
                    fontSize: "clamp(1.25rem, 5vw, 1.75rem)",
                    lineHeight: 1.1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-muted"
                  style={{ fontSize: "clamp(0.65rem, 2.5vw, 0.78rem)" }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="card border-0 shadow-sm p-3 mb-3">
            <div className="d-flex justify-content-between mb-1">
              <small className="text-muted fw-medium" style={{ fontSize: "0.78rem" }}>
                Overall Progress
              </small>
              <small className="fw-semibold" style={{ color: "#2c3e50", fontSize: "0.78rem" }}>
                {progress}%
              </small>
            </div>
            <div className="progress" style={{ height: "7px", borderRadius: "4px" }}>
              <div
                className="progress-bar"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#27ae60",
                  transition: "width 0.4s ease",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        )}

        {/* Task List Card */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom py-2 px-3">
            <h6 className="mb-0 fw-semibold" style={{ color: "#2c3e50", fontSize: "0.9rem" }}>
              All Tasks{" "}
              {tasks.length > 0 && (
                <span className="badge bg-secondary ms-1" style={{ fontSize: "0.7rem", fontWeight: 500 }}>
                  {tasks.length}
                </span>
              )}
            </h6>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-secondary" style={{ width: "1.5rem", height: "1.5rem" }} />
              <p className="text-muted mt-2 small">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-5 px-3 text-muted">
              <div style={{ fontSize: "2.5rem" }}>📋</div>
              <p className="mb-1 mt-2 fw-medium" style={{ fontSize: "0.9rem" }}>No tasks yet</p>
              <p className="mb-3 small">Add your first task to get started.</p>
              <button
                className="btn btn-sm text-white px-4"
                style={{ backgroundColor: "#2c3e50" }}
                onClick={() => navigate("/create-task")}
              >
                Create Task
              </button>
            </div>
          ) : (
            <ul className="list-group list-group-flush">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="list-group-item px-3 py-3"
                  style={{
                    backgroundColor: task.completed ? "#f0faf4" : "#fff",
                    borderLeft: `4px solid ${task.completed ? "#27ae60" : "#dee2e6"}`,
                  }}
                >
                  {/* Top row: checkbox + title + badge */}
                  <div className="d-flex align-items-start gap-2">
                    <input
                      type="checkbox"
                      className="form-check-input flex-shrink-0"
                      checked={task.completed}
                      onChange={() => handleToggle(task)}
                      style={{
                        width: "18px",
                        height: "18px",
                        marginTop: "2px",
                        cursor: "pointer",
                        accentColor: "#27ae60",
                      }}
                    />

                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span
                          className="fw-medium"
                          style={{
                            fontSize: "clamp(0.82rem, 3.5vw, 0.95rem)",
                            textDecoration: task.completed ? "line-through" : "none",
                            color: task.completed ? "#6c757d" : "#2c3e50",
                            wordBreak: "break-word",
                          }}
                        >
                          {task.title}
                        </span>
                        {task.completed && (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: "#27ae60",
                              fontSize: "0.65rem",
                              padding: "2px 6px",
                            }}
                          >
                            Done
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p
                          className="mb-0 mt-1 text-muted"
                          style={{
                            fontSize: "clamp(0.73rem, 3vw, 0.82rem)",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {task.description}
                        </p>
                      )}

                      {/* Action buttons below content on mobile */}
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          style={{ fontSize: "0.73rem", padding: "2px 10px" }}
                          onClick={() => navigate(`/edit-task/${task.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          style={{ fontSize: "0.73rem", padding: "2px 10px" }}
                          onClick={() => handleDelete(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        {tasks.length > 0 && (
          <p className="text-center text-muted mt-3" style={{ fontSize: "0.72rem" }}>
            Tap a checkbox to mark a task complete
          </p>
        )}
      </div>
    </div>
  );
};
