import { makeRequest } from "./makeRequest";
import { 
  mockUsers, 
  mockProjects, 
  mockPrograms, 
  mockBudgets, 
  mockExpenses, 
  mockRisks, 
  mockDocuments, 
  mockTasks, 
  mockTeamMembers, 
  mockNotifications 
} from "./mockData";

// Real API configuration for connecting to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:1200/api";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Check if we should use mock data (when backend is not available)
const shouldUseMockData = () => {
  return import.meta.env.VITE_USE_MOCK_DATA === "true";
};

// Helper function to make authenticated requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  // Use mock data if backend is not available
  if (shouldUseMockData()) {
    return getMockData(endpoint, options);
  }

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
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Mock data handler
const getMockData = async (endpoint: string, options: RequestInit = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const method = options.method || "GET";
  
  // Handle different endpoints
  switch (true) {
    case endpoint === "/users/me":
      return mockUsers[0];
    
    case endpoint === "/users" && method === "GET":
      return mockTeamMembers;
    
    case endpoint === "/projects" && method === "GET":
      return mockProjects;
    
    case endpoint === "/programs" && method === "GET":
      return mockPrograms;
    
    case endpoint === "/tasks" && method === "GET":
      return mockTasks;
    
    case endpoint === "/budgets" && method === "GET":
      return mockBudgets;
    
    case endpoint === "/expenses" && method === "GET":
      return mockExpenses;
    
    case endpoint === "/risks" && method === "GET":
      return mockRisks;
    
    case endpoint === "/documents" && method === "GET":
      return mockDocuments;
    
    case endpoint === "/notifications" && method === "GET":
      return mockNotifications;
    
    case method === "POST":
      // For POST requests, return the data with a mock ID
      const body = JSON.parse(options.body as string || "{}");
      return { _id: Date.now().toString(), ...body };
    
    case method === "PUT":
      // For PUT requests, return success
      const updateBody = JSON.parse(options.body as string || "{}");
      return { success: true, ...updateBody };
    
    case method === "DELETE":
      // For DELETE requests, return success
      return { success: true, message: "Deleted successfully" };
    
    default:
      return [];
  }
};

export const api = {
}