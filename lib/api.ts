// Real API configuration for connecting to backend
const API_BASE_URL = "http://localhost:1200/api";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function to make authenticated requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      return await makeRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    },

    register: async (name: string, email: string, password: string) => {
      return await makeRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
    },

    googleLogin: async (token: string) => {
      return await makeRequest("/auth/google", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
    },

    forgotPassword: async (email: string) => {
      return await makeRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },

    resetPassword: async (token: string, newPassword: string) => {
      return await makeRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
      });
    },
  },

  // User endpoints
  users: {
    getProfile: async () => {
      return await makeRequest("/users/me");
    },

    updateProfile: async (data: any) => {
      return await makeRequest("/users/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
  },

  // Project endpoints
  projects: {
    getAll: async () => {
      return await makeRequest("/projects");
    },

    create: async (data: any) => {
      return await makeRequest("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: any) => {
      return await makeRequest(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return await makeRequest(`/projects/${id}`, {
        method: "DELETE",
      });
    },

    getById: async (id: string) => {
      return await makeRequest(`/projects/${id}`);
    },
  },

  // Task endpoints
  tasks: {
    getAll: async () => {
      return await makeRequest("/tasks");
    },

    create: async (data: any) => {
      return await makeRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: any) => {
      return await makeRequest(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return await makeRequest(`/tasks/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Budget endpoints
  budgets: {
    getAll: async () => {
      return await makeRequest("/budgets");
    },

    create: async (data: any) => {
      return await makeRequest("/budgets", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: any) => {
      return await makeRequest(`/budgets/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return await makeRequest(`/budgets/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Risk endpoints
  risks: {
    getAll: async () => {
      return await makeRequest("/risks");
    },

    create: async (data: any) => {
      return await makeRequest("/risks", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: any) => {
      return await makeRequest(`/risks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    delete: async (id: string) => {
      return await makeRequest(`/risks/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Document endpoints
  documents: {
    getAll: async () => {
      return await makeRequest("/documents");
    },

    upload: async (file: File, projectId: string) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);

      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },

    delete: async (id: string) => {
      return await makeRequest(`/documents/${id}`, {
        method: "DELETE",
      });
    },
  },

  // Notification endpoints
  notifications: {
    getAll: async () => {
      return await makeRequest("/notifications");
    },

    markAsRead: async (id: string) => {
      return await makeRequest(`/notifications/${id}/read`, {
        method: "PUT",
      });
    },
  },

  // Generic methods for backward compatibility
  get: async (endpoint: string) => {
    return await makeRequest(endpoint);
  },

  post: async (endpoint: string, data: any) => {
    return await makeRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put: async (endpoint: string, data: any) => {
    return await makeRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (endpoint: string) => {
    return await makeRequest(endpoint, {
      method: "DELETE",
    });
  },
};
