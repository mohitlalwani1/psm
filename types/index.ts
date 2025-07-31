export type Role = "admin" | "manager" | "member";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (token: string) => Promise<void>;
  firebaseGoogleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on-hold" | "completed";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  manager: User;
  projects: Project[];
  risks: Risk[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "not-started" | "in-progress" | "on-hold" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  manager: User;
  team: User[];
  tasks: Task[];
  programId?: string;
  risks: Risk[];
  documents: Document[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  assignee: User;
  reporter: User;
  projectId: string;
  startDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  tags: string[];
}

export interface Risk {
  _id: string;
  title: string;
  status: string;
  owner: string;
  project?: string;
  program?: string;
  createdAt: string;
}

export interface Document {
  _id: string;
  name: string;
  url: string;
  size: number;
  uploadedBy: string;
  project: string;
  type: string;
  version: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: "created" | "updated" | "completed" | "assigned" | "commented";
  entity: "project" | "task" | "risk" | "document";
  entityId: string;
  entityName: string;
  user: User;
  description: string;
  timestamp: string;
}
