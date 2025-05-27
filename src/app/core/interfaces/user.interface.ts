export interface User {
  userId: number; // Java int maps to number
  userName: string;
  email: string;
  password?: string; // Optional, might not always be sent/needed from backend
  address?: string; // Optional based on usage
  contact?: string; // Optional based on usage
  type?: string;    // Optional based on usage, e.g., 'Active', 'Inactive'
}