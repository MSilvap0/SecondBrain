'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AnimatedPage, AnimatedSection } from '@/components/animated/AnimatedPage';
import { IdeaStats } from '@/components/IdeaStats';
import { SmartInput } from '@/components/SmartInput';
import { SearchBar } from '@/components/SearchBar';
import { ViewSwitcher, ViewMode } from '@/components/ViewSwitcher';
import { IdeaGrid } from '@/components/IdeaGrid';
import { IdeaList } from '@/components/IdeaList';
import { KanbanView } from '@/components/KanbanView';
import { TagManager } from '@/components/TagManager';
import { OnboardingTour } from '@/components/OnboardingTour';
import { AnimatedButton } from '@/components/animated/AnimatedButton';
import { useToast } from '@/hooks/useToast';
import { ToastContainer, AnimatedToast } from '@/components/animated/AnimatedToast';
import { Sparkles, Filter, SortAsc, Download, Share2 } from 'lucide-react';
import { getApiUrl, API_ENDPOINTS } from '@/shared/constants/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/shared/constants/messages';
import type { Idea } from '@/types/idea';

export default function DashboardPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(false);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');
  
  const { toasts, success, error, removeToast } = useToast();

  // Carregar ideias da API
  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(getApiUrl(API_ENDPOINTS.IDEAS), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
        console.log('✅ Ideias carregadas:', data.length);
      } else if (response.status === 401) {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Erro ao carregar ideias:', err);
      error('Erro ao carregar', 'Não foi possível carregar suas ideias');
    } finally {
      setLoadingIdeas(false);
    }
  };

  // Atualizar ideias filtradas quando mudar tags ou ordenação
  useEffect(() => {
    let filtered = [...ideas];

    // Filtrar por tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(idea =>
        idea.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      switch (sortBy) {
        case 'recent':
          return timeB - timeA;
        case 'oldest':
          return timeA - timeB;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredIdeas(filtered);
  }, [ideas, selectedTags, sortBy]);

  const handleAddIdea = async (content: string) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Criar a ideia primeiro
      const createResponse = await fetch(getApiUrl(API_ENDPOINTS.IDEAS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: content.split('\n')[0] || content.substring(0, 50),
          description: content,
          tags: []
        }),
      });

      if (!createResponse.ok) {
        throw new Error('Erro ao criar ideia');
      }

      const createdIdea = await createResponse.json();

      // Expandir com IA
      const expandResponse = await fetch(getApiUrl(API_ENDPOINTS.AI_EXPAND), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (expandResponse.status === 429) {
        const errorData = await expandResponse.json();
        error('Limite de tokens atingido!', errorData.message || 'Você atingiu o limite de tokens do seu plano.');
        await loadIdeas();
        return;
      }

      if (expandResponse.ok) {
        const expandedData = await expandResponse.json();
        
        // Atualizar a ideia com o conteúdo expandido
        await fetch(getApiUrl(API_ENDPOINTS.IDEA_BY_ID(createdIdea.id)), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...createdIdea,
            expandedContent: expandedData.expandedContent,
            suggestions: expandedData.suggestions,
            relatedTopics: expandedData.relatedTopics
          }),
        });
      }

      await loadIdeas();
      success('Ideia adicionada!', 'Sua ideia foi expandida pela IA');
    } catch (err) {
      console.error('Erro ao adicionar ideia:', err);
      error('Erro ao adicionar', 'Não foi possível processar sua ideia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl(API_ENDPOINTS.IDEA_BY_ID(String(id))), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIdeas(ideas.filter(idea => idea.id !== id));
        success('Ideia removida', 'A ideia foi deletada com sucesso');
      } else {
        error('Erro ao deletar', 'Não foi possível remover a ideia');
      }
    } catch (err) {
      console.error('Erro ao deletar ideia:', err);
      error('Erro ao deletar', 'Não foi possível remover a ideia');
    }
  };

  const handleToggleFavorite = async (id: string | number) => {
    try {
      const token = localStorage.getItem('token');
      const idea = ideas.find(i => i.id === id);
      
      if (!idea) return;

      const response = await fetch(getApiUrl(API_ENDPOINTS.IDEA_BY_ID(String(id))), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...idea,
          isFavorite: !idea.isFavorite
        }),
      });

      if (response.ok) {
        setIdeas(ideas.map(i =>
          i.id === id ? { ...i, isFavorite: !i.isFavorite } : i
        ));
      }
    } catch (err) {
      console.error('Erro ao favoritar ideia:', err);
    }
  };

  const handleSearch = (results: Idea[]) => {
    setFilteredIdeas(results);
  };

  const handleClearSearch = () => {
    setFilteredIdeas(ideas);
  };

  const handleCreateTag = (tag: string) => {
    // Tag será adicionada automaticamente ao ser usada
    success('Tag criada!', `A tag "${tag}" foi criada`);
  };

  const allTags = Array.from(
    new Set(ideas.flatMap(idea => idea.tags || []))
  );

  const handleExport = () => {
    const dataStr = JSON.stringify(ideas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'second-brain-ideas.json';
    link.click();
    success('Exportado!', 'Suas ideias foram exportadas');
  };

  return (
    <DashboardLayout>
      <AnimatedPage>
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <AnimatedSection delay={0}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">
                    Dashboard
                  </h1>
                  <p className="text-zinc-400 text-lg">
                    Organize suas ideias com inteligência artificial
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={handleExport}
                >
                  Exportar
                </AnimatedButton>
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  icon={<Share2 className="w-4 h-4" />}
                >
                  Compartilhar
                </AnimatedButton>
              </div>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={0.1}>
            <IdeaStats ideas={ideas} />
          </AnimatedSection>

          {/* Smart Input */}
          <AnimatedSection delay={0.2}>
            <SmartInput onSubmit={handleAddIdea} loading={loading} />
          </AnimatedSection>

          {/* Search and Filters */}
          <AnimatedSection delay={0.3}>
            <div className="space-y-4">
              <SearchBar
                ideas={ideas}
                onSearch={handleSearch}
                onClear={handleClearSearch}
              />

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Tag Manager */}
                <div className="flex-1">
                  <TagManager
                    selectedTags={selectedTags}
                    availableTags={allTags}
                    onTagsChange={setSelectedTags}
                    onCreateTag={handleCreateTag}
                  />
                </div>

                {/* View Switcher and Sort */}
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="recent">Mais recentes</option>
                    <option value="oldest">Mais antigas</option>
                    <option value="title">Título (A-Z)</option>
                  </select>

                  <ViewSwitcher
                    currentView={viewMode}
                    onViewChange={setViewMode}
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Ideas Display */}
          <AnimatedSection delay={0.4}>
            {loadingIdeas ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-zinc-400">Carregando suas ideias...</p>
                </div>
              </div>
            ) : filteredIdeas.length === 0 ? (
              <div className="text-center py-20">
                <Sparkles className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedTags.length > 0 ? 'Nenhuma ideia encontrada' : 'Nenhuma ideia ainda'}
                </h3>
                <p className="text-zinc-400 mb-6">
                  {selectedTags.length > 0 
                    ? 'Tente remover alguns filtros'
                    : 'Comece adicionando sua primeira ideia acima'
                  }
                </p>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            ) : (
              <>
                {viewMode === 'grid' && (
                  <IdeaGrid
                    ideas={filteredIdeas}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}

                {viewMode === 'list' && (
                  <IdeaList
                    ideas={filteredIdeas}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}

                {viewMode === 'kanban' && (
                  <KanbanView
                    ideas={filteredIdeas}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}
              </>
            )}
          </AnimatedSection>
        </div>
      </AnimatedPage>

      {/* Onboarding Tour */}
      <OnboardingTour />

      {/* Toast Container */}
      <ToastContainer>
        {toasts.map((toast) => (
          <AnimatedToast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </DashboardLayout>
  );
}
