'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, X, Maximize2, Minimize2 } from 'lucide-react';
import { AnimatedButton } from './animated/AnimatedButton';
import { API_BASE_URL, API_ENDPOINTS } from '../shared/constants/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  initialIdea?: string;
  onClose?: () => void;
  onSaveExpansion?: (expansion: string) => void;
}

export function AIChat({ initialIdea, onClose, onSaveExpansion }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Inicializar conversa com a ideia inicial
  useEffect(() => {
    if (initialIdea && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Olá! Vi que você tem uma ideia: "${initialIdea}". Vou te ajudar a expandir e desenvolver essa ideia. O que você gostaria de explorar primeiro?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [initialIdea]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focar input ao abrir
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Chamar API de IA
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AI_CHAT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          context: initialIdea
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || data.expandedContent,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Erro ao processar mensagem');
      }
    } catch (error) {
      console.error('Erro:', error);
      
      // Mostrar erro ao usuário
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSave = () => {
    const expansion = messages
      .filter(m => m.role === 'assistant')
      .map(m => m.content)
      .join('\n\n');
    onSaveExpansion?.(expansion);
  };

  return (
    <motion.div
      className={`flex flex-col bg-card border border-neutral-700 rounded-lg shadow-lg overflow-hidden ${
        isExpanded ? 'fixed inset-4 z-50' : 'h-[600px]'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-700 bg-surface-30">
        <div className="flex items-center gap-3">
          <div className="bg-surface-2 p-2 rounded-md">
            <Sparkles className="w-4 h-4 text-on-surface" />
          </div>
          <div>
            <h3 className="text-on-surface font-semibold tracking-tight text-sm">Chat com IA</h3>
            <p className="text-neutral-400 text-xs">Expandindo sua ideia</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </motion.button>

          {onClose && (
            <motion.button
              onClick={onClose}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-neutral-900'
                    : 'bg-neutral-100 border border-neutral-200'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-neutral-900" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex-1 max-w-[80%] ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                  <div
                    className={`inline-block px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-card text-on-surface border border-neutral-700'
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <p className="text-xs text-neutral-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-surface-40 border border-neutral-700">
              <Bot className="w-4 h-4 text-neutral-900" />
            </div>
            <div className="bg-card border border-neutral-700 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-4 h-4 text-neutral-900" />
                </motion.div>
                <span className="text-sm text-neutral-600">IA está pensando...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-neutral-700 bg-surface-30">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-card border border-neutral-700 rounded-md text-on-surface placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:border-transparent transition-all disabled:opacity-50 text-sm"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-accent text-white rounded-md hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            <button
              onClick={() => setInput('Como posso melhorar essa ideia?')}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs rounded-md transition-colors border border-neutral-200"
            >
              💡 Melhorar
            </button>
            <button
              onClick={() => setInput('Quais são os próximos passos?')}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs rounded-md transition-colors border border-neutral-200"
            >
              🎯 Próximos passos
            </button>
            <button
              onClick={() => setInput('Quais são os desafios?')}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs rounded-md transition-colors border border-neutral-200"
            >
              ⚠️ Desafios
            </button>
          </div>

          {messages.length > 1 && (
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors text-xs font-medium"
            >
              Salvar expansão
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Função para gerar resposta mock (fallback)
function generateMockResponse(userInput: string, context?: string): string {
  const input = userInput.toLowerCase();

  if (input.includes('melhorar') || input.includes('aprimorar')) {
    return `Ótima pergunta! Para melhorar "${context}", considere:

1. **Validação de Mercado**: Pesquise se há demanda real para essa solução
2. **Diferenciação**: O que torna sua ideia única?
3. **MVP**: Comece com uma versão mínima viável
4. **Feedback**: Teste com usuários reais o quanto antes

O que você acha dessas sugestões? Quer explorar alguma delas mais a fundo?`;
  }

  if (input.includes('próximos passos') || input.includes('começar')) {
    return `Excelente! Vamos criar um plano de ação para "${context}":

**Fase 1 - Planejamento (1-2 semanas)**
- Definir escopo e objetivos
- Pesquisar concorrentes
- Validar hipóteses

**Fase 2 - Prototipagem (2-4 semanas)**
- Criar wireframes
- Desenvolver MVP
- Testar com beta users

**Fase 3 - Lançamento (1-2 semanas)**
- Ajustes finais
- Marketing inicial
- Coletar feedback

Por onde você gostaria de começar?`;
  }

  if (input.includes('desafio') || input.includes('problema') || input.includes('dificuldade')) {
    return `Boa observação! Vamos antecipar os desafios de "${context}":

🚧 **Desafios Técnicos:**
- Escalabilidade da solução
- Integração com sistemas existentes
- Segurança e privacidade de dados

💰 **Desafios de Negócio:**
- Modelo de monetização
- Aquisição de usuários
- Competição no mercado

👥 **Desafios de Equipe:**
- Encontrar talentos certos
- Manter motivação
- Gestão de recursos

Qual desses desafios te preocupa mais?`;
  }

  if (input.includes('monetizar') || input.includes('ganhar dinheiro') || input.includes('receita')) {
    return `Vamos explorar modelos de monetização para "${context}":

💳 **Modelos Possíveis:**
1. **Freemium**: Versão gratuita + recursos premium
2. **Assinatura**: Pagamento mensal/anual
3. **Marketplace**: Comissão sobre transações
4. **Publicidade**: Anúncios direcionados
5. **Licenciamento**: Venda para empresas

Qual modelo faz mais sentido para sua ideia?`;
  }

  // Resposta genérica
  return `Interessante! Sobre "${context}", aqui estão alguns insights:

✨ **Pontos Fortes:**
- Resolve um problema real
- Tem potencial de escala
- Pode gerar impacto positivo

🎯 **Oportunidades:**
- Explorar nichos específicos
- Criar parcerias estratégicas
- Inovar na experiência do usuário

📊 **Próximas Análises:**
- Tamanho do mercado
- Viabilidade técnica
- Recursos necessários

O que mais você gostaria de explorar sobre essa ideia?`;
}
