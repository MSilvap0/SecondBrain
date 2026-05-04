/**
 * Mock AI Service - Para desenvolvimento sem gastar créditos OpenAI
 * 
 * Para usar: renomeie este arquivo para ai.service.ts
 * ou importe no lugar do ai.service.ts original
 */

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

class MockAIService {
  /**
   * Classifica uma ideia em categorias pré-definidas (MOCK)
   */
  async classifyIdea(input: ClassifyIdeaInput): Promise<ClassifyIdeaOutput> {
    // Simula delay da API
    await new Promise(resolve => setTimeout(resolve, 800));

    const content = input.content.toLowerCase();
    
    // Lógica simples de classificação baseada em palavras-chave
    if (content.includes('trabalho') || content.includes('projeto') || content.includes('empresa')) {
      return { category: 'Trabalho', confidence: 0.85 };
    } else if (content.includes('estudo') || content.includes('aprender') || content.includes('curso')) {
      return { category: 'Aprendizado', confidence: 0.82 };
    } else if (content.includes('arte') || content.includes('design') || content.includes('criativo')) {
      return { category: 'Criativo', confidence: 0.78 };
    } else if (content.includes('dinheiro') || content.includes('investimento') || content.includes('financeiro')) {
      return { category: 'Financeiro', confidence: 0.80 };
    } else {
      return { category: 'Pessoal', confidence: 0.70 };
    }
  }

  /**
   * Gera tags relevantes para uma ideia (MOCK)
   */
  async generateTags(input: GenerateTagsInput): Promise<GenerateTagsOutput> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const content = input.content.toLowerCase();
    const tags: string[] = [];

    // Extrai palavras-chave comuns
    const keywords = [
      { word: 'app', tag: 'aplicativo' },
      { word: 'web', tag: 'web' },
      { word: 'mobile', tag: 'mobile' },
      { word: 'ia', tag: 'inteligência-artificial' },
      { word: 'ai', tag: 'inteligência-artificial' },
      { word: 'design', tag: 'design' },
      { word: 'frontend', tag: 'frontend' },
      { word: 'backend', tag: 'backend' },
      { word: 'react', tag: 'react' },
      { word: 'node', tag: 'nodejs' },
      { word: 'python', tag: 'python' },
      { word: 'produtividade', tag: 'produtividade' },
      { word: 'estudo', tag: 'educação' },
      { word: 'portfolio', tag: 'portfolio' },
    ];

    keywords.forEach(({ word, tag }) => {
      if (content.includes(word) && !tags.includes(tag)) {
        tags.push(tag);
      }
    });

    // Se não encontrou nenhuma tag, adiciona tags genéricas
    if (tags.length === 0) {
      tags.push('ideia', 'novo', 'importante');
    }

    return { tags: tags.slice(0, 5) };
  }

  /**
   * Gera um resumo conciso de uma ideia (MOCK)
   */
  async generateSummary(input: GenerateSummaryInput): Promise<GenerateSummaryOutput> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Pega as primeiras 2 frases ou 100 caracteres
    const sentences = input.content.split(/[.!?]+/).filter(s => s.trim());
    const summary = sentences.slice(0, 2).join('. ').trim();
    
    return {
      summary: summary || input.content.substring(0, 100) + '...',
    };
  }

  /**
   * Expande uma ideia com detalhes, sugestões e tópicos relacionados (MOCK)
   */
  async expandIdea(input: ExpandIdeaInput): Promise<ExpandIdeaOutput> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const content = input.content;

    // Gera conteúdo expandido baseado no input
    const expandedContent = `
${content}

Esta é uma ideia promissora que pode ser desenvolvida de várias formas. Para implementá-la com sucesso, é importante considerar os seguintes aspectos:

**Planejamento Inicial:**
Comece definindo claramente os objetivos e o escopo do projeto. Identifique o público-alvo e as principais funcionalidades que agregarão valor. Faça uma pesquisa de mercado para entender melhor as necessidades e expectativas dos usuários.

**Desenvolvimento e Execução:**
Divida o projeto em etapas menores e gerenciáveis. Utilize metodologias ágeis para manter flexibilidade e adaptabilidade durante o desenvolvimento. Priorize as funcionalidades essenciais (MVP) para validar a ideia rapidamente antes de investir em recursos mais complexos.

**Avaliação e Melhoria Contínua:**
Estabeleça métricas de sucesso e colete feedback constantemente. Use dados e insights dos usuários para iterar e melhorar o produto. Mantenha-se atualizado com as tendências do mercado e tecnologias emergentes que possam agregar valor ao projeto.
    `.trim();

    // Gera sugestões práticas
    const suggestions = [
      'Crie um protótipo ou MVP (Produto Mínimo Viável) para validar a ideia rapidamente',
      'Defina métricas claras de sucesso e KPIs para acompanhar o progresso',
      'Busque feedback de potenciais usuários desde o início do desenvolvimento',
      'Estabeleça um cronograma realista com marcos e entregas incrementais',
      'Considere parcerias estratégicas que possam acelerar o desenvolvimento',
    ];

    // Gera tópicos relacionados
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

  /**
   * Processa uma ideia completa (classificação, tags e resumo) (MOCK)
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

export default new MockAIService();
