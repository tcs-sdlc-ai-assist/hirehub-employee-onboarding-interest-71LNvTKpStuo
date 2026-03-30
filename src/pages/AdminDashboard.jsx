import { useState, useEffect, useMemo } from 'react';
import { getAll, update, deleteSubmission } from '../utils/submissionStore';
import { validateSubmission, ALLOWED_DEPARTMENTS } from '../utils/validationUtils';

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });
  const [editErrors, setEditErrors] = useState({});
  const [editErrorMessage, setEditErrorMessage] = useState('');
  const [deletingSubmission, setDeletingSubmission] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setSubmissions(getAll());
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const stats = useMemo(() => {
    const total = submissions.length;
    const uniqueDepartments = new Set(
      submissions.map((s) => s.department).filter(Boolean)
    ).size;
    let latestDate = '';
    if (total > 0) {
      const sorted = [...submissions].sort(
        (a, b) => new Date(b.submittedOn) - new Date(a.submittedOn)
      );
      latestDate = formatDate(sorted[0].submittedOn);
    }
    return { total, uniqueDepartments, latestDate };
  }, [submissions]);

  function formatDate(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  }

  function handleEditClick(submission) {
    setEditingSubmission(submission);
    setEditFormData({
      fullName: submission.fullName || '',
      email: submission.email || '',
      mobile: submission.mobile || '',
      department: submission.department || '',
    });
    setEditErrors({});
    setEditErrorMessage('');
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name]) {
      setEditErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    setEditErrorMessage('');

    const validation = validateSubmission(editFormData);

    if (!validation.isValid) {
      setEditErrors(validation.errors);
      return;
    }

    setEditErrors({});

    const result = update(editingSubmission.id, {
      fullName: editFormData.fullName,
      mobile: editFormData.mobile,
      department: editFormData.department,
    });

    if (result.success) {
      setSubmissions(getAll());
      setEditingSubmission(null);
      setSuccessMessage('Submission updated successfully!');
    } else {
      setEditErrorMessage(result.error || 'Unable to update. Please try again.');
    }
  }

  function handleEditCancel() {
    setEditingSubmission(null);
    setEditErrors({});
    setEditErrorMessage('');
  }

  function handleDeleteClick(submission) {
    setDeletingSubmission(submission);
  }

  function handleDeleteConfirm() {
    if (!deletingSubmission) return;

    const result = deleteSubmission(deletingSubmission.id);

    if (result.success) {
      setSubmissions(getAll());
      setDeletingSubmission(null);
      setSuccessMessage('Submission deleted successfully!');
    } else {
      setDeletingSubmission(null);
    }
  }

  function handleDeleteCancel() {
    setDeletingSubmission(null);
  }

  return (
    <div className="admin-dashboard-page">
      <h1 className="form-heading">Admin Dashboard</h1>
      <p className="form-subheading">
        Manage all candidate submissions from one place.
      </p>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-card-title">Total Submissions</h3>
          <p className="stat-card-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-card-title">Departments</h3>
          <p className="stat-card-value">{stats.uniqueDepartments}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-card-title">Latest Submission</h3>
          <p className="stat-card-value">
            {stats.latestDate || 'N/A'}
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="empty-state">
          <p>No submissions yet.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Department</th>
                <th>Submitted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={submission.id}>
                  <td>{index + 1}</td>
                  <td>{submission.fullName}</td>
                  <td>{submission.email}</td>
                  <td>{submission.mobile}</td>
                  <td>
                    <span className="department-badge">
                      {submission.department}
                    </span>
                  </td>
                  <td>{formatDate(submission.submittedOn)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEditClick(submission)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDeleteClick(submission)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingSubmission && (
        <div className="modal-overlay" onClick={handleEditCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-heading">Edit Submission</h2>

            {editErrorMessage && (
              <div className="alert alert-error">{editErrorMessage}</div>
            )}

            <form className="modal-form" onSubmit={handleEditSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="edit-fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  id="edit-fullName"
                  name="fullName"
                  className={`form-input ${editErrors.fullName ? 'form-input-error' : ''}`}
                  value={editFormData.fullName}
                  onChange={handleEditChange}
                  placeholder="Enter full name"
                  maxLength={100}
                />
                {editErrors.fullName && (
                  <span className="field-error">{editErrors.fullName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="edit-email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  className="form-input"
                  value={editFormData.email}
                  readOnly
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-mobile" className="form-label">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="edit-mobile"
                  name="mobile"
                  className={`form-input ${editErrors.mobile ? 'form-input-error' : ''}`}
                  value={editFormData.mobile}
                  onChange={handleEditChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
                {editErrors.mobile && (
                  <span className="field-error">{editErrors.mobile}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="edit-department" className="form-label">
                  Department
                </label>
                <select
                  id="edit-department"
                  name="department"
                  className={`form-input ${editErrors.department ? 'form-input-error' : ''}`}
                  value={editFormData.department}
                  onChange={handleEditChange}
                >
                  <option value="">Select a department</option>
                  {ALLOWED_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {editErrors.department && (
                  <span className="field-error">{editErrors.department}</span>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleEditCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingSubmission && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-heading">Confirm Deletion</h2>
            <p className="modal-text">
              Are you sure you want to delete the submission from{' '}
              <strong>{deletingSubmission.fullName}</strong> ({deletingSubmission.email})?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-delete"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}