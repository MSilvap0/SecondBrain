export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  title: string;
  content: string;
  icon?: string;
  cover?: string;
  workspaceId: string;
  parentId?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Block {
  id: string;
  type: string;
  content: string;
  order: number;
  pageId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  userId: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}
