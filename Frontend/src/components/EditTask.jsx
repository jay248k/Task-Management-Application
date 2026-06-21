import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTasks, updateTask } from "../services/taskService";

export const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "", completed: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const tasks = await getTasks();
        const task = tasks.find((t) => String(t.id) === String(id));
        if (!task) {
          setAlert({ type: "danger", message: "Task not found." });
          setLoading(false);
          return;
        }
        setForm({ title: task.title, description: task.description || "", completed: task.completed });
      } catch {
        setAlert({ type: "danger", message: "Failed to load task." });
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (form.title.trim().length > 100) errs.title = "Title must be under 100 characters.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setSaving(true);
    try {
      await updateTask(id, { ...form, id });
      setAlert({ type: "success", message: "Task updated successfully!" });
      setTimeout(() => navigate("/"), 1200);
    } catch {
      setAlert({ type: "danger", message: "Failed to update task. Please try again." });
      setSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav className="navbar navbar-dark" style={{ backgroundColor: "#2c3e50" }}>
        <div className="container">
          <button
            className="btn btn-link text-white text-decoration-none ps-0"
            onClick={() => navigate("/")}
          >
            ← Back
          </button>
          <span className="navbar-brand fw-semibold fs-5 me-0">Edit Task</span>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-6">
            {/* Header */}
            <div className="mb-4">
              <h4 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>
                Edit Task
              </h4>
              <p className="text-muted small mb-0">Update the task details below.</p>
            </div>

            {/* Alert */}
            {alert && (
              <div className={`alert alert-${alert.type} py-2`} role="alert">
                {alert.message}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-secondary" />
                <p className="text-muted mt-3 small">Loading task...</p>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Title */}
                    <div className="mb-3">
                      <label className="form-label fw-medium small" style={{ color: "#2c3e50" }}>
                        Task Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                        placeholder="e.g. Review project proposal"
                        value={form.title}
                        onChange={handleChange}
                        autoFocus
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label className="form-label fw-medium small" style={{ color: "#2c3e50" }}>
                        Description
                        <span className="text-muted fw-normal ms-1">(optional)</span>
                      </label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows={4}
                        placeholder="Add more details about this task..."
                        value={form.description}
                        onChange={handleChange}
                        style={{ resize: "vertical" }}
                      />
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="completed"
                          className="form-check-input"
                          id="completedCheck"
                          checked={form.completed}
                          onChange={handleChange}
                          style={{ width: "16px", height: "16px" }}
                        />
                        <label
                          className="form-check-label small fw-medium ms-1"
                          htmlFor="completedCheck"
                          style={{ color: "#2c3e50" }}
                        >
                          Mark as completed
                        </label>
                      </div>
                    </div>

                    {/* Status Preview */}
                    <div
                      className="rounded p-3 mb-4 small"
                      style={{ backgroundColor: "#f0f4f8", color: "#555" }}
                    >
                      <span className="fw-medium">Current Status: </span>
                      {form.completed ? (
                        <span className="badge" style={{ backgroundColor: "#27ae60" }}>
                          Completed
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark">Pending</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn text-white flex-grow-1 fw-medium"
                        style={{ backgroundColor: "#2c3e50" }}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/")}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
