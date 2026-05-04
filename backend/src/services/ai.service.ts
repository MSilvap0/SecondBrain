import OpenAI from 'openai';

// Modo MOCK desativado - usa Groq API (GRATUITA e RÁPIDA)
const USE_MOCK = false;

// Configuração da API
const apiKey = process.env.OPENAI_API_KEY || '';
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.groq.com/openai/v1';

console.log('🔑 Configuração da IA:', {
  provider: baseURL.includes('groq') ? 'Groq (GRÁTIS)' : 'OpenAI',
  apiKey: apiKey ? apiKey.substring(0, 20) + '...' : 'NÃO CONFIGURADA',
  mode: USE_MOCK ? 'MOCK' : 'REAL',
});

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
  baseURL,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'Second Brain',
  },
});

export interface ClassifyIdeaInput {
  content: string;
}

export interface ClassifyIdeaOutput {
  category: string;
  confidence: number;
}

export interface GenerateTagsInput {
  content: string;
}

export interface GenerateTagsOutput {
  tags: string[];
}

export interface GenerateSummaryInput {
  content: string;
}

export interface GenerateSummaryOutput {
  summary: string;
}

export interface ExpandIdeaInput {
  content: string;
}

export interface ExpandIdeaOutput {
  expandedContent: string;
  suggestions: string[];
  relatedTopics: string[];
}

class AIService {
  /**
   * Classifica uma ideia em categorias pré-definidas
   */
  async classifyIdea(input: ClassifyIdeaInput): Promise<ClassifyIdeaOutput> {
    // MOCK MODE
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const content = input.content.toLowerCase();
      
      if (content.includes('trabalho') || content.includes('projeto') || content.includes('empresa')) {
        return { category: 'Trabalho', confidence: 0.85 };
      } else if (content.includes('estudo') || content.includes('aprender') || content.includes('curso')) {
        return { category: 'Pessoal', confidence: 0.82 };
      } else if (content.includes('app') || content.includes('desenvolv') || content.includes('criar')) {
        return { category: 'Projetos', confidence: 0.88 };
      } else {
        return { category: 'Geral', confidence: 0.70 };
      }
    }

    const prompt = `
Classifique a seguinte ideia em uma das categorias abaixo:
- Pessoal (vida pessoal, objetivos, reflexões)
- Trabalho (projetos profissionais, tarefas, metas)
- Criativo (ideias artísticas, inspirações, brainstorming)
- Aprendizado (notas de estudo, conceitos, pesquisas)
- Financeiro (orçamento, investimentos, planejamento)

Ideia: "${input.content}"

Responda apenas no formato JSON:
{
  "category": "nome da categoria",
  "confidence": 0.0-1.0
}
`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em classificar ideias em categorias.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      console.error('Error classifying idea:', error);
      
      // Fallback: tentar extrair JSON da resposta
      try {
        const content = (error as any).response?.choices?.[0]?.message?.content;
        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        }
      } catch (e) {
        // Ignore
      }
      
      return {
        category: 'Geral',
        confidence: 0.5,
      };
    }
  }

  /**
   * Gera tags relevantes para uma ideia
   */
  async generateTags(input: GenerateTagsInput): Promise<GenerateTagsOutput> {
    // MOCK MODE
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const content = input.content.toLowerCase();
      const tags: string[] = [];

      const keywords = [
        { word: 'app', tag: 'aplicativo' },
        { word: 'web', tag: 'web' },
        { word: 'mobile', tag: 'mobile' },
        { word: 'ia', tag: 'inteligência-artificial' },
        { word: 'produtividade', tag: 'produtividade' },
        { word: 'design', tag: 'design' },
        { word: 'react', tag: 'react' },
        { word: 'node', tag: 'nodejs' },
        { word: 'estudo', tag: 'educação' },
        { word: 'portfolio', tag: 'portfolio' },
        { word: 'tarefa', tag: 'tarefas' },
        { word: 'gerenciar', tag: 'gestão' },
      ];

      keywords.forEach(({ word, tag }) => {
        if (content.includes(word) && !tags.includes(tag)) {
          tags.push(tag);
        }
      });

      if (tags.length === 0) {
        tags.push('ideia', 'novo', 'importante');
      }

      return { tags: tags.slice(0, 5) };
    }

    const prompt = `
Gere 3-5 tags relevantes para a seguinte ideia.
As tags devem ser curtas (1-3 palavras) e descritivas.

Ideia: "${input.content}"

Responda apenas no formato JSON:
{
  "tags": ["tag1", "tag2", "tag3"]
}
`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em gerar tags descritivas para ideias.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      console.error('Error generating tags:', error);
      
      // Fallback: tentar extrair JSON da resposta
      try {
        const content = (error as any).response?.choices?.[0]?.message?.content;
        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        }
      } catch (e) {
        // Ignore
      }
      
      return {
        tags: [],
      };
    }
  }

  /**
   * Gera um resumo conciso de uma ideia
   */
  async generateSummary(input: GenerateSummaryInput): Promise<GenerateSummaryOutput> {
    // MOCK MODE
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const sentences = input.content.split(/[.!?]+/).filter(s => s.trim());
      const summary = sentences.slice(0, 2).join('. ').trim();
      return {
        summary: summary || input.content.substring(0, 100) + '...',
      };
    }

    const prompt = `
Gere um resumo conciso (máximo 2 frases) da seguinte ideia.

Ideia: "${input.content}"

Responda apenas com o resumo.
`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em criar resumos concisos.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
      });

      const summary = completion.choices[0].message.content || '';
      return {
        summary,
      };
    } catch (error) {
      console.error('Error generating summary:', error);
      return {
        summary: input.content.substring(0, 100),
      };
    }
  }

  /**
   * Expande uma ideia com detalhes, sugestões e tópicos relacionados
   */
  async expandIdea(input: ExpandIdeaInput): Promise<ExpandIdeaOutput> {
    // MOCK MODE
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const expandedContent = `
${input.content}

Esta é uma ideia promissora que pode ser desenvolvida de várias formas. Para implementá-la com sucesso, é importante considerar os seguintes aspectos:

**Planejamento Inicial:**
Comece definindo claramente os objetivos e o escopo do projeto. Identifique o público-alvo e as principais funcionalidades que agregarão valor. Faça uma pesquisa de mercado para entender melhor as necessidades e expectativas dos usuários.

**Desenvolvimento e Execução:**
Divida o projeto em etapas menores e gerenciáveis. Utilize metodologias ágeis para manter flexibilidade e adaptabilidade durante o desenvolvimento. Priorize as funcionalidades essenciais (MVP) para validar a ideia rapidamente antes de investir em recursos mais complexos.

**Avaliação e Melhoria Contínua:**
Estabeleça métricas de sucesso e colete feedback constantemente. Use dados e insights dos usuários para iterar e melhorar o produto. Mantenha-se atualizado com as tendências do mercado e tecnologias emergentes que possam agregar valor ao projeto.
      `.trim();

      const suggestions = [
        'Crie um protótipo ou MVP (Produto Mínimo Viável) para validar a ideia rapidamente',
        'Defina métricas claras de sucesso e KPIs para acompanhar o progresso',
        'Busque feedback de potenciais usuários desde o início do desenvolvimento',
        'Estabeleça um cronograma realista com marcos e entregas incrementais',
        'Considere parcerias estratégicas que possam acelerar o desenvolvimento',
      ];

      const relatedTopics = [
        'Metodologias Ágeis (Scrum, Kanban)',
        'Design Thinking e UX/UI',
        'Validação de Mercado e MVP',
        'Gestão de Projetos e Planejamento',
        'Análise de Dados e Métricas',
      ];

      return {
        expandedContent,
        suggestions,
        relatedTopics,
      };
    }

    const prompt = `
Expanda a seguinte ideia de forma criativa e detalhada:

Ideia Original: "${input.content}"

Forneça:
1. Uma versão expandida e detalhada da ideia (2-3 parágrafos)
2. 3-5 sugestões práticas de como implementar ou desenvolver essa ideia
3. 3-5 tópicos relacionados que podem complementar essa ideia

Responda no formato JSON:
{
  "expandedContent": "texto expandido aqui",
  "suggestions": ["sugestão 1", "sugestão 2", "sugestão 3"],
  "relatedTopics": ["tópico 1", "tópico 2", "tópico 3"]
}
`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente criativo especializado em expandir e desenvolver ideias de forma prática e inspiradora.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      return result;
    } catch (error) {
      console.error('Error expanding idea:', error);
      
      // Fallback: tentar extrair JSON da resposta
      try {
        const content = (error as any).response?.choices?.[0]?.message?.content;
        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        }
      } catch (e) {
        // Ignore
      }
      
      return {
        expandedContent: input.content,
        suggestions: ['Defina objetivos claros', 'Crie um plano de ação', 'Comece com pequenos passos'],
        relatedTopics: ['Planejamento', 'Execução', 'Avaliação'],
      };
    }
  }

  /**
   * Processa uma ideia completa (classificação, tags e resumo)
   */
  async processIdea(content: string) {
    const [classification, tags, summary] = await Promise.all([
      this.classifyIdea({ content }),
      this.generateTags({ content }),
      this.generateSummary({ content }),
    ]);

    return {
      category: classification.category,
      confidence: classification.confidence,
      tags: tags.tags,
      summary: summary.summary,
    };
  }
}

export default new AIService();
