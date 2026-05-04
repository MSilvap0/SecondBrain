// Error Messages
export const ERROR_MESSAGES = {
  // Token Limits
  TOKEN_LIMIT: (message?: string) => `⚠️ **Limite de tokens atingido!**\n\n${message || 'Você atingiu o limite de tokens do seu plano.'}\n\n💡 **Opções:**\n• Faça upgrade do seu plano para continuar\n• Compre créditos adicionais\n• Aguarde o reset mensal\n\n[Clique aqui para ver opções](/buy-credits)`,
  
  // Generic Errors
  GENERIC_ERROR: '❌ Desculpe, ocorreu um erro. Por favor, tente novamente.',
  NETWORK_ERROR: '❌ Erro de conexão. Verifique sua internet e tente novamente.',
  CHAT_ERROR: '❌ Desculpe, não consegui processar sua mensagem. Por favor, tente novamente ou recarregue a página.',
  
  // Auth Errors
  UNAUTHORIZED: 'Você precisa estar logado para acessar esta página.',
  INVALID_CREDENTIALS: 'Email ou senha incorretos.',
  
  // Idea Errors
  IDEA_NOT_FOUND: 'Ideia não encontrada.',
  IDEA_SAVE_ERROR: '❌ Erro ao salvar expansão',
  
  // Success Messages
  IDEA_SAVED: '✅ Expansão salva com sucesso!',
  COPIED: 'Copiado!',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  IDEA_SAVED: '✅ Expansão salva com sucesso!',
  COPIED: 'Copiado!',
  EMAIL_SENT: '✅ Email enviado com sucesso!',
  SETTINGS_SAVED: '✅ Configurações salvas!',
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  LOADING_IDEA: 'Carregando ideia...',
  AI_THINKING: 'IA está pensando...',
  SAVING: 'Salvando...',
  PROCESSING: 'Processando...',
} as const;
