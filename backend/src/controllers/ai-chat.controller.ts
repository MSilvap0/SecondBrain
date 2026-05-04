import { Response } from 'express';
import { AuthRequest } from '../types';
import Groq from 'groq-sdk';
import { prisma } from '../config/database';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Definir limites por plano
const PLAN_LIMITS = {
  free: {
    tokensLimit: 100000
  },
  pro: {
    tokensLimit: 3000000 // 3 milhões
  },
  max: {
    tokensLimit: 20000000 // 20 milhões
  },
  enterprise: {
    tokensLimit: -1 // ilimitado
  }
};

// Função auxiliar para verificar limite de tokens
async function checkTokenLimit(userId: string): Promise<{ allowed: boolean; message?: string; remaining?: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      aiTokensUsed: true,
      aiTokensLimit: true
    }
  });

  if (!user) {
    return { allowed: false, message: 'User not found' };
  }

  // Pegar limite do plano atual
  const planLimits = PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
  const planTokensLimit = planLimits.tokensLimit;

  // Se usuário comprou créditos extras, usar o maior valor
  const effectiveLimit = user.aiTokensLimit > planTokensLimit ? user.aiTokensLimit : planTokensLimit;

  // Se o limite for -1 (ilimitado), sempre permitir
  if (effectiveLimit === -1) {
    return { allowed: true, remaining: -1 };
  }

  // Verificar se atingiu o limite
  if (user.aiTokensUsed >= effectiveLimit) {
    return { 
      allowed: false, 
      message: `Limite de tokens atingido! Você usou ${user.aiTokensUsed.toLocaleString()} de ${effectiveLimit.toLocaleString()} tokens. Faça upgrade do seu plano ou compre mais créditos.`,
      remaining: 0
    };
  }

  const remaining = effectiveLimit - user.aiTokensUsed;
  return { allowed: true, remaining };
}

// Função auxiliar para rastrear uso de tokens
async function trackTokenUsage(userId: string, tokensUsed: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      aiTokensUsed: { increment: tokensUsed },
      aiRequestsCount: { increment: 1 },
      chatMessagesCount: { increment: 1 }
    }
  });

  console.log(`📊 Tokens rastreados (chat): ${tokensUsed} tokens para usuário ${userId}`);
}

export const chatWithAI = async (req: AuthRequest, res: Response) => {
  try {
    const { messages, context } = req.body;
    const userId = req.userId;

    console.log('📨 Recebendo requisição de chat:', {
      numMessages: messages?.length,
      context: context?.substring(0, 50),
      userId
    });

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verificar limite de tokens
    const limitCheck = await checkTokenLimit(userId);
    if (!limitCheck.allowed) {
      return res.status(429).json({ 
        error: 'Token limit exceeded',
        message: limitCheck.message,
        remaining: 0
      });
    }

    // Criar mensagem de sistema com contexto
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `Você é um assistente de IA amigável e prestativo, especializado em expandir e desenvolver ideias criativas. 

Seu objetivo é:
- Responder de forma natural e conversacional a QUALQUER mensagem do usuário
- Ser amigável e acolhedor, respondendo até saudações simples como "oi", "olá", "tudo bem?"
- Ajudar a explorar diferentes aspectos de ideias
- Identificar oportunidades e desafios
- Sugerir próximos passos práticos
- Fazer perguntas relevantes para aprofundar ideias

${context ? `Contexto da ideia atual: ${context}` : 'Pronto para conversar sobre qualquer assunto!'}

FORMATAÇÃO DAS RESPOSTAS:
- Use Markdown para formatar suas respostas
- Para código, use blocos com \`\`\`linguagem
- Use **negrito** para destacar pontos importantes
- Use listas com • ou - para organizar informações
- Use ## para títulos de seções
- Use \`código inline\` para termos técnicos

IMPORTANTE: 
- Responda SEMPRE, mesmo para mensagens curtas ou simples
- Seja caloroso e acolhedor em saudações
- Mantenha um tom conversacional e amigável
- Se o usuário fizer uma pergunta simples, responda de forma direta e útil
- Adapte seu nível de detalhe ao tipo de pergunta
- Quando mostrar código, SEMPRE use blocos de código com a linguagem especificada`
    };

    // Preparar mensagens para a API
    const apiMessages = [
      systemMessage,
      ...messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Chamar API do Groq
    const completion = await groq.chat.completions.create({
      messages: apiMessages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      stream: false
    });

    const aiMessage = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

    // Rastrear tokens usados (usar dados reais da API se disponível)
    const tokensUsed = completion.usage?.total_tokens || 0;
    
    if (tokensUsed > 0) {
      await trackTokenUsage(userId, tokensUsed);
    }

    console.log('✅ Resposta da IA gerada:', aiMessage.substring(0, 100) + '...');
    console.log('📊 Tokens usados:', tokensUsed);

    res.json({
      message: aiMessage,
      usage: {
        ...completion.usage,
        remaining: limitCheck.remaining === -1 ? -1 : limitCheck.remaining - tokensUsed
      }
    });

  } catch (error: any) {
    console.error('Erro no chat com IA:', error);
    
    res.status(500).json({
      error: 'Erro ao processar mensagem com a IA',
      details: error.message
    });
  }
};
