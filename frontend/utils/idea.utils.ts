import { API_BASE_URL } from '../../shared/constants/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Extrai sugestões de um texto baseado em marcadores e listas
 */
export function extractSuggestions(text: string): string[] {
  const suggestions: string[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.match(/^[•✓→-]\s+/) || line.match(/^\d+\.\s+/)) {
      const cleaned = line.replace(/^[•✓→-]\s+/, '').replace(/^\d+\.\s+/, '').trim();
      if (cleaned.length > 10 && cleaned.length < 200) {
        suggestions.push(cleaned);
      }
    }
  }
  
  return suggestions.slice(0, 5);
}

/**
 * Extrai tópicos relevantes de um texto
 */
export function extractTopics(text: string): string[] {
  const topics: string[] = [];
  const keywords = [
    'MVP', 'Validação', 'Prototipagem', 'Monetização', 'Marketing',
    'Escalabilidade', 'UX', 'Design', 'Desenvolvimento', 'Testes',
    'Feedback', 'Iteração', 'Lançamento', 'Crescimento', 'Estratégia'
  ];
  
  for (const keyword of keywords) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      topics.push(keyword);
    }
  }
  
  return topics.slice(0, 6);
}

/**
 * Salva a expansão de uma ideia com mensagens do chat
 */
export async function saveIdeaExpansion(
  ideaId: string,
  messages: Message[],
  token: string
): Promise<boolean> {
  try {
    const expansion = messages
      .filter(m => m.role === 'assistant')
      .map(m => m.content)
      .join('\n\n---\n\n');

    const response = await fetch(`${API_BASE_URL}/api/ideas/${ideaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        expanded: {
          expandedContent: expansion,
          suggestions: extractSuggestions(expansion),
          relatedTopics: extractTopics(expansion)
        },
        chatMessages: messages
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao salvar expansão:', error);
    return false;
  }
}
