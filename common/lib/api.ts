import { AUTH_SERVICE_URL, API_SERVICE_URL } from '@privschool-lms/common/config';

export async function register(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Registration failed');
  }

  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Login failed');
  }

  return response.json();
}

export async function submitOnboarding(data: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: number;
  currentSchool: string;
  targetSchools: string[];
  testType: string;
  needsEnglishProficiency: boolean;
  interests: string[];
  applicationDeadline?: string;
}, token: string) {
  const response = await fetch(`${API_SERVICE_URL}/onboarding/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Onboarding failed');
  }

  return response.json();
}

export async function createStudentProfile(data: any, token: string) {
  const response = await fetch(`${API_SERVICE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Failed to create student profile');
  }

  return response.json();
}

export async function getStudentProfile(token: string) {
  const response = await fetch(`${API_SERVICE_URL}/students`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || error.error || 'Failed to get student profile');
  }

  return response.json();
}