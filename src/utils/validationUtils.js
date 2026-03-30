const ALLOWED_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Design',
  'Product',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-z\s]+$/;
const MOBILE_REGEX = /^\d{10}$/;

export function validateSubmission(submission) {
  const errors = {};

  // Full Name: required, max 100 chars, letters/spaces only
  if (!submission.fullName || !submission.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (submission.fullName.trim().length > 100) {
    errors.fullName = 'Full name must be 100 characters or less.';
  } else if (!NAME_REGEX.test(submission.fullName.trim())) {
    errors.fullName = 'Full name must contain only alphabets and spaces.';
  }

  // Email: required, valid format
  if (!submission.email || !submission.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(submission.email.trim())) {
    errors.email = 'Invalid email format.';
  }

  // Mobile: required, exactly 10 digits
  if (!submission.mobile || !submission.mobile.trim()) {
    errors.mobile = 'Mobile number is required.';
  } else if (!MOBILE_REGEX.test(submission.mobile.trim())) {
    errors.mobile = 'Mobile number must be exactly 10 digits.';
  }

  // Department: required, must be one of allowed values
  if (!submission.department || !submission.department.trim()) {
    errors.department = 'Department is required.';
  } else if (!ALLOWED_DEPARTMENTS.includes(submission.department.trim())) {
    errors.department = 'Please select a valid department.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export { ALLOWED_DEPARTMENTS };