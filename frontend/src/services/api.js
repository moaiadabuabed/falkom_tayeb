const API_BASE_URL = 'http://localhost:5000/api';

export const isOffline = () => !navigator.onLine;

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

async function handleResponse(response) {
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'حدث خطأ في الاتصال بالسيرفر');
  }
  return data;
}

export async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  return handleResponse(res);
}

export const api = {
  // --- AUTHENTICATION ---
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  // --- EVENTS ---
  requestEvent: async (eventData) => {
    const res = await fetch(`${API_BASE_URL}/events/request-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(eventData)
    });
    return handleResponse(res);
  },

  getMyEvents: async () => {
    const res = await fetch(`${API_BASE_URL}/events/my-events`, {
      method: 'GET',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // --- PUBLIC DATA ---
  getServices: async () => {
    const res = await fetch(`${API_BASE_URL}/services`);
    return handleResponse(res);
  },

  getGallery: async () => {
    const res = await fetch(`${API_BASE_URL}/gallery`);
    return handleResponse(res);
  },

  submitContact: async (contactData) => {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    return handleResponse(res);
  },

  getPackageRequirements: async (eventType, packageType) => {
    const query = new URLSearchParams({ eventType, packageType }).toString();
    const res = await fetch(`${API_BASE_URL}/packages/requirements?${query}`);
    return handleResponse(res);
  },

  // --- ADMIN ENDPOINTS ---
  adminGetEvents: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/events`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  adminUpdateEvent: async (id, status, adminRemarks) => {
    const res = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ 
        status: status || 'Pending', 
        adminRemarks: adminRemarks || '' 
      })
    });
    return handleResponse(res);
  },

  adminDeleteEvent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/events/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  adminGetUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  adminDeleteUser: async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  adminAddGalleryImage: async (imageData) => {
    const res = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(imageData)
    });
    return handleResponse(res);
  },

  adminDeleteGalleryImage: async (id) => {
    const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  adminAddService: async (serviceData) => {
    const res = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(serviceData)
    });
    return handleResponse(res);
  },

  adminDeleteService: async (id) => {
    const res = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  adminAddPackageRequirement: async (requirementData) => {
    const res = await fetch(`${API_BASE_URL}/packages/requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(requirementData)
    });
    return handleResponse(res);
  },

  adminDeletePackageRequirement: async (id) => {
    const res = await fetch(`${API_BASE_URL}/packages/requirements/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // --- ADMIN CONTACT MESSAGES ---
  adminGetContactMessages: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/contact-messages`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  adminDeleteContactMessage: async (id) => {
    const res = await fetch(`${API_BASE_URL}/admin/contact-messages/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  }
};