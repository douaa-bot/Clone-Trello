export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: string;
  column: 'todo' | 'doing' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  position: number;
  comments?: Array<{
    user: {
      _id: string;
      name: string;
    };
    text: string;
    createdAt: string;
  }>;
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: string;
  }>;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  color: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  members: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
    };
    role: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
