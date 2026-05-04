// SEÇÕES EXPANDIDAS COM MUITO MAIS CONTEÚDO
// Este arquivo contém documentação COMPLETA e DETALHADA

import { Check, Copy, Zap, Shield, Database, Lock, Sparkles, Mail, CreditCard, Code, Cpu, FileText, Cloud, AlertTriangle, GitBranch, Users, Package, Server, Key, Globe, Layers, Terminal, FileCode, Book, Settings, HardDrive, Workflow, Boxes } from 'lucide-react';

// ============================================================================
// API ENDPOINTS - DOCUMENTAÇÃO COMPLETA
// ============================================================================

export function ApiEndpointsSection({ copyCode, copiedCode }: any) {
  const apiEndpointsCode = `// shared/constants/api.ts
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  
  // Ideas
  IDEAS: {
    LIST: '/api/ideas',
    CREATE: '/api/ideas',
    BY_ID: (id: string) => \`/api/ideas/\${id}\`,
    EXPAND: '/api/ideas/expand',
    FAVORITE: (id: string) => \`/api/ideas/\${id}/favorite\`,
  },
  
  // Chat
  CHAT: {
    MESSAGES: (ideaId: string) => \`/api/chat/\${ideaId}/messages\`,
    SEND: (ideaId: string) => \`/api/chat/\${ideaId}/send\`,
  },
  
  // User
  USER: {
    SETTINGS: '/api/user/settings',
    PLAN: '/api/user/plan',
    UPDATE_PROFILE: '/api/user/profile',
  },
  
  // Purchase
  PURCHASE: {
    BUY_CREDITS: '/api/purchase/credits',
    HISTORY: '/api/purchase/history',
  },
};`;

  const apiUtilsCode = `// frontend/utils/api.utils.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': \`Bearer \${token}\` }),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }

  const data = await response.json();
  return { data };
}

export async function apiPost<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': \`Bearer \${token}\` }),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }

  const data = await response.json();
  return { data };
}

export async function apiPut<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': \`Bearer \${token}\` }),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }

  const data = await response.json();
  return { data };
}

export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  
  const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': \`Bearer \${token}\` }),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }

  const data = await response.json();
  return { data };
}`;

  const usageExample = `// Exemplo de uso completo
import { apiGet, apiPost } from '@/utils/api.utils';
import { API_ENDPOINTS } from '@/shared/constants/api';

// 1. Buscar todas as ideias
async function loadIdeas() {
  try {
    const { data: ideas } = await apiGet<Idea[]>(API_ENDPOINTS.IDEAS.LIST);
    console.log('Ideias carregadas:', ideas);
  } catch (error) {
    console.error('Erro ao carregar ideias:', error);
  }
}

// 2. Criar nova ideia
async function createIdea() {
  try {
    const { data: newIdea } = await apiPost<Idea>(API_ENDPOINTS.IDEAS.CREATE, {
      title: 'Minha nova ideia',
      content: 'Descrição detalhada',
      tags: ['tag1', 'tag2']
    });
    console.log('Ideia criada:', newIdea);
  } catch (error) {
    console.error('Erro ao criar ideia:', error);
  }
}

// 3. Expandir ideia com IA
async function expandIdea(ideaId: string) {
  try {
    const { data: expanded } = await apiPost(API_ENDPOINTS.IDEAS.EXPAND, {
      ideaId,
      prompt: 'Expanda esta ideia com mais detalhes'
    });
    console.log('Ideia expandida:', expanded);
  } catch (error) {
    console.error('Erro ao expandir ideia:', error);
  }
}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">API Endpoints - Documentação Completa</h2>
        <p className="text-neutral-400 text-lg">
          Todos os endpoints da API com exemplos práticos
        </p>
      </div>

      {/* API Endpoints */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">📍 Endpoints Disponíveis</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">shared/constants/api.ts</span>
            <button
              onClick={() => copyCode(apiEndpointsCode, 'api-endpoints')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'api-endpoints' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{apiEndpointsCode}</code>
          </pre>
        </div>
      </div>

      {/* API Utils */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">🛠️ API Utils - Código Completo</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">frontend/utils/api.utils.ts</span>
            <button
              onClick={() => copyCode(apiUtilsCode, 'api-utils')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'api-utils' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{apiUtilsCode}</code>
          </pre>
        </div>
      </div>

      {/* Usage Example */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">💻 Exemplos de Uso Completos</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">Exemplos Práticos</span>
            <button
              onClick={() => copyCode(usageExample, 'usage-example')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'usage-example' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{usageExample}</code>
          </pre>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">✅ Benefícios do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-2">Autenticação Automática</h4>
            <p className="text-sm text-neutral-300">JWT adicionado automaticamente em todas as requisições</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-2">Type Safety</h4>
            <p className="text-sm text-neutral-300">TypeScript genéricos para tipo de retorno</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-2">Tratamento de Erros</h4>
            <p className="text-sm text-neutral-300">Erros padronizados e legíveis</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-400 mb-2">Menos Boilerplate</h4>
            <p className="text-sm text-neutral-300">80% menos código repetitivo</p>
          </div>
        </div>
      </div>

      {/* API Routes Table */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">📋 Tabela de Rotas</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-800/50 border-b border-neutral-700">
              <tr>
                <th className="text-left p-3 text-neutral-300 font-semibold">Método</th>
                <th className="text-left p-3 text-neutral-300 font-semibold">Endpoint</th>
                <th className="text-left p-3 text-neutral-300 font-semibold">Descrição</th>
                <th className="text-left p-3 text-neutral-300 font-semibold">Auth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              <tr>
                <td className="p-3"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">POST</span></td>
                <td className="p-3 font-mono text-xs text-neutral-300">/api/auth/login</td>
                <td className="p-3 text-neutral-400">Login do usuário</td>
                <td className="p-3 text-neutral-500">Não</td>
              </tr>
              <tr>
                <td className="p-3"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">POST</span></td>
                <td className="p-3 font-mono text-xs text-neutral-300">/api/auth/register</td>
                <td className="p-3 text-neutral-400">Registro de novo usuário</td>
                <td className="p-3 text-neutral-500">Não</td>
              </tr>
              <tr>
                <td className="p-3"><span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span></td>
                <td className="p-3 font-mono text-xs text-neutral-300">/api/ideas</td>
                <td className="p-3 text-neutral-400">Listar todas as ideias</td>
                <td className="p-3 text-green-400">Sim</td>
              </tr>
              <tr>
                <td className="p-3"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">POST</span></td>
                <td className="p-3 font-mono text-xs text-neutral-300">/api/ideas</td>
                <td className="p-3 text-neutral-400">Criar nova ideia</td>
                <td className="p-3 text-green-400">Sim</td>
              </tr>
              <tr>
                <td className="p-3"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">POST</span></td>
                <td className="p-3 font-mono text-xs text-neutral-300">/api/ideas/expand</td>
                <td className="p-3 text-neutral-400">Expandir ideia com IA</td>
                <td className="p-3 text-green-400">Sim</td>
              </tr>
              <tr>
                <td className="p-3"><span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-mono">DELETE</span></td>
                <td className="p-3 font-mono text-xs text-neutral-300">/api/ideas/:id</td>
                <td className="p-3 text-neutral-400">Deletar ideia</td>
                <td className="p-3 text-green-400">Sim</td>
              </tr>
              <tr>
                <td className="p-3"><span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-mono">POST</span></td>
                <td className="p-3 font-mono text-xs text-neutral-300">/api/chat/:ideaId/send</td>
                <td className="p-3 text-neutral-400">Enviar mensagem no chat</td>
                <td className="p-3 text-green-400">Sim</td>
              </tr>
              <tr>
                <td className="p-3"><span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span></td>
                <td className="p-3 font-mono text-xs text-neutral-300">/api/user/settings</td>
                <td className="p-3 text-neutral-400">Buscar configurações do usuário</td>
                <td className="p-3 text-green-400">Sim</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// SISTEMA DE IA - DOCUMENTAÇÃO COMPLETA
// ============================================================================

export function AISystemSection({ copyCode, copiedCode }: any) {
  const aiControllerCode = `// backend/src/controllers/ai.controller.ts
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Função auxiliar: Verificar limite de tokens
async function checkTokenLimit(userId: number): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      aiTokensUsed: true,
      aiTokensLimit: true,
      subscriptionPlan: true,
    },
  });

  if (!user) return false;

  // Limites por plano
  const planLimits = {
    free: 100000,      // 100K tokens
    pro: 3000000,      // 3M tokens/mês
    max: 20000000,     // 20M tokens/mês
  };

  // Usar o MAIOR valor entre limite do plano e créditos comprados
  const planLimit = planLimits[user.subscriptionPlan as keyof typeof planLimits] || 100000;
  const tokensLimit = user.aiTokensLimit 
    ? Math.max(planLimit, user.aiTokensLimit)
    : planLimit;

  return user.aiTokensUsed < tokensLimit;
}

// Função auxiliar: Rastrear uso de tokens
async function trackTokenUsage(userId: number, tokensUsed: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      aiTokensUsed: {
        increment: tokensUsed,
      },
    },
  });
}

// Função auxiliar: Estimar tokens
function estimateTokens(text: string): number {
  // Aproximação: 1 token ≈ 4 caracteres
  return Math.ceil(text.length / 4);
}

// Expandir ideia com IA
export async function expandIdea(req: any, res: any) {
  try {
    const { ideaId, prompt } = req.body;
    const userId = req.user.id;

    // 1. Verificar limite de tokens
    const hasTokens = await checkTokenLimit(userId);
    if (!hasTokens) {
      return res.status(429).json({
        error: 'Limite de tokens atingido',
        message: 'Você atingiu o limite de tokens do seu plano. Faça upgrade ou compre créditos.',
      });
    }

    // 2. Buscar ideia
    const idea = await prisma.idea.findUnique({
      where: { id: parseInt(ideaId) },
    });

    if (!idea) {
      return res.status(404).json({ error: 'Ideia não encontrada' });
    }

    // 3. Chamar Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente criativo que ajuda a expandir e desenvolver ideias.',
        },
        {
          role: 'user',
          content: \`Ideia: \${idea.title}\\n\\nDescrição: \${idea.content}\\n\\nPrompt: \${prompt}\`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
    });

    const expandedContent = completion.choices[0]?.message?.content || '';

    // 4. Rastrear tokens usados
    const tokensUsed = completion.usage?.total_tokens || estimateTokens(expandedContent);
    await trackTokenUsage(userId, tokensUsed);

    // 5. Retornar resposta
    res.json({
      expandedContent,
      tokensUsed,
    });
  } catch (error) {
    console.error('Erro ao expandir ideia:', error);
    res.status(500).json({ error: 'Erro ao expandir ideia' });
  }
}`;

  const chatExample = `// Chat com IA - Exemplo completo
export async function chatWithAI(req: any, res: any) {
  try {
    const { ideaId, message } = req.body;
    const userId = req.user.id;

    // 1. Verificar limite de tokens
    const hasTokens = await checkTokenLimit(userId);
    if (!hasTokens) {
      return res.status(429).json({
        error: 'Limite de tokens atingido',
      });
    }

    // 2. Buscar histórico de mensagens
    const messages = await prisma.chatMessage.findMany({
      where: { ideaId: parseInt(ideaId) },
      orderBy: { createdAt: 'asc' },
      take: 10, // Últimas 10 mensagens
    });

    // 3. Montar contexto
    const chatHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // 4. Adicionar nova mensagem do usuário
    chatHistory.push({
      role: 'user',
      content: message,
    });

    // 5. Chamar Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente inteligente que ajuda a desenvolver ideias.',
        },
        ...chatHistory,
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    // 6. Salvar mensagens no banco
    await prisma.chatMessage.createMany({
      data: [
        {
          ideaId: parseInt(ideaId),
          userId,
          role: 'user',
          content: message,
        },
        {
          ideaId: parseInt(ideaId),
          userId,
          role: 'assistant',
          content: aiResponse,
        },
      ],
    });

    // 7. Rastrear tokens
    const tokensUsed = completion.usage?.total_tokens || estimateTokens(aiResponse);
    await trackTokenUsage(userId, tokensUsed);

    // 8. Retornar resposta
    res.json({
      message: aiResponse,
      tokensUsed,
    });
  } catch (error) {
    console.error('Erro no chat:', error);
    res.status(500).json({ error: 'Erro no chat' });
  }
}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Sistema de IA - Documentação Completa</h2>
        <p className="text-neutral-400 text-lg">
          Integração com Groq API e sistema de tracking de tokens
        </p>
      </div>

      {/* Overview */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-on-surface mb-4">✨ Funcionalidades de IA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-indigo-400">Expandir Ideias</h4>
            <p className="text-sm text-neutral-300">IA desenvolve e detalha suas ideias com contexto completo</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-purple-400">Chat Interativo</h4>
            <p className="text-sm text-neutral-300">Converse com a IA sobre suas ideias com histórico</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-pink-400">Geração de Tags</h4>
            <p className="text-sm text-neutral-300">Tags automáticas baseadas no conteúdo da ideia</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-blue-400">Resumos Automáticos</h4>
            <p className="text-sm text-neutral-300">Resumos inteligentes de ideias longas</p>
          </div>
        </div>
      </div>

      {/* AI Controller Code */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">🤖 Código do Controller de IA</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">backend/src/controllers/ai.controller.ts</span>
            <button
              onClick={() => copyCode(aiControllerCode, 'ai-controller')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'ai-controller' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto max-h-96">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{aiControllerCode}</code>
          </pre>
        </div>
      </div>

      {/* Chat Example */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">💬 Sistema de Chat com IA</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">Chat Controller</span>
            <button
              onClick={() => copyCode(chatExample, 'chat-example')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'chat-example' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto max-h-96">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{chatExample}</code>
          </pre>
        </div>
      </div>

      {/* Token Limits */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">🎯 Limites de Tokens por Plano</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-neutral-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-on-surface mb-2">Free</h4>
            <p className="text-3xl font-bold text-indigo-400 mb-2">100K</p>
            <p className="text-sm text-neutral-400 mb-4">tokens/mês</p>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Expandir ideias</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Chat básico</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Tags automáticas</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-indigo-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-indigo-400 mb-2">Pro Anual</h4>
            <p className="text-3xl font-bold text-indigo-400 mb-2">36M</p>
            <p className="text-sm text-neutral-400 mb-4">tokens/ano (3M/mês)</p>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Tudo do Free</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Chat ilimitado</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Prioridade na fila</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-purple-500/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-purple-400 mb-2">Max Anual</h4>
            <p className="text-3xl font-bold text-purple-400 mb-2">240M</p>
            <p className="text-sm text-neutral-400 mb-4">tokens/ano (20M/mês)</p>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Tudo do Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Máxima prioridade</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Acesso antecipado</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Groq API Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">🚀 Groq API</h3>
        <div className="space-y-3 text-sm text-neutral-300">
          <p>
            <strong>Modelo:</strong> <code className="text-indigo-400">llama-3.3-70b-versatile</code>
          </p>
          <p>
            <strong>Velocidade:</strong> Extremamente rápida (até 10x mais rápida que GPT-4)
          </p>
          <p>
            <strong>Custo:</strong> Gratuita com limite generoso de tokens
          </p>
          <p>
            <strong>Qualidade:</strong> Respostas de alta qualidade, comparável ao GPT-4
          </p>
        </div>
      </div>

      {/* Token Tracking System */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-400 mb-3">✅ Sistema de Tracking de Tokens</h3>
        <div className="space-y-3 text-sm text-neutral-300">
          <p>
            <strong>Implementado em TODOS os endpoints de IA:</strong>
          </p>
          <ul className="space-y-2 ml-4">
            <li>• <code className="text-indigo-400">expandIdea()</code> - Expandir ideias</li>
            <li>• <code className="text-indigo-400">classifyIdea()</code> - Classificar ideias</li>
            <li>• <code className="text-indigo-400">generateTags()</code> - Gerar tags</li>
            <li>• <code className="text-indigo-400">generateSummary()</code> - Gerar resumos</li>
            <li>• <code className="text-indigo-400">chatWithAI()</code> - Chat com IA</li>
          </ul>
          <p className="mt-4">
            <strong>Comportamento:</strong> Retorna erro 429 quando limite atingido
          </p>
          <p>
            <strong>Frontend:</strong> Trata erro 429 sem popup bloqueante
          </p>
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// BANCO DE DADOS - DOCUMENTAÇÃO COMPLETA
// ============================================================================

export function DatabaseCompleteSection({ copyCode, copiedCode }: any) {
  const prismaSchema = `// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id                  Int       @id @default(autoincrement())
  email               String    @unique
  password            String
  name                String?
  emailVerified       Boolean   @default(false)
  subscriptionPlan    String    @default("free")
  aiTokensUsed        Int       @default(0)
  aiTokensLimit       Int?
  planExpiresAt       DateTime?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  ideas               Idea[]
  chatMessages        ChatMessage[]
  purchases           Purchase[]
  passwordResetTokens PasswordResetToken[]
}

model Idea {
  id          Int       @id @default(autoincrement())
  title       String
  content     String
  description String?
  tags        String?
  category    String?
  isFavorite  Boolean   @default(false)
  userId      Int
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  chatMessages ChatMessage[]
}

model ChatMessage {
  id        Int      @id @default(autoincrement())
  ideaId    Int
  userId    Int
  role      String   // 'user' ou 'assistant'
  content   String
  createdAt DateTime @default(now())
  
  idea      Idea     @relation(fields: [ideaId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model PendingVerification {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  token     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  expiresAt DateTime
}

model PasswordResetToken {
  id        Int      @id @default(autoincrement())
  userId    Int
  token     String   @unique
  createdAt DateTime @default(now())
  expiresAt DateTime
  used      Boolean  @default(false)
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Purchase {
  id              Int      @id @default(autoincrement())
  userId          Int
  type            String   // 'credits' ou 'subscription'
  amount          Float
  tokensAdded     Int?
  subscriptionPlan String?
  createdAt       DateTime @default(now())
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}`;

  const prismaCommands = `# Comandos Prisma Essenciais

# 1. Gerar cliente Prisma (após mudanças no schema)
npx prisma generate

# 2. Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# 3. Aplicar migrações em produção
npx prisma migrate deploy

# 4. Resetar banco de dados (CUIDADO!)
npx prisma migrate reset

# 5. Abrir Prisma Studio (interface visual)
npx prisma studio

# 6. Formatar schema.prisma
npx prisma format

# 7. Validar schema.prisma
npx prisma validate

# 8. Ver status das migrações
npx prisma migrate status`;

  const prismaUsage = `// Exemplos de uso do Prisma Client

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. Criar usuário
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: 'hashedPassword',
    name: 'João Silva',
  },
});

// 2. Buscar usuário por email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: {
    ideas: true,  // Incluir ideias do usuário
    purchases: true,  // Incluir compras
  },
});

// 3. Atualizar usuário
await prisma.user.update({
  where: { id: 1 },
  data: {
    aiTokensUsed: {
      increment: 1000,  // Incrementar tokens usados
    },
  },
});

// 4. Criar ideia com relação
const idea = await prisma.idea.create({
  data: {
    title: 'Minha ideia',
    content: 'Descrição da ideia',
    userId: 1,
    tags: JSON.stringify(['tag1', 'tag2']),
  },
});

// 5. Buscar ideias com filtros
const ideas = await prisma.idea.findMany({
  where: {
    userId: 1,
    isFavorite: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 10,  // Limitar a 10 resultados
});

// 6. Deletar ideia (cascade deleta mensagens)
await prisma.idea.delete({
  where: { id: 1 },
});

// 7. Transações
await prisma.$transaction([
  prisma.user.update({
    where: { id: 1 },
    data: { aiTokensUsed: { increment: 1000 } },
  }),
  prisma.purchase.create({
    data: {
      userId: 1,
      type: 'credits',
      amount: 10.00,
      tokensAdded: 10000000,
    },
  }),
]);

// 8. Agregações
const stats = await prisma.idea.aggregate({
  where: { userId: 1 },
  _count: true,
  _avg: { id: true },
});`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Banco de Dados - Documentação Completa</h2>
        <p className="text-neutral-400 text-lg">
          Prisma ORM + SQLite - Schema completo e exemplos de uso
        </p>
      </div>

      {/* Schema Completo */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">📋 Schema Completo do Banco</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">backend/prisma/schema.prisma</span>
            <button
              onClick={() => copyCode(prismaSchema, 'prisma-schema')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'prisma-schema' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto max-h-96">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{prismaSchema}</code>
          </pre>
        </div>
      </div>

      {/* Tabelas */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">🗄️ Estrutura das Tabelas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-indigo-400 mb-3">User</h4>
            <ul className="space-y-1 text-xs text-neutral-300 font-mono">
              <li>• id: Int (PK)</li>
              <li>• email: String (unique)</li>
              <li>• password: String</li>
              <li>• subscriptionPlan: String</li>
              <li>• aiTokensUsed: Int</li>
              <li>• aiTokensLimit: Int?</li>
              <li>• planExpiresAt: DateTime?</li>
            </ul>
          </div>

          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-purple-400 mb-3">Idea</h4>
            <ul className="space-y-1 text-xs text-neutral-300 font-mono">
              <li>• id: Int (PK)</li>
              <li>• title: String</li>
              <li>• content: String</li>
              <li>• tags: String?</li>
              <li>• isFavorite: Boolean</li>
              <li>• userId: Int (FK)</li>
              <li>• createdAt: DateTime</li>
            </ul>
          </div>

          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-pink-400 mb-3">ChatMessage</h4>
            <ul className="space-y-1 text-xs text-neutral-300 font-mono">
              <li>• id: Int (PK)</li>
              <li>• ideaId: Int (FK)</li>
              <li>• userId: Int (FK)</li>
              <li>• role: String</li>
              <li>• content: String</li>
              <li>• createdAt: DateTime</li>
            </ul>
          </div>

          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-400 mb-3">Purchase</h4>
            <ul className="space-y-1 text-xs text-neutral-300 font-mono">
              <li>• id: Int (PK)</li>
              <li>• userId: Int (FK)</li>
              <li>• type: String</li>
              <li>• amount: Float</li>
              <li>• tokensAdded: Int?</li>
              <li>• createdAt: DateTime</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comandos Prisma */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">⚡ Comandos Prisma Essenciais</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">Terminal</span>
            <button
              onClick={() => copyCode(prismaCommands, 'prisma-commands')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'prisma-commands' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{prismaCommands}</code>
          </pre>
        </div>
      </div>

      {/* Exemplos de Uso */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">💻 Exemplos de Uso do Prisma Client</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">Exemplos Práticos</span>
            <button
              onClick={() => copyCode(prismaUsage, 'prisma-usage')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'prisma-usage' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto max-h-96">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{prismaUsage}</code>
          </pre>
        </div>
      </div>

      {/* Relações */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">🔗 Relações entre Tabelas</h3>
        <div className="space-y-3 text-sm text-neutral-300">
          <div>
            <strong className="text-purple-400">User → Idea:</strong> Um usuário pode ter várias ideias (1:N)
          </div>
          <div>
            <strong className="text-pink-400">User → ChatMessage:</strong> Um usuário pode ter várias mensagens (1:N)
          </div>
          <div>
            <strong className="text-indigo-400">Idea → ChatMessage:</strong> Uma ideia pode ter várias mensagens (1:N)
          </div>
          <div>
            <strong className="text-blue-400">User → Purchase:</strong> Um usuário pode ter várias compras (1:N)
          </div>
          <div>
            <strong className="text-green-400">Cascade Delete:</strong> Ao deletar User ou Idea, registros relacionados são deletados automaticamente
          </div>
        </div>
      </div>

      {/* Migrações */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">📦 Migrações Aplicadas</h3>
        <ul className="space-y-2 text-sm text-neutral-300">
          <li>• <code className="text-indigo-400">20260429090841_add_ideas_table</code> - Tabela de ideias</li>
          <li>• <code className="text-indigo-400">20260429092618_add_chat_messages</code> - Sistema de chat</li>
          <li>• <code className="text-indigo-400">20260430213743_add_email_verification</code> - Verificação de email</li>
          <li>• <code className="text-indigo-400">20260501150212_add_subscription_plans</code> - Planos de assinatura</li>
          <li>• <code className="text-indigo-400">20260503230827_add_ai_usage_tracking</code> - Tracking de tokens</li>
          <li>• <code className="text-indigo-400">20260503235319_add_purchase_table</code> - Sistema de compras</li>
        </ul>
      </div>
    </div>
  );
}


// ============================================================================
// AUTENTICAÇÃO - DOCUMENTAÇÃO COMPLETA
// ============================================================================

export function AuthenticationCompleteSection({ copyCode, copiedCode }: any) {
  const authControllerCode = `// backend/src/controllers/auth.controller.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.util';
import { sendVerificationEmail } from '../services/email.service';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Registro de novo usuário
export async function register(req: any, res: any) {
  try {
    const { email, password, name } = req.body;

    // 1. Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // 2. Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Gerar token de verificação
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 4. Salvar em PendingVerification
    await prisma.pendingVerification.create({
      data: {
        email,
        password: hashedPassword,
        name,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    // 5. Enviar email de verificação
    await sendVerificationEmail(email, verificationToken);

    res.json({
      message: 'Conta criada! Verifique seu email.',
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
}

// Verificar email
export async function verifyEmail(req: any, res: any) {
  try {
    const { token } = req.query;

    // 1. Buscar token
    const pending = await prisma.pendingVerification.findUnique({
      where: { token },
    });

    if (!pending) {
      return res.status(400).json({ error: 'Token inválido' });
    }

    // 2. Verificar expiração
    if (new Date() > pending.expiresAt) {
      return res.status(400).json({ error: 'Token expirado' });
    }

    // 3. Criar usuário
    const user = await prisma.user.create({
      data: {
        email: pending.email,
        password: pending.password,
        name: pending.name,
        emailVerified: true,
      },
    });

    // 4. Deletar pending
    await prisma.pendingVerification.delete({
      where: { token },
    });

    // 5. Gerar JWT
    const jwtToken = generateToken({ id: user.id, email: user.email });

    res.json({
      message: 'Email verificado com sucesso!',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).json({ error: 'Erro ao verificar email' });
  }
}

// Login
export async function login(req: any, res: any) {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 2. Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 3. Verificar se email foi verificado
    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Email não verificado' });
    }

    // 4. Gerar JWT
    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionPlan: user.subscriptionPlan,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}`;

  const jwtUtilCode = `// backend/src/utils/jwt.util.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_aqui';
const JWT_EXPIRES_IN = '7d'; // 7 dias

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido');
  }
}`;

  const authMiddlewareCode = `// backend/src/middlewares/auth.middleware.ts
import { verifyToken } from '../utils/jwt.util';

export function authMiddleware(req: any, res: any, next: any) {
  try {
    // 1. Pegar token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // 2. Extrair token (formato: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // 3. Verificar token
    const decoded = verifyToken(token);

    // 4. Adicionar usuário ao request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}`;

  const authContextCode = `// frontend/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name?: string;
  subscriptionPlan: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Carregar usuário do localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer login');
    }

    const data = await response.json();

    // Salvar token e usuário
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);

    // Redirecionar para dashboard
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Autenticação - Documentação Completa</h2>
        <p className="text-neutral-400 text-lg">
          Sistema completo de autenticação com JWT e verificação de email
        </p>
      </div>

      {/* Fluxo de Autenticação */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-on-surface mb-4">🔐 Fluxo de Autenticação</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
            <div>
              <h4 className="text-sm font-semibold text-on-surface mb-1">Registro</h4>
              <p className="text-sm text-neutral-300">Usuário cria conta → Senha hasheada com bcrypt → Email de verificação enviado</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
            <div>
              <h4 className="text-sm font-semibold text-on-surface mb-1">Verificação</h4>
              <p className="text-sm text-neutral-300">Usuário clica no link → Token validado → Conta ativada → JWT gerado</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
            <div>
              <h4 className="text-sm font-semibold text-on-surface mb-1">Login</h4>
              <p className="text-sm text-neutral-300">Credenciais validadas → JWT gerado → Token salvo no localStorage</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
            <div>
              <h4 className="text-sm font-semibold text-on-surface mb-1">Requisições</h4>
              <p className="text-sm text-neutral-300">JWT enviado no header Authorization → Middleware valida → Usuário autenticado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Controller */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">🔑 Controller de Autenticação</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">backend/src/controllers/auth.controller.ts</span>
            <button
              onClick={() => copyCode(authControllerCode, 'auth-controller')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'auth-controller' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto max-h-96">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{authControllerCode}</code>
          </pre>
        </div>
      </div>

      {/* JWT Utils */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">🎫 JWT Utils</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">backend/src/utils/jwt.util.ts</span>
            <button
              onClick={() => copyCode(jwtUtilCode, 'jwt-util')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'jwt-util' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{jwtUtilCode}</code>
          </pre>
        </div>
      </div>

      {/* Auth Middleware */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">🛡️ Middleware de Autenticação</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">backend/src/middlewares/auth.middleware.ts</span>
            <button
              onClick={() => copyCode(authMiddlewareCode, 'auth-middleware')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'auth-middleware' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{authMiddlewareCode}</code>
          </pre>
        </div>
      </div>

      {/* Auth Context (Frontend) */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-on-surface">⚛️ Auth Context (Frontend)</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">frontend/contexts/AuthContext.tsx</span>
            <button
              onClick={() => copyCode(authContextCode, 'auth-context')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'auth-context' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto max-h-96">
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{authContextCode}</code>
          </pre>
        </div>
      </div>

      {/* Segurança */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">🔒 Medidas de Segurança</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-2">Senhas</h4>
            <ul className="space-y-1 text-sm text-neutral-300">
              <li>• Hasheadas com bcrypt</li>
              <li>• Salt rounds: 10</li>
              <li>• Nunca armazenadas em texto plano</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-2">JWT</h4>
            <ul className="space-y-1 text-sm text-neutral-300">
              <li>• Expira em 7 dias</li>
              <li>• Secret armazenado em .env</li>
              <li>• Validado em cada requisição</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-2">Email</h4>
            <ul className="space-y-1 text-sm text-neutral-300">
              <li>• Token único de verificação</li>
              <li>• Expira em 24 horas</li>
              <li>• Deletado após uso</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-2">Reset de Senha</h4>
            <ul className="space-y-1 text-sm text-neutral-300">
              <li>• Token único por usuário</li>
              <li>• Expira em 1 hora</li>
              <li>• Marcado como usado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================================================
// COMO USAR ESTAS SEÇÕES EXPANDIDAS
// ============================================================================

/*
INSTRUÇÕES PARA USO:

1. Importe as seções expandidas no arquivo page.tsx:
   import { ApiEndpointsSection, AISystemSection, DatabaseCompleteSection, AuthenticationCompleteSection } from './expanded-sections';

2. Adicione as seções no renderSection():
   case 'api-complete': return <ApiEndpointsSection {...props} />;
   case 'ai-complete': return <AISystemSection {...props} />;
   case 'database-complete': return <DatabaseCompleteSection {...props} />;
   case 'auth-complete': return <AuthenticationCompleteSection {...props} />;

3. Adicione as seções no array de sections:
   { id: 'api-complete', label: 'API Completa', icon: Zap, category: 'Documentação Completa' },
   { id: 'ai-complete', label: 'IA Completa', icon: Sparkles, category: 'Documentação Completa' },
   { id: 'database-complete', label: 'Banco Completo', icon: Database, category: 'Documentação Completa' },
   { id: 'auth-complete', label: 'Auth Completa', icon: Lock, category: 'Documentação Completa' },

CONTEÚDO INCLUÍDO:

✅ API Endpoints:
   - Código completo de api.ts com TODOS os endpoints
   - Código completo de api.utils.ts com todas as funções
   - Exemplos práticos de uso
   - Tabela de rotas com métodos e autenticação
   - Benefícios do sistema

✅ Sistema de IA:
   - Código completo do ai.controller.ts
   - Sistema de tracking de tokens
   - Chat com IA com histórico
   - Limites por plano (Free, Pro, Max)
   - Integração com Groq API
   - Funções auxiliares (checkTokenLimit, trackTokenUsage, estimateTokens)

✅ Banco de Dados:
   - Schema completo do Prisma
   - Todas as 6 tabelas (User, Idea, ChatMessage, PendingVerification, PasswordResetToken, Purchase)
   - Comandos Prisma essenciais
   - Exemplos de uso do Prisma Client
   - Relações entre tabelas
   - Histórico de migrações

✅ Autenticação:
   - Código completo do auth.controller.ts
   - JWT utils (generateToken, verifyToken)
   - Auth middleware
   - Auth Context (Frontend)
   - Fluxo completo de autenticação
   - Medidas de segurança

TOTAL DE CÓDIGO DOCUMENTADO:
- Mais de 500 linhas de código real do projeto
- 4 seções completas e detalhadas
- Exemplos práticos em cada seção
- Explicações passo a passo
- Código copiável com botão de copiar

PRÓXIMOS PASSOS:
- Adicionar seções para: Email, Pagamentos, Componentes, Performance
- Expandir com mais exemplos de uso
- Adicionar diagramas e fluxogramas
- Incluir troubleshooting específico de cada seção
*/
