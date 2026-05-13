'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2, ArrowLeft, Save, Copy, Check } from 'lucide-react';
import { AnimatedPage } from '@/components/animated/AnimatedPage';
import { MarkdownMessage } from '@/components/MarkdownMessage';
import { API_BASE_URL } from '@/shared/constants/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, LOADING_MESSAGES } from '@/shared/constants/messages';
import { saveIdeaExpansion, extractSuggestions, extractTopics } from '@/utils/idea.utils';
import type { Idea } from '@/types/idea';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const ideaId = params.id as string;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingIdea, setIsLoadingIdea] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasExpandedRef = useRef(false); // Evitar expansão duplicada

  // Carregar ideia e histórico de mensagens
  useEffect(() => {
    loadIdeaAndStartChat();
  }, [ideaId]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focar input após carregar
  useEffect(() => {
    if (!isLoadingIdea && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoadingIdea, isLoading]);

  // Salvar mensagens ao sair da página
  useEffect(() => {
    return () => {
      // Cleanup: salvar mensagens quando componente desmontar
      if (messages.length > 0 && idea) {
        saveMessagesToDatabase(messages);
      }
    };
  }, [messages, idea]);

  const loadIdeaAndStartChat = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Buscar ideia
      const response = await fetch(`${API_BASE_URL}/api/ideas/${ideaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Ideia não encontrada');

      const ideaData = await response.json();
      setIdea(ideaData);

      // Verificar se já existe histórico de mensagens salvo
      if (ideaData.chatMessages && ideaData.chatMessages.length > 0) {
        // Carregar mensagens existentes
        const savedMessages = ideaData.chatMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(savedMessages);
        setIsLoadingIdea(false);
        console.log('✅ Histórico de chat carregado:', savedMessages.length, 'mensagens');
      } else {
        // Primeira vez: criar mensagem inicial e expandir automaticamente
        if (hasExpandedRef.current) {
          // Já expandiu, não fazer novamente
          setIsLoadingIdea(false);
          return;
        }
        
        hasExpandedRef.current = true;
        
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: `Olá! Tenho uma ideia e gostaria da sua ajuda para expandir e desenvolver ela:\n\n**${ideaData.title}**\n\n${ideaData.description}\n\nPode me ajudar a analisar e expandir essa ideia?`,
          timestamp: new Date()
        };

        setMessages([userMessage]);
        setIsLoadingIdea(false);

        // Enviar automaticamente para a IA expandir
        await expandIdeaWithAI(userMessage, ideaData);
      }

    } catch (error) {
      console.error('Erro ao carregar ideia:', error);
      setIsLoadingIdea(false);
    }
  };

  const expandIdeaWithAI = async (userMessage: Message, ideaData: Idea) => {
    // Evitar chamadas duplicadas
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Você é um assistente especializado em expandir e desenvolver ideias. O usuário compartilhou a seguinte ideia:

**Título:** ${ideaData.title}
**Descrição:** ${ideaData.description}

Sua tarefa é:
1. Analisar a ideia de forma profunda e estruturada
2. Fornecer insights valiosos e práticos
3. Sugerir próximos passos concretos
4. Identificar oportunidades e desafios
5. Fazer perguntas relevantes para ajudar o usuário a desenvolver melhor a ideia

Seja proativo, detalhado e útil. Formate sua resposta de forma clara e organizada.`
            },
            {
              role: 'user',
              content: `Olá! Tenho uma ideia e gostaria da sua ajuda para expandir e desenvolver ela:\n\n**${ideaData.title}**\n\n${ideaData.description}\n\nPode me ajudar a analisar e expandir essa ideia?`
            }
          ]
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        // Limite de tokens atingido
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **Limite de tokens atingido!**\n\n${data.message || 'Você atingiu o limite de tokens do seu plano.'}\n\n💡 **Opções:**\n• Faça upgrade do seu plano para continuar\n• Compre créditos adicionais\n• Aguarde o reset mensal\n\n[Clique aqui para ver opções](/buy-credits)`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        
        return;
      }

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || data.expandedContent,
          timestamp: new Date()
        };
        
        // Adicionar apenas a resposta da IA (userMessage já está no estado)
        setMessages(prev => [...prev, assistantMessage]);
        
        // Salvar automaticamente após resposta da IA
        await autoSaveExpansion([userMessage, assistantMessage]);
      } else {
        throw new Error(data.error || 'Erro ao processar mensagem');
      }
    } catch (error) {
      console.error('Erro:', error);
      
      // Mostrar mensagem de erro ao usuário
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Desculpe, não consegui processar sua mensagem. Por favor, tente novamente ou recarregue a página.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
      const token = localStorage.getItem('token');
      
      // Debug: logar mensagens antes de enviar
      const messagesToSend = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));
      
      console.log('📤 Enviando mensagens para backend:', {
        numMessages: messagesToSend.length,
        messages: messagesToSend.map(m => ({
          role: m.role,
          content: m.content.substring(0, 50) + '...'
        }))
      });
      
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: messagesToSend,
          context: idea ? `Ideia: ${idea.title}` : undefined
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        // Limite de tokens atingido
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **Limite de tokens atingido!**\n\n${data.message || 'Você atingiu o limite de tokens do seu plano.'}\n\n💡 **Opções:**\n• Faça upgrade do seu plano para continuar\n• Compre créditos adicionais\n• Aguarde o reset mensal\n\n[Clique aqui para ver opções](/buy-credits)`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        
        return;
      }

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || data.expandedContent,
          timestamp: new Date()
        };
        
        // Adicionar apenas a resposta da IA ao estado
        setMessages(prev => [...prev, assistantMessage]);
        
        // Salvar automaticamente com todas as mensagens atuais
        const allCurrentMessages = [...messages, userMessage, assistantMessage];
        await autoSaveExpansion(allCurrentMessages);
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

  // Função para salvar automaticamente (silenciosamente)
  const autoSaveExpansion = async (messagesToSave: Message[]) => {
    if (!idea) return;

    setAutoSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      // Pegar todas as respostas da IA para expandedContent
      const expansion = messagesToSave
        .filter(m => m.role === 'assistant')
        .map(m => m.content)
        .join('\n\n---\n\n');

      const response = await fetch(`${API_BASE_URL}/api/ideas/${ideaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          expanded: {
            expandedContent: expansion,
            suggestions: extractSuggestions(expansion),
            relatedTopics: extractTopics(expansion)
          },
          chatMessages: messagesToSave // Salvar histórico completo
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
        console.log('✅ Chat salvo automaticamente:', messagesToSave.length, 'mensagens');
      }
    } catch (error) {
      console.error('Erro ao salvar automaticamente:', error);
      // Não mostra erro para o usuário, apenas loga
    } finally {
      setAutoSaving(false);
    }
  };

  // Função auxiliar para salvar mensagens no banco (usada no cleanup)
  const saveMessagesToDatabase = async (messagesToSave: Message[]) => {
    if (!idea) return;

    try {
      const token = localStorage.getItem('token');
      
      const expansion = messagesToSave
        .filter(m => m.role === 'assistant')
        .map(m => m.content)
        .join('\n\n---\n\n');

      await fetch(`${API_BASE_URL}/api/ideas/${ideaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          expanded: {
            expandedContent: expansion,
            suggestions: extractSuggestions(expansion),
            relatedTopics: extractTopics(expansion)
          },
          chatMessages: messagesToSave
        }),
      });

      console.log('✅ Chat salvo ao sair da página');
    } catch (error) {
      console.error('Erro ao salvar ao sair:', error);
    }
  };

  const handleSaveExpansion = async () => {
    if (!idea) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      // Pegar todas as respostas da IA
      const expansion = messages
        .filter(m => m.role === 'assistant')
        .map(m => m.content)
        .join('\n\n---\n\n');

      const response = await fetch(`${API_BASE_URL}/api/ideas/${ideaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          expanded: {
            expandedContent: expansion,
            suggestions: extractSuggestions(expansion),
            relatedTopics: extractTopics(expansion)
          },
          chatMessages: messages // Salvar histórico completo
        }),
      });

      if (response.ok) {
        alert('✅ Expansão salva com sucesso!');
        router.push('/ideas');
      } else {
        throw new Error('Erro ao salvar');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar expansão');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    const allMessages = messages
      .map(m => `${m.role === 'user' ? '👤 Você' : '🤖 IA'}: ${m.content}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(allMessages);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoadingIdea) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-neutral-700/30 border-t-neutral-400 rounded-full mx-auto mb-4"
          />
          <p className="text-neutral-600">Carregando ideia...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-surface">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-10 bg-surface-80 backdrop-blur-xl border-b border-neutral-700/50"
        >
          <div className="max-w-5xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => router.back()}
                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </motion.button>

                <div className="flex items-center gap-3">
                  <div className="bg-surface-2 p-2 rounded-md">
                    <Sparkles className="w-4 h-4 text-on-surface" />
                  </div>
                  <div>
                    <h1 className="text-on-surface font-semibold text-base tracking-tight">
                      {idea?.title || 'Chat com IA'}
                    </h1>
                    <div className="flex items-center gap-2">
                      <p className="text-neutral-400 text-xs">Expandindo sua ideia</p>
                      {autoSaving && (
                        <span className="text-xs text-blue-600 flex items-center gap-1">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full"
                          />
                          Salvando...
                        </span>
                      )}
                      {!autoSaving && lastSaved && (
                        <span className="text-xs text-green-600">
                          ✓ Salvo {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-300 hover:text-on-surface hover:bg-surface-30 rounded-md transition-colors text-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>

                <button
                  onClick={handleSaveExpansion}
                  disabled={isSaving || messages.length < 2}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white rounded-md hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Messages Container */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="space-y-6 mb-32">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-4 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <motion.div
                    className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-neutral-900'
                        : 'bg-neutral-100 border border-neutral-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-neutral-900" />
                    )}
                  </motion.div>

                  {/* Message Content */}
                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <motion.div
                      className={`inline-block max-w-[85%] ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                      whileHover={{ scale: 1.005 }}
                    >
                      <div
                        className={`px-4 py-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-neutral-900 text-white'
                            : 'bg-card border border-neutral-700 text-on-surface'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <MarkdownMessage content={message.content} />
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1.5 px-2">
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-surface-40 border border-neutral-700">
                  <Bot className="w-4 h-4 text-on-surface" />
                </div>
                <div className="bg-card border border-neutral-700 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-3">
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
        </div>

        {/* Input Area - Fixed Bottom */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="fixed bottom-0 left-0 right-0 bg-surface-80 backdrop-blur-xl border-t border-neutral-700/50 p-4"
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    // Auto-resize do textarea
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem ou adicione mais detalhes..."
                  disabled={isLoading}
                  rows={1}
                  className="w-full px-4 py-2.5 bg-card border border-neutral-700 rounded-md text-on-surface placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:border-transparent transition-all disabled:opacity-50 resize-none text-sm"
                  style={{ minHeight: '42px', maxHeight: '120px' }}
                />
              </div>

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
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              <QuickActionButton
                onClick={() => setInput('Como posso melhorar essa ideia?')}
                emoji="💡"
                label="Melhorar"
              />
              <QuickActionButton
                onClick={() => setInput('Quais são os próximos passos práticos?')}
                emoji="🎯"
                label="Próximos passos"
              />
              <QuickActionButton
                onClick={() => setInput('Quais desafios posso enfrentar?')}
                emoji="⚠️"
                label="Desafios"
              />
              <QuickActionButton
                onClick={() => setInput('Como monetizar essa ideia?')}
                emoji="💰"
                label="Monetização"
              />
              <QuickActionButton
                onClick={() => setInput('Quem é o público-alvo?')}
                emoji="👥"
                label="Público"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}

// Quick Action Button Component
function QuickActionButton({ onClick, emoji, label }: { onClick: () => void; emoji: string; label: string }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-surface-30 hover:bg-surface-40 text-neutral-300 text-sm rounded-md transition-colors whitespace-nowrap border border-neutral-700 hover:border-neutral-600"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </motion.button>
  );
}
