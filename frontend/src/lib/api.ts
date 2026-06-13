const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const apiCache = new Map<string, { data: any; expiresAt: number }>();

export function clearApiCache(prefix?: string) {
  if (!prefix) {
    apiCache.clear();
  } else {
    for (const key of apiCache.keys()) {
      if (key.startsWith(prefix)) {
        apiCache.delete(key);
      }
    }
  }
}

async function request(path: string, options: RequestInit = {}, useCache: boolean = false, cacheTtlSec: number = 60) {
  if (useCache && typeof window !== 'undefined' && (!options.method || options.method === 'GET')) {
    const cached = apiCache.get(path);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data; // Return cached response
    }
  }

  let res: Response;
  
  const headers: Record<string, string> = {
    ...options.headers as any,
  };

  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      headers['x-refresh-token'] = refreshToken;
    }
  }

  try {
    res = await fetch(`${BACKEND_URL}${path}`, {
      credentials: 'include',
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new Error(`Network error when fetching ${BACKEND_URL}${path}: ${err.message}`);
  }

  if (typeof window !== 'undefined') {
    const newAccess = res.headers.get('X-New-Access-Token');
    const newRefresh = res.headers.get('X-New-Refresh-Token');
    if (newAccess) localStorage.setItem('accessToken', newAccess);
    if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch (err) {
    // non-json response
    if (!res.ok) throw new Error(`Server error ${res.status} when fetching ${path}`);
    return null;
  }

  if (data && typeof window !== 'undefined') {
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  }

  if (!res.ok) {
    throw new Error(data?.error || `Lỗi khi kết nối server (status ${res.status})`);
  }

  if (useCache && typeof window !== 'undefined' && data) {
    apiCache.set(path, { data, expiresAt: Date.now() + cacheTtlSec * 1000 });
  }

  return data;
}

export async function registerUser(payload: { name: string; email: string; password: string; role: string; }) {
  return request('/auth/register', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: { email: string; password: string; }) {
  return request('/auth/login', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  return request('/auth/logout', {
    method: 'POST',
    headers: jsonHeaders,
  });
}

export async function fetchCurrentUser() {
  return request('/auth/me');
}

export async function updateProfile(payload: { name: string; phone: string; gender: string; avatar: string; }) {
  return request('/auth/profile', {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function fetchPosts(type: 'student' | 'tutor') {
  return request(`/posts?type=${type}`, {}, true, 120);
}

export async function fetchMyPosts() {
  return request('/posts/mine');
}

export async function fetchTutors(params?: {
  subject?: string;
  grade?: string;
  location?: string;
  region?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.subject) qs.set('subject', params.subject);
  if (params?.grade) qs.set('grade', params.grade);
  if (params?.location) qs.set('location', params.location);
  if (params?.region) qs.set('region', params.region);
  if (params?.gender) qs.set('gender', params.gender);
  if (params?.minPrice != null) qs.set('minPrice', String(params.minPrice));
  if (params?.maxPrice != null) qs.set('maxPrice', String(params.maxPrice));
  const query = qs.toString();
  return request(`/tutors${query ? `?${query}` : ''}`, {}, true, 120);
}

export async function fetchTutorById(id: number) {
  return request(`/tutors/${id}`);
}

export async function updateTutorProfile(payload: {
  subjects?: string;
  grades?: string;
  location?: string;
  region?: string;
  price_per_hour?: number;
  bio?: string;
  experience_years?: number;
  formats?: string;
  is_accepting?: boolean;
}) {
  clearApiCache('/tutors');
  return request('/tutors/profile', {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function fetchUserById(id: number) {
  return request(`/users/${id}`);
}

export async function fetchAllUsers() {
  return request('/users');
}

export async function updateUserRole(id: number, role: string) {
  return request(`/users/${id}/role`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ role }),
  });
}

export async function deleteUser(id: number) {
  return request(`/users/${id}`, { method: 'DELETE' });
}

export async function createPost(payload: any) {
  clearApiCache('/posts');
  return request('/posts', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function updatePost(id: number, payload: any) {
  clearApiCache('/posts');
  return request(`/posts/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function deletePost(id: number) {
  clearApiCache('/posts');
  return request(`/posts/${id}`, {
    method: 'DELETE',
  });
}

export async function changePostStatus(id: number, status: string) {
  return updatePost(id, { status });
}

export async function fetchReviews(tutorId: number) {
  return request(`/reviews/tutor/${tutorId}`);
}

export async function postReview(payload: { tutor_id: number; stars: number; content?: string }) {
  return request('/reviews', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function fetchComments(entityType: string, entityId: number) {
  return request(`/comments?entity_type=${encodeURIComponent(entityType)}&entity_id=${entityId}`);
}

export async function postComment(payload: { entity_type: string; entity_id: number; parent_id?: number | null; content: string }) {
  return request('/comments', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function applyToPost(postId: number) {
  return request('/applications', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ post_id: postId }),
  });
}

export async function fetchApplicationsForPost(postId: number) {
  return request(`/applications/post/${postId}`);
}

export async function fetchMyApplications() {
  return request('/applications/me');
}

export async function fetchReceivedApplications() {
  return request('/applications/received');
}

export async function updateApplicationStatus(id: number, status: 'accepted' | 'rejected') {
  return request(`/applications/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ status }),
  });
}

export async function saveStudentProfile(studentId: number) {
  return request('/saved-students', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ student_id: studentId }),
  });
}

export async function unsaveStudentProfile(studentId: number) {
  return request('/saved-students', {
    method: 'DELETE',
    headers: jsonHeaders,
    body: JSON.stringify({ student_id: studentId }),
  });
}

export async function fetchSavedStudentsForTutor(tutorId: number) {
  return request(`/saved-students/tutor/${tutorId}`);
}

export async function saveTutorProfile(tutorId: number) {
  return request('/saved-tutors', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ tutor_id: tutorId }),
  });
}

export async function unsaveTutorProfile(tutorId: number) {
  return request('/saved-tutors', {
    method: 'DELETE',
    headers: jsonHeaders,
    body: JSON.stringify({ tutor_id: tutorId }),
  });
}

export async function fetchSavedTutorsForStudent(studentId: number) {
  return request(`/saved-tutors/student/${studentId}`);
}

export async function sendMessage(payload: { receiver_id: number; content: string }) {
  return request('/messages', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function fetchConversation(otherId: number) {
  return request(`/messages/conversation?other=${otherId}`);
}

export async function fetchInbox() {
  return request('/messages/inbox');
}

export async function fetchMessageThreads() {
  return request('/messages/threads');
}

export async function markMessagesRead(otherId: number) {
  return request('/messages/read', {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ other_id: otherId }),
  });
}

export async function fetchUnreadCount() {
  return request('/messages/unread-count');
}

export async function fetchReports(status?: string) {
  return request(`/reports${status ? `?status=${encodeURIComponent(status)}` : ''}`);
}

export async function createReport(payload: { target_type: string; target_id: number; reason?: string; content?: string }) {
  return request('/reports', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  });
}

export async function updateReportStatus(id: number, status: string) {
  return request(`/reports/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ status }),
  });
}
