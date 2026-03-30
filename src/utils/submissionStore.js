const STORAGE_KEY = 'hirehub_submissions';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      reset();
      return [];
    }
    return parsed;
  } catch {
    console.error('Failed to parse submissions from localStorage. Resetting.');
    reset();
    return [];
  }
}

export function add(submission) {
  if (!submission || !submission.email || !submission.email.trim()) {
    return { success: false, error: 'Email is required.' };
  }

  try {
    const all = getAll();
    const duplicate = all.find(
      (s) => s.email.trim().toLowerCase() === submission.email.trim().toLowerCase()
    );

    if (duplicate) {
      return { success: false, error: 'A submission with this email already exists.' };
    }

    const newSubmission = {
      id: generateId(),
      fullName: submission.fullName ? submission.fullName.trim() : '',
      email: submission.email.trim(),
      mobile: submission.mobile ? submission.mobile.trim() : '',
      department: submission.department ? submission.department.trim() : '',
      submittedOn: new Date().toISOString(),
    };

    all.push(newSubmission);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return { success: true };
  } catch {
    console.error('Failed to save submission to localStorage.');
    reset();
    return { success: false, error: 'Unable to save submission. Please try again.' };
  }
}

export function update(id, data) {
  if (!id) {
    return { success: false, error: 'Submission ID is required.' };
  }

  try {
    const all = getAll();
    const index = all.findIndex((s) => s.id === id);

    if (index === -1) {
      return { success: false, error: 'Submission not found.' };
    }

    const updated = { ...all[index] };

    if (data.fullName !== undefined) {
      updated.fullName = data.fullName.trim();
    }
    if (data.mobile !== undefined) {
      updated.mobile = data.mobile.trim();
    }
    if (data.department !== undefined) {
      updated.department = data.department.trim();
    }

    all[index] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return { success: true };
  } catch {
    console.error('Failed to update submission in localStorage.');
    return { success: false, error: 'Unable to update submission. Please try again.' };
  }
}

export function deleteSubmission(id) {
  if (!id) {
    return { success: false, error: 'Submission ID is required.' };
  }

  try {
    const all = getAll();
    const index = all.findIndex((s) => s.id === id);

    if (index === -1) {
      return { success: false, error: 'Submission not found.' };
    }

    all.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return { success: true };
  } catch {
    console.error('Failed to delete submission from localStorage.');
    return { success: false, error: 'Unable to delete submission. Please try again.' };
  }
}

export function reset() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch {
    console.error('Failed to reset submissions in localStorage.');
  }
}