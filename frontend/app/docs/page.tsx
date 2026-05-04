'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, Code, Zap, Shield, Layers, Terminal, FileCode, Sparkles,
  ChevronRight, Copy, Check, Search, Menu, X, Database, Lock,
  Cpu, Globe, Package, Settings, Users, GitBranch, Workflow,
  Server, Cloud, Key, Mail, CreditCard, BarChart, FileText,
  Folder, HardDrive, Boxes, Puzzle
} from 'lucide-react';
import {
  OverviewSection,
  ArchitectureSection,
  SetupSection,
  ApiSection,
  ComponentsSection,
  UtilsSection,
  ConstantsSection,
  DatabaseSection,
  AuthSection,
  AISection,
  EmailSection,
  PaymentsSection,
  PatternsSection,
  PerformanceSection,
  SecuritySection,
  TestingSection,
  DeploymentSection,
  TroubleshootingSection,
  ChangelogSection,
  ContributingSection,
} from './sections';
import {
  ApiEndpointsSection,
  AISystemSection,
  DatabaseCompleteSection,
  AuthenticationCompleteSection,
} from './expanded-sections';

type Section = 
  | 'overview' | 'architecture' | 'setup' | 'api' | 'api-complete' | 'components' 
  | 'utils' | 'constants' | 'patterns' | 'performance' | 'database' | 'database-complete'
  | 'auth' | 'auth-complete' | 'ai' | 'ai-complete' | 'email' | 'payments' | 'deployment' | 'testing'
  | 'security' | 'troubleshooting' | 'changelog' | 'contributing';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sections = [
    { id: 'overview', label: 'Visão Geral', icon: Book, category: 'Início' },
    { id: 'architecture', label: 'Arquitetura', icon: Boxes, category: 'Início' },
    { id: 'setup', label: 'Instalação', icon: Settings, category: 'Início' },
    
    { id: 'api', label: 'API Utils', icon: Zap, category: 'Frontend' },
    { id: 'api-complete', label: 'API Completa', icon: Terminal, category: 'Frontend' },
    { id: 'components', label: 'Componentes', icon: Layers, category: 'Frontend' },
    { id: 'utils', label: 'Utilitários', icon: FileCode, category: 'Frontend' },
    { id: 'constants', label: 'Constantes', icon: Terminal, category: 'Frontend' },
    
    { id: 'database', label: 'Banco de Dados', icon: Database, category: 'Backend' },
    { id: 'database-complete', label: 'Banco Completo', icon: HardDrive, category: 'Backend' },
    { id: 'auth', label: 'Autenticação', icon: Lock, category: 'Backend' },
    { id: 'auth-complete', label: 'Auth Completa', icon: Key, category: 'Backend' },
    { id: 'ai', label: 'IA & Chat', icon: Sparkles, category: 'Backend' },
    { id: 'ai-complete', label: 'IA Completa', icon: Cpu, category: 'Backend' },
    { id: 'email', label: 'Email', icon: Mail, category: 'Backend' },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard, category: 'Backend' },
    
    { id: 'patterns', label: 'Padrões', icon: Code, category: 'Boas Práticas' },
    { id: 'performance', label: 'Performance', icon: Cpu, category: 'Boas Práticas' },
    { id: 'security', label: 'Segurança', icon: Shield, category: 'Boas Práticas' },
    
    { id: 'testing', label: 'Testes', icon: FileText, category: 'DevOps' },
    { id: 'deployment', label: 'Deploy', icon: Cloud, category: 'DevOps' },
    
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Puzzle, category: 'Ajuda' },
    { id: 'changelog', label: 'Changelog', icon: GitBranch, category: 'Ajuda' },
    { id: 'contributing', label: 'Contribuir', icon: Users, category: 'Ajuda' },
  ];

  // Agrupar seções por categoria
  const categories = Array.from(new Set(sections.map(s => s.category)));

  const renderSection = () => {
    const props = { copyCode, copiedCode };
    
    switch (activeSection) {
      case 'overview': return <OverviewSection />;
      case 'architecture': return <ArchitectureSection {...props} />;
      case 'setup': return <SetupSection {...props} />;
      case 'api': return <ApiSection {...props} />;
      case 'api-complete': return <ApiEndpointsSection {...props} />;
      case 'components': return <ComponentsSection {...props} />;
      case 'utils': return <UtilsSection {...props} />;
      case 'constants': return <ConstantsSection {...props} />;
      case 'database': return <DatabaseSection {...props} />;
      case 'database-complete': return <DatabaseCompleteSection {...props} />;
      case 'auth': return <AuthSection {...props} />;
      case 'auth-complete': return <AuthenticationCompleteSection {...props} />;
      case 'ai': return <AISection {...props} />;
      case 'ai-complete': return <AISystemSection {...props} />;
      case 'email': return <EmailSection {...props} />;
      case 'payments': return <PaymentsSection {...props} />;
      case 'patterns': return <PatternsSection {...props} />;
      case 'performance': return <PerformanceSection {...props} />;
      case 'security': return <SecuritySection {...props} />;
      case 'testing': return <TestingSection {...props} />;
      case 'deployment': return <DeploymentSection {...props} />;
      case 'troubleshooting': return <TroubleshootingSection />;
      case 'changelog': return <ChangelogSection />;
      case 'contributing': return <ContributingSection {...props} />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
          {/* Header */}
          <div className="sticky top-0 z-20 bg-surface-80 backdrop-blur-xl border-b border-neutral-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <a
                    href="/dashboard"
                    className="flex items-center gap-2 text-neutral-400 hover:text-on-surface transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span className="text-sm font-medium">Voltar</span>
                  </a>
                  <div className="h-6 w-px bg-neutral-700"></div>
                  <div className="flex items-center gap-3">
                    {/* Logo - Cérebro Geométrico */}
                    <div className="relative w-12 h-12">
                      <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                          </linearGradient>
                          <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                          </linearGradient>
                        </defs>
                        
                        {/* Forma do cérebro - lado esquerdo */}
                        <path d="M 60 80 Q 40 60 50 40 Q 60 20 80 30 L 90 50 L 80 70 Z" 
                              fill="url(#brainGrad)" stroke="#e5e7eb" strokeWidth="4"/>
                        
                        {/* Forma do cérebro - topo esquerdo */}
                        <path d="M 80 30 Q 100 15 120 25 L 110 45 L 90 50 Z" 
                              fill="url(#brainGrad)" stroke="#e5e7eb" strokeWidth="4"/>
                        
                        {/* Forma do cérebro - centro superior */}
                        <path d="M 120 25 Q 140 20 150 35 L 130 55 L 110 45 Z" 
                              fill="url(#highlightGrad)" stroke="#e5e7eb" strokeWidth="4"/>
                        
                        {/* Forma do cérebro - lado direito superior */}
                        <path d="M 150 35 Q 165 30 170 50 L 155 70 L 130 55 Z" 
                              fill="url(#brainGrad)" stroke="#e5e7eb" strokeWidth="4"/>
                        
                        {/* Forma do cérebro - lado direito */}
                        <path d="M 170 50 Q 180 70 175 90 Q 170 110 155 115 L 140 95 L 155 70 Z" 
                              fill="url(#brainGrad)" stroke="#e5e7eb" strokeWidth="4"/>
                        
                        {/* Forma do cérebro - centro */}
                        <path d="M 90 50 L 110 45 L 130 55 L 140 75 L 130 95 L 110 100 L 90 90 L 80 70 Z" 
                              fill="url(#brainGrad)" stroke="#e5e7eb" strokeWidth="4"/>
                        
                        {/* Destaque central - azul claro */}
                        <path d="M 110 60 L 125 65 L 125 85 L 110 80 Z" 
                              fill="url(#highlightGrad)" stroke="#e5e7eb" strokeWidth="4"/>
                        
                        {/* Forma do cérebro - inferior esquerdo */}
                        <path d="M 80 70 L 90 90 L 85 110 Q 70 120 60 110 Q 50 100 55 85 Z" 
                              fill="url(#brainGrad)" stroke="#e5e7eb" strokeWidth="4"/>
                        
                        {/* Forma do cérebro - inferior direito */}
                        <path d="M 140 95 L 155 115 Q 160 130 145 140 Q 130 145 120 135 L 110 100 Z" 
                              fill="url(#brainGrad)" stroke="#e5e7eb" strokeWidth="4"/>
                        
                        {/* Forma do cérebro - base */}
                        <path d="M 85 110 L 110 100 L 120 135 Q 110 150 100 145 Q 90 140 85 130 Z" 
                              fill="url(#brainGrad)" stroke="#e5e7eb" strokeWidth="4"/>
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-on-surface">Second Brain</h1>
                      <p className="text-xs text-neutral-400">Documentação Completa</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 bg-surface-30 rounded-lg px-4 py-2 w-80">
                    <Search className="w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Buscar na documentação..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-neutral-500 w-full"
                    />
                  </div>

                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2 text-neutral-400 hover:text-on-surface rounded-lg hover:bg-surface-30"
                  >
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
              {/* Sidebar */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <nav className="sticky top-24 space-y-6">
                  {categories.map((category) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-4">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {sections
                          .filter((s) => s.category === category)
                          .map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            
                            return (
                              <button
                                key={section.id}
                                onClick={() => {
                                  setActiveSection(section.id as Section);
                                  setSidebarOpen(false);
                                }}
                                className={`
                                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all
                                  ${isActive 
                                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-400 border border-indigo-500/20' 
                                    : 'text-neutral-400 hover:text-on-surface hover:bg-surface-30'
                                  }
                                `}
                              >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm font-medium">{section.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </nav>
              </aside>

              {/* Mobile Sidebar */}
              <motion.aside
                initial={false}
                animate={{
                  x: sidebarOpen ? 0 : -300,
                  opacity: sidebarOpen ? 1 : 0,
                }}
                className={`
                  lg:hidden fixed inset-y-0 left-0 z-30 w-72 bg-surface
                  border-r border-neutral-700/50 overflow-y-auto
                  ${sidebarOpen ? 'block' : 'hidden'}
                `}
              >
                <nav className="sticky top-24 space-y-6 p-4">
                  {categories.map((category) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-4">
                        {category}
                      </h3>
                      <div className="space-y-1">
                        {sections
                          .filter((s) => s.category === category)
                          .map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;
                            
                            return (
                              <button
                                key={section.id}
                                onClick={() => {
                                  setActiveSection(section.id as Section);
                                  setSidebarOpen(false);
                                }}
                                className={`
                                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all
                                  ${isActive 
                                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-400 border border-indigo-500/20' 
                                    : 'text-neutral-400 hover:text-on-surface hover:bg-surface-30'
                                  }
                                `}
                              >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm font-medium">{section.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </nav>
              </motion.aside>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderSection()}
                </motion.div>
              </main>
            </div>
          </div>
        </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function FeatureCard({ icon: Icon, title, description, color }: any) {
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

function Step({ number, title, children }: any) {
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

function CodeBlock({ title, language, code, copyCode, copiedCode, id }: any) {
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

function InfoBox({ type = 'info', title, children }: any) {
  const colors = {
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  return (
    <div className={`${colors[type as keyof typeof colors]} border rounded-lg p-4`}>
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <div className="text-sm text-neutral-300">{children}</div>
    </div>
  );
}
