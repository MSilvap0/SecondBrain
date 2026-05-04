import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateWorkspaceInput {
  name: string;
  description?: string;
}

export interface CreatePageInput {
  title: string;
  content: string;
  workspaceId: string;
  parentId?: string;
  icon?: string;
  cover?: string;
}

export interface CreateBlockInput {
  type: string;
  content: string;
  order: number;
  pageId: string;
  metadata?: Record<string, any>;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}
