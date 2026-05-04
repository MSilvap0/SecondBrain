import { Response } from 'express';
import Tag from '../models/Tag';
import { AuthRequest } from '../types';

export const createTag = async (req: AuthRequest, res: Response) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const tag = await Tag.create({
      name,
      color: color || '#6366f1',
      userId: req.userId,
    });

    res.status(201).json({ tag });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTags = async (req: AuthRequest, res: Response) => {
  try {
    const tags = await Tag.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.json({ tags });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTag = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const tag = await Tag.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { name, color },
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ tag });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTag = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findOneAndDelete({ _id: id, userId: req.userId });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
