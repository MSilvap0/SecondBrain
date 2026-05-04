'use client';

import { CommandPalette } from '../../components/CommandPalette';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Sparkles, Command, ArrowRight, Keyboard } from 'lucide-react';

export default function CommandPaletteDemo() {
  return (
    <DashboardLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Command Palette</h1>
            <p className="text-slate-400">
              Busca universal estilo Linear/Notion com atalhos de teclado
            </p>
          </div>

          {/* Demo Command Palette - sempre visível para demo */}
          <div className="relative">
            <CommandPalette placeholder="Digite para buscar..." />
          </div>

{/* Instruções */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Como Usar */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Keyboard className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Como Usar</h2>
              </div>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-white">⌘ K</kbd>
                  <span>ou</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-white">Ctrl K</kbd>
                  <span>para abrir</span>
                </li>
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-white">↑ ↓</kbd>
                  <span>para navegar</span>
                </li>
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-white">Enter</kbd>
                  <span>para selecionar</span>
                </li>
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-white">Esc</kbd>
                  <span>para fechar</span>
                </li>
              </ul>
            </div>

            {/* Atalhos Rápidos */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Atalhos Rápidos</h2>
              </div>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center justify-between">
                  <span>Nova Ideia</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-white">⌘ N</kbd>
                </li>
                <li className="flex items-center justify-between">
                  <span>Dashboard</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-white">⌘ D</kbd>
                </li>
                <li className="flex items-center justify-between">
                  <span>Chat IA</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-white">⌘ C</kbd>
                </li>
                <li className="flex items-center justify-between">
                  <span>Configurações</span>
                  <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-white">⌘ ,</kbd>
                </li>
              </ul>
            </div>
          </div>

{/* Feature List */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <ArrowRight className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Funcionalidades</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>Busca em tempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <span>Categorias organizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                <span>Atalhos de teclado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>Fuzzy matching</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                <span>Navegação por teclado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span>Animações suaves</span>
              </div>
            </div>
          </div>

          {/* Test Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                // Dispara evento de teclado para testar
                document.dispatchEvent(new KeyboardEvent('keydown', {
                  key: 'k',
                  metaKey: true,
                }));
              }}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-white"
            >
              <Command className="w-5 h-5" />
              <span>Testar Command Palette</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
