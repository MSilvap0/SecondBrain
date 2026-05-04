// TODAS AS SEÇÕES DA DOCUMENTAÇÃO
// Este arquivo contém as 20 seções completas

import { Check, Copy, Zap, Shield, Database, Lock, Sparkles, Mail, CreditCard, Code, Cpu, FileText, Cloud, AlertTriangle, GitBranch, Users, Package, Server, Key, Globe, Layers, Terminal, FileCode, Book, Settings, HardDrive, Workflow, Boxes } from 'lucide-react';

// ============================================================================
// OVERVIEW SECTION
// ============================================================================

export function OverviewSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Bem-vindo ao Second Brain</h2>
        <p className="text-neutral-400 text-lg">
          Uma plataforma completa para gerenciar e expandir suas ideias com IA
        </p>
      </div>

      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-on-surface mb-4">🚀 O que é o Second Brain?</h3>
        <p className="text-neutral-300 mb-4">
          Second Brain é uma aplicação web moderna que permite capturar, organizar e expandir suas ideias
          usando inteligência artificial. Com uma interface intuitiva e recursos poderosos, você pode:
        </p>
        <ul className="space-y-2 text-neutral-300">
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Capturar ideias rapidamente e organizá-las com tags</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Expandir ideias com IA (Groq API - gratuita e rápida)</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Chat interativo com IA para desenvolver conceitos</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Sistema de planos (Free, Pro, Max) com tokens de IA</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Autenticação segura com JWT e verificação de email</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-6">
          <h4 className="text-sm font-semibold text-on-surface mb-3">📦 Stack Tecnológico</h4>
          <div className="space-y-2 text-sm text-neutral-300">
            <div className="flex justify-between">
              <span>Frontend:</span>
              <span className="text-indigo-400">Next.js 16 + TypeScript</span>
            </div>
            <div className="flex justify-between">
              <span>Backend:</span>
              <span className="text-indigo-400">Node.js + Express</span>
            </div>
            <div className="flex justify-between">
              <span>Banco:</span>
              <span className="text-indigo-400">SQLite + Prisma</span>
            </div>
            <div className="flex justify-between">
              <span>IA:</span>
              <span className="text-indigo-400">Groq API</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="text-indigo-400">Nodemailer + Resend</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-6">
          <h4 className="text-sm font-semibold text-on-surface mb-3">🔗 Links Úteis</h4>
          <div className="space-y-2 text-sm">
            <a href="http://localhost:3000" className="block text-indigo-400 hover:text-indigo-300">
              → Frontend (localhost:3000)
            </a>
            <a href="http://localhost:3001" className="block text-indigo-400 hover:text-indigo-300">
              → Backend API (localhost:3001)
            </a>
            <a href="https://console.groq.com" target="_blank" className="block text-indigo-400 hover:text-indigo-300">
              → Groq Console
            </a>
            <a href="https://resend.com" target="_blank" className="block text-indigo-400 hover:text-indigo-300">
              → Resend (Email)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ARCHITECTURE SECTION
// ============================================================================

export function ArchitectureSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Arquitetura do Sistema</h2>
        <p className="text-neutral-400">Estrutura e organização do projeto</p>
      </div>

      <div className="bg-card border border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">📁 Estrutura de Pastas</h3>
        <pre className="text-sm text-neutral-300 font-mono overflow-x-auto">
{`second-brain/
├── frontend/                 # Next.js 16 + TypeScript
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── chat/[id]/       # Chat com IA (dinâmico)
│   │   ├── ideas/           # Gerenciamento de ideias
│   │   ├── login/           # Autenticação
│   │   └── docs/            # Documentação
│   ├── components/          # Componentes reutilizáveis
│   │   ├── animated/        # Componentes com animações
│   │   ├── MarkdownMessage.tsx
│   │   └── DashboardLayout.tsx
│   ├── contexts/            # Context API (Auth, etc)
│   ├── utils/               # Utilitários (api.utils, idea.utils)
│   └── shared/              # Código compartilhado
│       └── constants/       # Constantes (api.ts, messages.ts)
│
├── backend/                 # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   │   ├── ai.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── purchase.controller.ts
│   │   │   └── ...
│   │   ├── services/        # Serviços (IA, Email)
│   │   ├── middlewares/     # Auth middleware
│   │   ├── routes/          # Rotas da API
│   │   └── utils/           # JWT, Password utils
│   └── prisma/
│       ├── schema.prisma    # Schema do banco
│       └── migrations/      # Migrações
│
└── docs/                    # Documentação markdown`}
        </pre>
      </div>

      <div className="bg-card border border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">🔄 Fluxo de Dados</h3>
        <div className="space-y-4 text-sm text-neutral-300">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-500/20 text-indigo-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
            <div>
              <strong className="text-on-surface">Frontend (Next.js)</strong>
              <p className="text-neutral-400 mt-1">Usuário interage com a interface → Componentes React</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-indigo-500/20 text-indigo-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
            <div>
              <strong className="text-on-surface">API Utils</strong>
              <p className="text-neutral-400 mt-1">Requisições HTTP com autenticação automática (JWT)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-indigo-500/20 text-indigo-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
            <div>
              <strong className="text-on-surface">Backend (Express)</strong>
              <p className="text-neutral-400 mt-1">Controllers processam requisições → Services executam lógica</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-indigo-500/20 text-indigo-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
            <div>
              <strong className="text-on-surface">Banco de Dados (Prisma + SQLite)</strong>
              <p className="text-neutral-400 mt-1">Dados persistidos e retornados ao frontend</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">✅ Princípios Seguidos</h4>
          <ul className="space-y-1 text-sm text-neutral-300">
            <li>• Separação de responsabilidades</li>
            <li>• DRY (Don't Repeat Yourself)</li>
            <li>• Type Safety com TypeScript</li>
            <li>• Código reutilizável e modular</li>
          </ul>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-400 mb-2">🚀 Tecnologias Principais</h4>
          <ul className="space-y-1 text-sm text-neutral-300">
            <li>• Next.js 16 (App Router)</li>
            <li>• Express.js + TypeScript</li>
            <li>• Prisma ORM + SQLite</li>
            <li>• Groq API (IA)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SETUP SECTION
// ============================================================================

export function SetupSection({ copyCode, copiedCode }: any) {
  const envBackend = `# Backend .env
PORT=3001
JWT_SECRET=seu_jwt_secret_aqui_muito_seguro
DATABASE_URL="file:./dev.db"

# Groq API (IA)
GROQ_API_KEY=gsk_sua_chave_aqui

# Email (Resend)
RESEND_API_KEY=re_sua_chave_aqui
EMAIL_FROM=noreply@seudominio.com

# URLs
FRONTEND_URL=http://localhost:3000`;

  const envFrontend = `# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Instalação e Configuração</h2>
        <p className="text-neutral-400">Guia completo para rodar o projeto localmente</p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Pré-requisitos</h4>
        <ul className="space-y-1 text-sm text-neutral-300">
          <li>• Node.js 18+ instalado</li>
          <li>• npm ou yarn</li>
          <li>• Conta Groq (gratuita) para IA</li>
          <li>• Conta Resend (opcional) para emails</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-on-surface">📦 Passo 1: Clonar e Instalar</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">Terminal</span>
            <button
              onClick={() => copyCode('git clone https://github.com/seu-usuario/second-brain.git\ncd second-brain\nnpm install', 'setup-1')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'setup-1' ? (
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
            <code className="text-sm text-neutral-300 font-mono">git clone https://github.com/seu-usuario/second-brain.git{'\n'}cd second-brain{'\n'}npm install</code>
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-on-surface">⚙️ Passo 2: Configurar Variáveis de Ambiente</h3>
        
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">backend/.env</span>
            <button
              onClick={() => copyCode(envBackend, 'env-backend')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'env-backend' ? (
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
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{envBackend}</code>
          </pre>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">frontend/.env.local</span>
            <button
              onClick={() => copyCode(envFrontend, 'env-frontend')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'env-frontend' ? (
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
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{envFrontend}</code>
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-on-surface">🗄️ Passo 3: Configurar Banco de Dados</h3>
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">Terminal</span>
            <button
              onClick={() => copyCode('cd backend\nnpx prisma migrate dev\nnpx prisma generate', 'setup-db')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'setup-db' ? (
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
            <code className="text-sm text-neutral-300 font-mono">cd backend{'\n'}npx prisma migrate dev{'\n'}npx prisma generate</code>
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-on-surface">🚀 Passo 4: Iniciar Servidores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-on-surface mb-2">Backend (Terminal 1)</h4>
            <code className="text-xs text-neutral-300 font-mono">cd backend && npm run dev</code>
            <p className="text-xs text-neutral-400 mt-2">Roda em: http://localhost:3001</p>
          </div>
          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-on-surface mb-2">Frontend (Terminal 2)</h4>
            <code className="text-xs text-neutral-300 font-mono">cd frontend && npm run dev</code>
            <p className="text-xs text-neutral-400 mt-2">Roda em: http://localhost:3000</p>
          </div>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Pronto!</h4>
        <p className="text-sm text-neutral-300">
          Acesse <a href="http://localhost:3000" className="text-indigo-400 hover:underline">http://localhost:3000</a> e crie sua conta!
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// API SECTION
// ============================================================================

export function ApiSection({ copyCode, copiedCode }: any) {
  const apiGetExample = `import { apiGet } from '@/utils/api.utils';

// Buscar ideias do usuário
const ideas = await apiGet<Idea[]>('/ideas');

// Buscar configurações do usuário
const settings = await apiGet<UserSettings>('/user/settings');`;

  const apiPostExample = `import { apiPost } from '@/utils/api.utils';

// Criar nova ideia
const newIdea = await apiPost<Idea>('/ideas', {
  title: 'Minha ideia',
  content: 'Descrição da ideia',
  tags: ['tag1', 'tag2']
});

// Expandir ideia com IA
const expanded = await apiPost('/ideas/expand', {
  ideaId: '123',
  prompt: 'Expanda esta ideia'
});`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">API Utils</h2>
        <p className="text-neutral-400">Wrappers HTTP simplificados com autenticação automática</p>
      </div>

      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">🎯 Por que usar API Utils?</h3>
        <ul className="space-y-2 text-sm text-neutral-300">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Autenticação automática:</strong> JWT adicionado automaticamente</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Type Safety:</strong> Suporte a TypeScript genéricos</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Tratamento de erros:</strong> Erros padronizados e legíveis</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Menos boilerplate:</strong> 80% menos código repetitivo</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-on-surface">📖 Funções Disponíveis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <code className="text-sm text-indigo-400 font-mono">apiGet&lt;T&gt;(url)</code>
            <p className="text-xs text-neutral-400 mt-2">Requisições GET com tipo de retorno</p>
          </div>
          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <code className="text-sm text-indigo-400 font-mono">apiPost&lt;T&gt;(url, data)</code>
            <p className="text-xs text-neutral-400 mt-2">Requisições POST com body</p>
          </div>
          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <code className="text-sm text-indigo-400 font-mono">apiPut&lt;T&gt;(url, data)</code>
            <p className="text-xs text-neutral-400 mt-2">Requisições PUT para atualizar</p>
          </div>
          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <code className="text-sm text-indigo-400 font-mono">apiDelete&lt;T&gt;(url)</code>
            <p className="text-xs text-neutral-400 mt-2">Requisições DELETE</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-on-surface">💻 Exemplos de Uso</h3>
        
        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">GET Request</span>
            <button
              onClick={() => copyCode(apiGetExample, 'api-get')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'api-get' ? (
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
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{apiGetExample}</code>
          </pre>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
            <span className="text-sm font-medium text-neutral-300">POST Request</span>
            <button
              onClick={() => copyCode(apiPostExample, 'api-post')}
              className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
            >
              {copiedCode === 'api-post' ? (
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
            <code className="text-sm text-neutral-300 font-mono whitespace-pre">{apiPostExample}</code>
          </pre>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Dica</h4>
        <p className="text-sm text-neutral-300">
          Sempre use <code className="text-indigo-400">apiGet/apiPost/apiPut/apiDelete</code> ao invés de <code className="text-red-400">fetch()</code> direto.
          Isso garante autenticação automática e tratamento de erros consistente.
        </p>
      </div>
    </div>
  );
}

// Continua no próximo bloco...

// ============================================================================
// COMPONENTS SECTION
// ============================================================================

export function ComponentsSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Componentes</h2>
        <p className="text-neutral-400">Biblioteca de componentes reutilizáveis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">DashboardLayout</h4>
          <p className="text-xs text-neutral-400">Layout principal com sidebar e navbar</p>
        </div>
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">MarkdownMessage</h4>
          <p className="text-xs text-neutral-400">Renderiza markdown com syntax highlighting</p>
        </div>
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">AnimatedPage</h4>
          <p className="text-xs text-neutral-400">Wrapper com animações de entrada</p>
        </div>
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">AnimatedButton</h4>
          <p className="text-xs text-neutral-400">Botão com hover e click animations</p>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">📍 Localização</h4>
        <p className="text-sm text-neutral-300">
          Todos os componentes estão em <code className="text-indigo-400">frontend/components/</code>
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// UTILS SECTION
// ============================================================================

export function UtilsSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Utilitários</h2>
        <p className="text-neutral-400">Funções auxiliares reutilizáveis</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">api.utils.ts</h4>
          <p className="text-xs text-neutral-400 mb-3">Wrappers HTTP (apiGet, apiPost, apiPut, apiDelete)</p>
          <code className="text-xs text-neutral-300 font-mono">frontend/utils/api.utils.ts</code>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">idea.utils.ts</h4>
          <p className="text-xs text-neutral-400 mb-3">Funções para manipular ideias</p>
          <code className="text-xs text-neutral-300 font-mono">frontend/utils/idea.utils.ts</code>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">jwt.util.ts</h4>
          <p className="text-xs text-neutral-400 mb-3">Geração e validação de JWT (Backend)</p>
          <code className="text-xs text-neutral-300 font-mono">backend/src/utils/jwt.util.ts</code>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">password.util.ts</h4>
          <p className="text-xs text-neutral-400 mb-3">Hash e comparação de senhas (Backend)</p>
          <code className="text-xs text-neutral-300 font-mono">backend/src/utils/password.util.ts</code>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CONSTANTS SECTION
// ============================================================================

export function ConstantsSection({ copyCode, copiedCode }: any) {
  const constantsExample = `import { API_ENDPOINTS, ERROR_MESSAGES } from '@/shared/constants';

// Usar endpoints centralizados
const ideas = await apiGet(API_ENDPOINTS.IDEAS.LIST);

// Usar mensagens padronizadas
toast.error(ERROR_MESSAGES.NETWORK_ERROR);`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Constantes</h2>
        <p className="text-neutral-400">Valores centralizados e reutilizáveis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">api.ts</h4>
          <p className="text-xs text-neutral-400 mb-2">20+ endpoints da API</p>
          <code className="text-xs text-neutral-300 font-mono">shared/constants/api.ts</code>
        </div>
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">messages.ts</h4>
          <p className="text-xs text-neutral-400 mb-2">Mensagens de erro e sucesso</p>
          <code className="text-xs text-neutral-300 font-mono">shared/constants/messages.ts</code>
        </div>
      </div>

      <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
          <span className="text-sm font-medium text-neutral-300">Exemplo de Uso</span>
          <button
            onClick={() => copyCode(constantsExample, 'constants-ex')}
            className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
          >
            {copiedCode === 'constants-ex' ? (
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
          <code className="text-sm text-neutral-300 font-mono whitespace-pre">{constantsExample}</code>
        </pre>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Benefícios</h4>
        <ul className="space-y-1 text-sm text-neutral-300">
          <li>• Evita strings mágicas no código</li>
          <li>• Facilita refatoração de URLs</li>
          <li>• Mensagens consistentes em todo o app</li>
          <li>• Autocomplete no IDE</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// DATABASE SECTION
// ============================================================================

export function DatabaseSection({ copyCode, copiedCode }: any) {
  const schemaExample = `model User {
  id                Int       @id @default(autoincrement())
  email             String    @unique
  password          String
  name              String?
  subscriptionPlan  String    @default("free")
  aiTokensUsed      Int       @default(0)
  aiTokensLimit     Int?
  createdAt         DateTime  @default(now())
  
  ideas             Idea[]
  chatMessages      ChatMessage[]
}

model Idea {
  id          Int       @id @default(autoincrement())
  title       String
  content     String
  tags        String?
  userId      Int
  user        User      @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Banco de Dados</h2>
        <p className="text-neutral-400">Prisma ORM + SQLite</p>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">🗄️ Estrutura do Banco</h3>
        <ul className="space-y-2 text-sm text-neutral-300">
          <li>• <strong>User:</strong> Usuários, planos e tokens</li>
          <li>• <strong>Idea:</strong> Ideias criadas pelos usuários</li>
          <li>• <strong>ChatMessage:</strong> Mensagens do chat com IA</li>
          <li>• <strong>PendingVerification:</strong> Verificação de email</li>
          <li>• <strong>PasswordResetToken:</strong> Tokens de reset de senha</li>
          <li>• <strong>Purchase:</strong> Compras de créditos</li>
        </ul>
      </div>

      <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
          <span className="text-sm font-medium text-neutral-300">schema.prisma (exemplo)</span>
          <button
            onClick={() => copyCode(schemaExample, 'schema')}
            className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
          >
            {copiedCode === 'schema' ? (
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
          <code className="text-sm text-neutral-300 font-mono whitespace-pre">{schemaExample}</code>
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">Comandos Úteis</h4>
          <div className="space-y-2 text-xs text-neutral-300 font-mono">
            <div>npx prisma migrate dev</div>
            <div>npx prisma generate</div>
            <div>npx prisma studio</div>
          </div>
        </div>
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">Localização</h4>
          <code className="text-xs text-neutral-300 font-mono">backend/prisma/schema.prisma</code>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// AUTH SECTION
// ============================================================================

export function AuthSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Autenticação</h2>
        <p className="text-neutral-400">Sistema de autenticação com JWT</p>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">🔐 Fluxo de Autenticação</h3>
        <div className="space-y-3 text-sm text-neutral-300">
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
            <div>
              <strong>Registro:</strong> Usuário cria conta → Email de verificação enviado
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
            <div>
              <strong>Verificação:</strong> Usuário clica no link → Conta ativada
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
            <div>
              <strong>Login:</strong> Credenciais validadas → JWT gerado
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
            <div>
              <strong>Requisições:</strong> JWT enviado no header Authorization
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">Frontend</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• AuthContext gerencia estado</li>
            <li>• Token salvo em localStorage</li>
            <li>• Redirecionamento automático</li>
          </ul>
        </div>
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">Backend</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• JWT com bcrypt</li>
            <li>• Middleware de autenticação</li>
            <li>• Tokens de reset de senha</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Segurança</h4>
        <ul className="space-y-1 text-sm text-neutral-300">
          <li>• Senhas hasheadas com bcrypt</li>
          <li>• JWT expira em 7 dias</li>
          <li>• Tokens de verificação únicos</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// AI SECTION
// ============================================================================

export function AISection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">IA & Chat</h2>
        <p className="text-neutral-400">Integração com Groq API</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">✨ Funcionalidades de IA</h3>
        <ul className="space-y-2 text-sm text-neutral-300">
          <li className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <span><strong>Expandir Ideias:</strong> IA desenvolve e detalha suas ideias</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <span><strong>Chat Interativo:</strong> Converse com a IA sobre suas ideias</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <span><strong>Geração de Tags:</strong> Tags automáticas baseadas no conteúdo</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <span><strong>Resumos:</strong> Resumos automáticos de ideias longas</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">Free</h4>
          <p className="text-2xl font-bold text-indigo-400 mb-1">100K</p>
          <p className="text-xs text-neutral-400">tokens/mês</p>
        </div>
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">Pro Anual</h4>
          <p className="text-2xl font-bold text-purple-400 mb-1">36M</p>
          <p className="text-xs text-neutral-400">tokens/ano</p>
        </div>
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">Max Anual</h4>
          <p className="text-2xl font-bold text-pink-400 mb-1">240M</p>
          <p className="text-xs text-neutral-400">tokens/ano</p>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">🚀 Groq API</h4>
        <p className="text-sm text-neutral-300">
          Usamos Groq API (gratuita) com modelo <code className="text-indigo-400">llama-3.3-70b-versatile</code>.
          É extremamente rápida e tem limite generoso de tokens.
        </p>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Tracking de Tokens</h4>
        <p className="text-sm text-neutral-300">
          Sistema completo de tracking implementado em TODOS os endpoints de IA.
          Retorna erro 429 quando limite atingido.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// EMAIL SECTION
// ============================================================================

export function EmailSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Email</h2>
        <p className="text-neutral-400">Sistema de envio de emails</p>
      </div>

      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">📧 Tipos de Email</h3>
        <ul className="space-y-2 text-sm text-neutral-300">
          <li>• <strong>Verificação de Email:</strong> Link para ativar conta</li>
          <li>• <strong>Reset de Senha:</strong> Link para redefinir senha</li>
          <li>• <strong>Boas-vindas:</strong> Email após verificação</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">Desenvolvimento</h4>
          <p className="text-xs text-neutral-400 mb-2">Nodemailer (console)</p>
          <p className="text-xs text-neutral-300">Emails aparecem no terminal do backend</p>
        </div>
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">Produção</h4>
          <p className="text-xs text-neutral-400 mb-2">Resend API</p>
          <p className="text-xs text-neutral-300">Emails reais enviados via Resend</p>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚙️ Configuração</h4>
        <p className="text-sm text-neutral-300">
          Configure <code className="text-indigo-400">RESEND_API_KEY</code> no <code className="text-indigo-400">backend/.env</code> para usar Resend.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PAYMENTS SECTION
// ============================================================================

export function PaymentsSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Pagamentos</h2>
        <p className="text-neutral-400">Sistema de planos e compra de créditos</p>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">💳 Planos Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-on-surface mb-2">Free</h4>
            <p className="text-2xl font-bold text-neutral-400 mb-1">R$ 0</p>
            <p className="text-xs text-neutral-400 mb-3">100K tokens/mês</p>
            <ul className="space-y-1 text-xs text-neutral-300">
              <li>✓ Ideias ilimitadas</li>
              <li>✓ Chat com IA</li>
              <li>✓ Tags automáticas</li>
            </ul>
          </div>
          <div className="bg-card border border-indigo-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-indigo-400 mb-2">Pro Anual</h4>
            <p className="text-2xl font-bold text-indigo-400 mb-1">R$ 99</p>
            <p className="text-xs text-neutral-400 mb-3">36M tokens/ano</p>
            <ul className="space-y-1 text-xs text-neutral-300">
              <li>✓ Tudo do Free</li>
              <li>✓ 3M tokens/mês</li>
              <li>✓ Suporte prioritário</li>
            </ul>
          </div>
          <div className="bg-card border border-purple-500/30 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-purple-400 mb-2">Max Anual</h4>
            <p className="text-2xl font-bold text-purple-400 mb-1">R$ 299</p>
            <p className="text-xs text-neutral-400 mb-3">240M tokens/ano</p>
            <ul className="space-y-1 text-xs text-neutral-300">
              <li>✓ Tudo do Pro</li>
              <li>✓ 20M tokens/mês</li>
              <li>✓ Acesso antecipado</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">💰 Compra de Créditos</h4>
        <p className="text-sm text-neutral-300 mb-2">
          Usuários podem comprar créditos extras além do plano:
        </p>
        <ul className="space-y-1 text-sm text-neutral-300">
          <li>• 10M tokens: R$ 10</li>
          <li>• 50M tokens: R$ 40</li>
          <li>• 100M tokens: R$ 70</li>
        </ul>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Sistema de Limites</h4>
        <p className="text-sm text-neutral-300">
          O sistema usa o <strong>MAIOR</strong> valor entre limite do plano e créditos comprados.
          Exemplo: Pro Anual (36M) + 100M comprados = 136M tokens disponíveis.
        </p>
      </div>
    </div>
  );
}

// Continua...

// ============================================================================
// PATTERNS SECTION
// ============================================================================

export function PatternsSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Padrões de Código</h2>
        <p className="text-neutral-400">Boas práticas e convenções do projeto</p>
      </div>

      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">✅ Padrões Seguidos</h3>
        <ul className="space-y-2 text-sm text-neutral-300">
          <li>• <strong>DRY:</strong> Não repetir código (usar utils e constants)</li>
          <li>• <strong>Type Safety:</strong> TypeScript em 100% do código</li>
          <li>• <strong>Separation of Concerns:</strong> Controllers, Services, Utils separados</li>
          <li>• <strong>Consistent Naming:</strong> camelCase para variáveis, PascalCase para componentes</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">✅ Fazer</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Usar apiGet/apiPost ao invés de fetch</li>
            <li>• Usar constantes (API_ENDPOINTS)</li>
            <li>• Tipar todas as funções</li>
            <li>• Usar useMemo para computações caras</li>
          </ul>
        </div>
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">❌ Evitar</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Strings mágicas no código</li>
            <li>• fetch() direto sem wrapper</li>
            <li>• Código duplicado</li>
            <li>• any sem necessidade</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PERFORMANCE SECTION
// ============================================================================

export function PerformanceSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Performance</h2>
        <p className="text-neutral-400">Otimizações implementadas</p>
      </div>

      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">🚀 Otimizações</h3>
        <ul className="space-y-2 text-sm text-neutral-300">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>useMemo:</strong> Parsing de markdown otimizado</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Lazy Loading:</strong> Componentes carregados sob demanda</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Code Splitting:</strong> Next.js divide bundle automaticamente</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span><strong>Debouncing:</strong> Busca com delay para evitar requisições excessivas</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">💡 Dicas</h4>
        <ul className="space-y-1 text-sm text-neutral-300">
          <li>• Use Next.js Image para otimizar imagens</li>
          <li>• Evite re-renders desnecessários com React.memo</li>
          <li>• Use useCallback para funções passadas como props</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// SECURITY SECTION
// ============================================================================

export function SecuritySection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Segurança</h2>
        <p className="text-neutral-400">Práticas de segurança implementadas</p>
      </div>

      <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">🔒 Medidas de Segurança</h3>
        <ul className="space-y-2 text-sm text-neutral-300">
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span><strong>Senhas:</strong> Hasheadas com bcrypt (salt rounds: 10)</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span><strong>JWT:</strong> Tokens com expiração de 7 dias</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span><strong>CORS:</strong> Configurado para aceitar apenas frontend autorizado</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span><strong>Validação:</strong> Input validation em todos os endpoints</span>
          </li>
        </ul>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Importante</h4>
        <ul className="space-y-1 text-sm text-neutral-300">
          <li>• Nunca commitar .env com chaves reais</li>
          <li>• Usar HTTPS em produção</li>
          <li>• Rotacionar JWT_SECRET regularmente</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// TESTING SECTION
// ============================================================================

export function TestingSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Testes</h2>
        <p className="text-neutral-400">Estratégia de testes do projeto</p>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">🧪 Tipos de Testes</h3>
        <ul className="space-y-2 text-sm text-neutral-300">
          <li>• <strong>Unitários:</strong> Testar funções isoladas (utils, helpers)</li>
          <li>• <strong>Integração:</strong> Testar fluxos completos (API + DB)</li>
          <li>• <strong>E2E:</strong> Testar interface do usuário (Playwright)</li>
        </ul>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">📦 Ferramentas Recomendadas</h4>
        <ul className="space-y-1 text-sm text-neutral-300">
          <li>• Jest para testes unitários</li>
          <li>• React Testing Library para componentes</li>
          <li>• Playwright para E2E</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// DEPLOYMENT SECTION
// ============================================================================

export function DeploymentSection({ copyCode, copiedCode }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Deploy</h2>
        <p className="text-neutral-400">Como fazer deploy do projeto</p>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">☁️ Opções de Deploy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-on-surface mb-2">Frontend</h4>
            <ul className="space-y-1 text-xs text-neutral-300">
              <li>• Vercel (recomendado)</li>
              <li>• Netlify</li>
              <li>• AWS Amplify</li>
            </ul>
          </div>
          <div className="bg-card border border-neutral-700 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-on-surface mb-2">Backend</h4>
            <ul className="space-y-1 text-xs text-neutral-300">
              <li>• Railway</li>
              <li>• Render</li>
              <li>• AWS EC2</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Antes do Deploy</h4>
        <ul className="space-y-1 text-sm text-neutral-300">
          <li>• Configurar variáveis de ambiente</li>
          <li>• Migrar banco de dados para PostgreSQL</li>
          <li>• Configurar CORS corretamente</li>
          <li>• Testar em ambiente de staging</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// TROUBLESHOOTING SECTION
// ============================================================================

export function TroubleshootingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Troubleshooting</h2>
        <p className="text-neutral-400">Problemas comuns e soluções</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">❌ Backend não inicia</h4>
          <p className="text-xs text-neutral-400 mb-2">Solução:</p>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Verificar se porta 3001 está livre</li>
            <li>• Rodar <code className="text-indigo-400">npx prisma generate</code></li>
            <li>• Verificar variáveis de ambiente no .env</li>
          </ul>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">❌ Tokens não são gastos</h4>
          <p className="text-xs text-neutral-400 mb-2">Solução:</p>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Sistema de tracking já implementado</li>
            <li>• Verificar se GROQ_API_KEY está configurada</li>
            <li>• Checar logs do backend para erros</li>
          </ul>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">❌ Chat com mensagens duplicadas</h4>
          <p className="text-xs text-neutral-400 mb-2">Solução:</p>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Já corrigido com hasExpandedRef</li>
            <li>• React StrictMode causa chamadas duplas em dev</li>
          </ul>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-on-surface mb-2">❌ Email não enviado</h4>
          <p className="text-xs text-neutral-400 mb-2">Solução:</p>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Em dev, emails aparecem no console do backend</li>
            <li>• Para emails reais, configurar RESEND_API_KEY</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CHANGELOG SECTION
// ============================================================================

export function ChangelogSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Changelog</h2>
        <p className="text-neutral-400">Histórico de mudanças do projeto</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/20 px-2 py-1 rounded">v1.6.0</span>
            <span className="text-xs text-neutral-500">Maio 2026</span>
          </div>
          <h4 className="text-sm font-semibold text-on-surface mb-2">Documentação Completa</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Página de documentação com 20 seções</li>
            <li>• Sidebar responsiva com categorias</li>
            <li>• Busca integrada (UI)</li>
          </ul>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded">v1.5.0</span>
            <span className="text-xs text-neutral-500">Maio 2026</span>
          </div>
          <h4 className="text-sm font-semibold text-on-surface mb-2">Refatoração Completa</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Criado api.utils (apiGet, apiPost, etc)</li>
            <li>• Criado constants (API_ENDPOINTS, MESSAGES)</li>
            <li>• Removido ~300 linhas de código morto</li>
            <li>• Otimizado MarkdownMessage com useMemo</li>
          </ul>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-purple-400 bg-purple-500/20 px-2 py-1 rounded">v1.4.0</span>
            <span className="text-xs text-neutral-500">Maio 2026</span>
          </div>
          <h4 className="text-sm font-semibold text-on-surface mb-2">Sistema de Compras</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Planos anuais (Pro: 36M, Max: 240M tokens)</li>
            <li>• Compra de créditos extras</li>
            <li>• Sistema usa MAIOR valor (plano vs créditos)</li>
          </ul>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/20 px-2 py-1 rounded">v1.3.0</span>
            <span className="text-xs text-neutral-500">Maio 2026</span>
          </div>
          <h4 className="text-sm font-semibold text-on-surface mb-2">Chat Melhorado</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• MarkdownMessage com syntax highlighting</li>
            <li>• Botão copiar código</li>
            <li>• Correção de mensagens duplicadas</li>
          </ul>
        </div>

        <div className="bg-card border border-neutral-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded">v1.2.0</span>
            <span className="text-xs text-neutral-500">Maio 2026</span>
          </div>
          <h4 className="text-sm font-semibold text-on-surface mb-2">Tracking de Tokens</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Sistema completo de tracking em TODOS endpoints</li>
            <li>• Erro 429 quando limite atingido</li>
            <li>• Funções auxiliares (checkTokenLimit, trackTokenUsage)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CONTRIBUTING SECTION
// ============================================================================

export function ContributingSection({ copyCode, copiedCode }: any) {
  const contributingExample = `# Como Contribuir

1. Fork o repositório
2. Crie uma branch: git checkout -b feature/nova-feature
3. Commit suas mudanças: git commit -m 'Add nova feature'
4. Push para a branch: git push origin feature/nova-feature
5. Abra um Pull Request`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Como Contribuir</h2>
        <p className="text-neutral-400">Guia para contribuir com o projeto</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-3">🤝 Contribuições são bem-vindas!</h3>
        <p className="text-sm text-neutral-300 mb-4">
          Adoramos receber contribuições da comunidade. Seja corrigindo bugs, adicionando features ou melhorando a documentação.
        </p>
        <ul className="space-y-2 text-sm text-neutral-300">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Reporte bugs abrindo uma issue</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Sugira novas features</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Melhore a documentação</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
            <span>Envie Pull Requests</span>
          </li>
        </ul>
      </div>

      <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
          <span className="text-sm font-medium text-neutral-300">Fluxo de Contribuição</span>
          <button
            onClick={() => copyCode(contributingExample, 'contributing')}
            className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
          >
            {copiedCode === 'contributing' ? (
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
          <code className="text-sm text-neutral-300 font-mono whitespace-pre">{contributingExample}</code>
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Boas Práticas</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• Seguir padrões do projeto</li>
            <li>• Escrever código limpo e documentado</li>
            <li>• Testar antes de enviar PR</li>
            <li>• Commits descritivos</li>
          </ul>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">📝 Code Review</h4>
          <ul className="space-y-1 text-xs text-neutral-300">
            <li>• PRs são revisados em até 48h</li>
            <li>• Feedback construtivo</li>
            <li>• Discussões abertas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
