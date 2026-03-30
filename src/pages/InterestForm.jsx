import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { validateSubmission, ALLOWED_DEPARTMENTS } from '../utils/validationUtils';
import { add } from '../utils/submissionStore';

export default function InterestForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const validation = validateSubmission(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});

    const result = add({
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      department: formData.department,
    });

    if (result.success) {
      setSuccessMessage('Your interest has been submitted successfully!');
      setFormData({
        fullName: '',
        email: '',
        mobile: '',
        department: '',
      });
    } else {
      setErrorMessage(result.error || 'Unable to submit. Please try again.');
    }
  }

  return (
    <div className="interest-form-page">
      <h1 className="form-heading">Express Your Interest</h1>
      <p className="form-subheading">
        Fill out the form below to let us know you're interested in joining HireHub.
      </p>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="alert alert-error">{errorMessage}</div>
      )}

      <form className="interest-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className={`form-input ${errors.fullName ? 'form-input-error' : ''}`}
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            maxLength={100}
          />
          {errors.fullName && (
            <span className="field-error">{errors.fullName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <span className="field-error">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="mobile" className="form-label">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            className={`form-input ${errors.mobile ? 'form-input-error' : ''}`}
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your 10-digit mobile number"
            maxLength={10}
          />
          {errors.mobile && (
            <span className="field-error">{errors.mobile}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="department" className="form-label">
            Department
          </label>
          <select
            id="department"
            name="department"
            className={`form-input ${errors.department ? 'form-input-error' : ''}`}
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select a department</option>
            {ALLOWED_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <span className="field-error">{errors.department}</span>
          )}
        </div>

        <button type="submit" className="btn btn-primary form-submit">
          Submit
        </button>
      </form>

      <div className="form-back-link">
        <Link to="/" className="nav-link">
          Back to Home
        </Link>
      </div>
    </div>
  );
}