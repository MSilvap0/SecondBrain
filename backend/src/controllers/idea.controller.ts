import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';

export const createIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, tags } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Verificar limite do plano
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: {
        plan: true,
        ideasLimit: true,
        ideasCount: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verificar se atingiu o limite (apenas para plano free)
    if (user.plan === 'free' && user.ideasCount >= user.ideasLimit) {
      return res.status(403).json({ 
        error: 'Limite de ideias atingido',
        message: 'Você atingiu o limite de ideias do plano Free. Faça upgrade para continuar.',
        limit: user.ideasLimit,
        current: user.ideasCount
      });
    }

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        tags: tags ? JSON.stringify(tags) : null,
        isFavorite: false,
        userId: req.userId!,
      },
    });

    // Incrementar contador de ideias
    await prisma.user.update({
      where: { id: req.userId! },
      data: {
        ideasCount: {
          increment: 1,
        },
      },
    });

    // Parsear tags de volta para array
    const ideaWithParsedTags = {
      ...idea,
      tags: idea.tags ? JSON.parse(idea.tags) : [],
    };

    res.status(201).json(ideaWithParsedTags);
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getIdeas = async (req: AuthRequest, res: Response) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Parsear campos JSON
    const ideasWithParsedFields = ideas.map(idea => ({
      ...idea,
      tags: idea.tags ? JSON.parse(idea.tags) : [],
      suggestions: idea.suggestions ? JSON.parse(idea.suggestions) : undefined,
      relatedTopics: idea.relatedTopics ? JSON.parse(idea.relatedTopics) : undefined,
      chatMessages: idea.chatMessages ? JSON.parse(idea.chatMessages) : [],
      expanded: idea.expandedContent ? {
        expandedContent: idea.expandedContent,
        suggestions: idea.suggestions ? JSON.parse(idea.suggestions) : [],
        relatedTopics: idea.relatedTopics ? JSON.parse(idea.relatedTopics) : [],
      } : undefined,
    }));

    res.json(ideasWithParsedFields);
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getIdeaById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const idea = await prisma.idea.findFirst({
      where: { 
        id,
        userId: req.userId!
      },
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Parsear campos JSON
    const ideaWithParsedFields = {
      ...idea,
      tags: idea.tags ? JSON.parse(idea.tags) : [],
      suggestions: idea.suggestions ? JSON.parse(idea.suggestions) : undefined,
      relatedTopics: idea.relatedTopics ? JSON.parse(idea.relatedTopics) : undefined,
      chatMessages: idea.chatMessages ? JSON.parse(idea.chatMessages) : [],
      expanded: idea.expandedContent ? {
        expandedContent: idea.expandedContent,
        suggestions: idea.suggestions ? JSON.parse(idea.suggestions) : [],
        relatedTopics: idea.relatedTopics ? JSON.parse(idea.relatedTopics) : [],
      } : undefined,
    };

    res.json(ideaWithParsedFields);
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, tags, expanded, isFavorite, chatMessages } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    
    if (expanded !== undefined) {
      updateData.expandedContent = expanded.expandedContent;
      updateData.suggestions = expanded.suggestions ? JSON.stringify(expanded.suggestions) : null;
      updateData.relatedTopics = expanded.relatedTopics ? JSON.stringify(expanded.relatedTopics) : null;
    }

    // Salvar histórico de mensagens do chat
    if (chatMessages !== undefined) {
      updateData.chatMessages = JSON.stringify(chatMessages);
    }

    const idea = await prisma.idea.updateMany({
      where: { 
        id,
        userId: req.userId!
      },
      data: updateData,
    });

    if (idea.count === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Buscar ideia atualizada
    const updatedIdea = await prisma.idea.findUnique({
      where: { id },
    });

    if (!updatedIdea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Parsear campos JSON
    const ideaWithParsedFields = {
      ...updatedIdea,
      tags: updatedIdea.tags ? JSON.parse(updatedIdea.tags) : [],
      suggestions: updatedIdea.suggestions ? JSON.parse(updatedIdea.suggestions) : undefined,
      relatedTopics: updatedIdea.relatedTopics ? JSON.parse(updatedIdea.relatedTopics) : undefined,
      chatMessages: updatedIdea.chatMessages ? JSON.parse(updatedIdea.chatMessages) : [],
      expanded: updatedIdea.expandedContent ? {
        expandedContent: updatedIdea.expandedContent,
        suggestions: updatedIdea.suggestions ? JSON.parse(updatedIdea.suggestions) : [],
        relatedTopics: updatedIdea.relatedTopics ? JSON.parse(updatedIdea.relatedTopics) : [],
      } : undefined,
    };

    res.json(ideaWithParsedFields);
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const idea = await prisma.idea.deleteMany({
      where: { 
        id,
        userId: req.userId!
      },
    });

    if (idea.count === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.json({ message: 'Idea deleted successfully' });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const idea = await prisma.idea.findFirst({
      where: { 
        id,
        userId: req.userId!
      },
    });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: { isFavorite: !idea.isFavorite },
    });

    // Parsear campos JSON
    const ideaWithParsedFields = {
      ...updatedIdea,
      tags: updatedIdea.tags ? JSON.parse(updatedIdea.tags) : [],
      suggestions: updatedIdea.suggestions ? JSON.parse(updatedIdea.suggestions) : undefined,
      relatedTopics: updatedIdea.relatedTopics ? JSON.parse(updatedIdea.relatedTopics) : undefined,
      chatMessages: updatedIdea.chatMessages ? JSON.parse(updatedIdea.chatMessages) : [],
      expanded: updatedIdea.expandedContent ? {
        expandedContent: updatedIdea.expandedContent,
        suggestions: updatedIdea.suggestions ? JSON.parse(updatedIdea.suggestions) : [],
        relatedTopics: updatedIdea.relatedTopics ? JSON.parse(updatedIdea.relatedTopics) : [],
      } : undefined,
    };

    res.json(ideaWithParsedFields);
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: { 
        userId: req.userId!,
        isFavorite: true
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Parsear campos JSON
    const ideasWithParsedFields = ideas.map(idea => ({
      ...idea,
      tags: idea.tags ? JSON.parse(idea.tags) : [],
      suggestions: idea.suggestions ? JSON.parse(idea.suggestions) : undefined,
      relatedTopics: idea.relatedTopics ? JSON.parse(idea.relatedTopics) : undefined,
      chatMessages: idea.chatMessages ? JSON.parse(idea.chatMessages) : [],
      expanded: idea.expandedContent ? {
        expandedContent: idea.expandedContent,
        suggestions: idea.suggestions ? JSON.parse(idea.suggestions) : [],
        relatedTopics: idea.relatedTopics ? JSON.parse(idea.relatedTopics) : [],
      } : undefined,
    }));

    res.json(ideasWithParsedFields);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const expandIdea = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { expandedContent, suggestions, relatedTopics } = req.body;

    const idea = await prisma.idea.updateMany({
      where: { 
        id,
        userId: req.userId!
      },
      data: {
        expandedContent,
        suggestions: suggestions ? JSON.stringify(suggestions) : null,
        relatedTopics: relatedTopics ? JSON.stringify(relatedTopics) : null,
      },
    });

    if (idea.count === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Buscar ideia atualizada
    const updatedIdea = await prisma.idea.findUnique({
      where: { id },
    });

    if (!updatedIdea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Parsear campos JSON
    const ideaWithParsedFields = {
      ...updatedIdea,
      tags: updatedIdea.tags ? JSON.parse(updatedIdea.tags) : [],
      suggestions: updatedIdea.suggestions ? JSON.parse(updatedIdea.suggestions) : undefined,
      relatedTopics: updatedIdea.relatedTopics ? JSON.parse(updatedIdea.relatedTopics) : undefined,
      expanded: updatedIdea.expandedContent ? {
        expandedContent: updatedIdea.expandedContent,
        suggestions: updatedIdea.suggestions ? JSON.parse(updatedIdea.suggestions) : [],
        relatedTopics: updatedIdea.relatedTopics ? JSON.parse(updatedIdea.relatedTopics) : [],
      } : undefined,
    };

    res.json(ideaWithParsedFields);
  } catch (error) {
    console.error('Expand idea error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
