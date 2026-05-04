# Sistema de Cards para Ideias

Sistema completo de cards para exibição de ideias com React, Tailwind CSS e animações suaves.

## 📦 Componentes

### 1. IdeaCard
Card individual com hover elegante e expansão de conteúdo.

**Props:**
```typescript
interface IdeaCardProps {
  id: number;
  title: string;              // Título da ideia
  description: string;        // Descrição curta
  expanded?: {                // Conteúdo expandido pela IA
    expandedContent: string;
    suggestions?: string[];
    relatedTopics?: string[];
  };
  isFavorite?: boolean;       // Se está favoritada
  tags?: string[];            // Tags da ideia
  createdAt?: Date;           // Data de criação
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onAIExpand?: (id: number) => void;
}
```

**Exemplo de uso:**
```tsx
import { IdeaCard } from '@/components/IdeaCard';

<IdeaCard
  id={1}
  title="Aplicativo de Meditação"
  description="Um app que ajuda pessoas a meditar com guias personalizados"
  tags={['saúde', 'bem-estar', 'mobile']}
  isFavorite={false}
  createdAt={new Date()}
  onDelete={(id) => console.log('Deletar', id)}
  onToggleFavorite={(id) => console.log('Favoritar', id)}
  onAIExpand={(id) => console.log('Expandir', id)}
/>
```

### 2. IdeaGrid
Grid responsivo para organizar múltiplos cards.

**Props:**
```typescript
interface IdeaGridProps {
  ideas: Idea[];              // Array de ideias
  loading?: boolean;          // Estado de carregamento
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onAIExpand?: (id: number) => void;
  emptyMessage?: string;      // Mensagem quando vazio
  emptyDescription?: string;  // Descrição quando vazio
}
```

**Exemplo de uso:**
```tsx
import { IdeaGrid } from '@/components/IdeaGrid';

const ideas = [
  {
    id: 1,
    title: "App de Receitas",
    description: "Aplicativo para compartilhar receitas",
    tags: ["culinária", "social"],
    isFavorite: false,
    createdAt: new Date()
  },
  // ... mais ideias
];

<IdeaGrid
  ideas={ideas}
  loading={false}
  onDelete={handleDelete}
  onToggleFavorite={handleToggleFavorite}
  onAIExpand={handleAIExpand}
/>
```

### 3. IdeaList
Visualização em lista compacta (alternativa ao grid).

**Props:**
```typescript
interface IdeaListProps {
  ideas: Idea[];
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onAIExpand?: (id: number) => void;
  onSelect?: (id: number) => void;  // Quando clicar no item
}
```

**Exemplo de uso:**
```tsx
import { IdeaList } from '@/components/IdeaList';

<IdeaList
  ideas={ideas}
  onDelete={handleDelete}
  onToggleFavorite={handleToggleFavorite}
  onSelect={(id) => router.push(`/idea/${id}`)}
/>
```

## 🎨 Características

### Design
- ✨ Animações suaves e elegantes
- 🎯 Hover effects com gradientes
- 📱 Totalmente responsivo
- 🌙 Dark mode nativo
- 💫 Efeito de brilho ao passar o mouse

### Funcionalidades
- ⭐ Sistema de favoritos
- 🗑️ Deletar ideias
- 🤖 Expansão com IA
- 🏷️ Sistema de tags
- 📅 Data de criação
- 🔍 Preparado para filtros e ordenação

### Responsividade
- **Mobile:** 1 coluna
- **Tablet:** 2 colunas
- **Desktop:** 3 colunas

## 🚀 Exemplo Completo

```tsx
'use client';

import { useState } from 'react';
import { IdeaGrid } from '@/components/IdeaGrid';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: "E-commerce Sustentável",
      description: "Plataforma para produtos eco-friendly",
      tags: ["sustentabilidade", "e-commerce"],
      isFavorite: false,
      createdAt: new Date(),
      expanded: {
        expandedContent: "Uma plataforma que conecta consumidores...",
        suggestions: [
          "Implementar sistema de pontos verdes",
          "Parceria com ONGs ambientais"
        ],
        relatedTopics: ["economia circular", "carbono neutro"]
      }
    },
    {
      id: 2,
      title: "App de Aprendizado de Idiomas",
      description: "Gamificação para aprender línguas",
      tags: ["educação", "gamificação"],
      isFavorite: true,
      createdAt: new Date()
    }
  ]);

  const handleDelete = (id: number) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const handleToggleFavorite = (id: number) => {
    setIdeas(ideas.map(idea => 
      idea.id === id 
        ? { ...idea, isFavorite: !idea.isFavorite } 
        : idea
    ));
  };

  const handleAIExpand = async (id: number) => {
    // Chamar API para expandir com IA
    const response = await fetch('/api/ai/expand', {
      method: 'POST',
      body: JSON.stringify({ ideaId: id })
    });
    const data = await response.json();
    
    setIdeas(ideas.map(idea => 
      idea.id === id 
        ? { ...idea, expanded: data } 
        : idea
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <IdeaGrid
        ideas={ideas}
        onDelete={handleDelete}
        onToggleFavorite={handleToggleFavorite}
        onAIExpand={handleAIExpand}
      />
    </div>
  );
}
```

## 🎭 Animações Disponíveis

As seguintes classes CSS estão disponíveis:

- `animate-fade-in` - Fade in suave
- `animate-slide-up` - Desliza de baixo para cima
- `animate-scale-in` - Escala de pequeno para normal
- `hover-lift` - Levanta o card no hover
- `glass-effect` - Efeito de vidro fosco

## 🎨 Customização

### Cores
Os cards usam as cores do Tailwind. Para customizar:

```tsx
// Mudar cor do ícone
<div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
  <Lightbulb className="text-emerald-400" />
</div>

// Mudar cor do hover
<div className="hover:border-emerald-500/50">
  {/* conteúdo */}
</div>
```

### Tamanhos
```tsx
// Card compacto
<div className="p-4 rounded-xl">

// Card padrão
<div className="p-6 rounded-2xl">

// Card grande
<div className="p-8 rounded-3xl">
```

## 📱 Acessibilidade

Todos os componentes incluem:
- ✅ Labels ARIA apropriados
- ✅ Navegação por teclado
- ✅ Contraste adequado
- ✅ Estados de foco visíveis
- ✅ Semântica HTML correta

## 🔧 Dependências

```json
{
  "lucide-react": "^1.11.0",
  "react": "^19.2.4",
  "tailwindcss": "^3.4.1"
}
```

## 📝 Notas

- Os componentes são **client-side** (`'use client'`)
- Totalmente **TypeScript**
- **Zero dependências** além do React e Tailwind
- Otimizado para **performance**
- Pronto para **produção**
