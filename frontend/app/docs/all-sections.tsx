// Este arquivo contém TODAS as seções da documentação
// Importar no page.tsx conforme necessário

import { motion } from 'framer-motion';
import { 
  Check, Copy, Zap, Shield, Database, Lock, Sparkles,
  Mail, CreditCard, Code, Cpu, FileText, Cloud, AlertTriangle,
  GitBranch, Users, Package, Server, Key, Globe, Layers,
  Terminal, FileCode, Book, Settings, HardDrive, Workflow
} from 'lucide-react';

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

export function FeatureCard({ icon: Icon, title, description, color }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-card border border-neutral-700 rounded-lg p-6 hover:border-neutral-600 transition-all"
    >
      <div className={`bg-gradient-to-br ${color} p-3 rounded-lg w-fit mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-neutral-400">{description}</p>
    </motion.div>
  );
}

export function Step({ number, title, children }: any) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-on-surface mb-1">{title}</h4>
        <div className="text-sm text-neutral-400">{children}</div>
      </div>
    </div>
  );
}

export function CodeBlock({ title, language, code, copyCode, copiedCode, id }: any) {
  return (
    <div className="bg-card border border-neutral-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-neutral-800/50 px-4 py-2 border-b border-neutral-700">
        <span className="text-sm font-medium text-neutral-300">{title}</span>
        <button
          onClick={() => copyCode(code, id)}
          className="flex items-center gap-2 px-3 py-1 text-xs text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
        >
          {copiedCode === id ? (
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
        <code className="text-sm text-neutral-300 font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

export function InfoBox({ type = 'info', title, children }: any) {
  const colors: Record<string, string> = {
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  return (
    <div className={`${colors[type] || colors.info} border rounded-lg p-4`}>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <div className="text-sm text-neutral-300">{children}</div>
    </div>
  );
}

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          icon={Zap}
          title="API Utils"
          description="Wrappers HTTP simplificados com autenticação automática"
          color="from-yellow-500 to-orange-500"
        />
        <FeatureCard
          icon={Layers}
          title="Componentes"
          description="Biblioteca de componentes reutilizáveis e animados"
          color="from-blue-500 to-cyan-500"
        />
        <FeatureCard
          icon={Shield}
          title="Type Safety"
          description="TypeScript em todo o projeto para máxima segurança"
          color="from-green-500 to-emerald-500"
        />
        <FeatureCard
          icon={Database}
          title="Prisma ORM"
          description="Banco de dados SQLite com Prisma para desenvolvimento"
          color="from-purple-500 to-pink-500"
        />
        <FeatureCard
          icon={Sparkles}
          title="IA Integrada"
          description="Groq API para expansão e chat com ideias"
          color="from-indigo-500 to-purple-500"
        />
        <FeatureCard
          icon="Cpu"
          title="Performance"
          description="Otimizações com useMemo, lazy loading e mais"
          color="from-red-500 to-orange-500"
        />
      </div>

      <div className="bg-card border border-neutral-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Quick Start
        </h3>
        <div className="space-y-4">
          <Step number={1} title="Clonar repositório">
            <code className="text-sm">git clone https://github.com/seu-usuario/second-brain.git</code>
          </Step>
          <Step number={2} title="Instalar dependências">
            <code className="text-sm">npm install</code>
          </Step>
          <Step number={3} title="Configurar variáveis de ambiente">
            <code className="text-sm">cp .env.example .env</code>
          </Step>
          <Step number={4} title="Iniciar banco de dados">
            <code className="text-sm">cd backend && npx prisma migrate dev</code>
          </Step>
          <Step number={5} title="Iniciar servidores">
            <code className="text-sm">npm run dev</code>
          </Step>
        </div>
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

// Continua nos próximos comentários devido ao limite de tamanho...
// Vou criar as outras seções em arquivos separados
