export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

export const BLOCK_TYPES = {
  TEXT: 'text',
  HEADING_1: 'heading-1',
  HEADING_2: 'heading-2',
  HEADING_3: 'heading-3',
  BULLET: 'bullet',
  NUMBERED: 'numbered',
  TODO: 'todo',
  QUOTE: 'quote',
  CODE: 'code',
  DIVIDER: 'divider',
} as const;

export const AI_FEATURES = {
  SUMMARIZE: 'summarize',
  EXTRACT_TAGS: 'extract-tags',
  SUGGEST_LINKS: 'suggest-links',
  GENERATE_OUTLINE: 'generate-outline',
} as const;
