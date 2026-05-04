import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { sendPurchaseReceipt } from '../services/email.service';
import crypto from 'crypto';

// Definir preços dos planos
const PLAN_PRICES = {
  pro: {
    monthly: 29,
    yearly: 290 // 20% desconto
  },
  max: {
    monthly: 70,
    yearly: 700 // 20% desconto
  },
  enterprise: {
    monthly: 99,
    yearly: 990 // 20% desconto
  }
};

// Definir limites dos planos
const PLAN_LIMITS = {
  pro: {
    ideasLimit: -1, // unlimited
    tokensLimit: 3000000, // 3 milhões
    chatMessagesLimit: -1 // unlimited
  },
  max: {
    ideasLimit: -1, // unlimited
    tokensLimit: 20000000, // 20 milhões
    chatMessagesLimit: -1 // unlimited
  },
  enterprise: {
    ideasLimit: -1,
    tokensLimit: -1, // unlimited
    chatMessagesLimit: -1
  }
};

// POST /api/purchase/checkout - Processar compra de plano
export const processCheckout = async (req: AuthRequest, res: Response) => {
  console.log('🔵 Requisição recebida em /api/purchase/checkout');
  console.log('🔵 Headers:', req.headers);
  console.log('🔵 Body:', req.body);
  
  try {
    const userId = req.userId;
    const { plan, billingCycle, paymentMethod } = req.body;

    console.log('📦 Checkout request:', { userId, plan, billingCycle, paymentMethod });

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Normalizar plano para minúsculo
    const normalizedPlan = plan?.toLowerCase();

    // Validações
    if (!normalizedPlan || !['pro', 'max', 'enterprise'].includes(normalizedPlan)) {
      console.error('❌ Invalid plan:', plan, '(normalized:', normalizedPlan, ')');
      return res.status(400).json({ error: 'Invalid plan', receivedPlan: plan });
    }

    if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
      return res.status(400).json({ error: 'Invalid billing cycle' });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verificar se já tem o plano
    if (user.plan === normalizedPlan) {
      return res.status(400).json({ 
        error: 'You already have this plan',
        message: 'Você já possui este plano'
      });
    }

    // Calcular valores
    const price = PLAN_PRICES[normalizedPlan as keyof typeof PLAN_PRICES][billingCycle as keyof typeof PLAN_PRICES.pro];
    const planName = normalizedPlan === 'pro' ? 'Pro' : normalizedPlan === 'max' ? 'Max' : 'Enterprise';
    
    // Gerar ID de transação único
    const transactionId = `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Calcular datas
    const purchaseDate = new Date();
    const nextBillingDate = new Date();
    if (billingCycle === 'monthly') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    // SIMULAÇÃO: Em produção, aqui você integraria com gateway de pagamento
    // (Stripe, Mercado Pago, etc.)
    
    // Criar registro de compra
    const purchase = await prisma.purchase.create({
      data: {
        userId: userId,
        plan: normalizedPlan,
        planName: planName,
        amount: price,
        billingCycle: billingCycle,
        status: paymentMethod === 'boleto' ? 'pending' : 'completed', // Boleto fica pendente
        transactionId: transactionId,
        paymentMethod: paymentMethod || 'credit_card'
      }
    });

    // Atualizar plano do usuário (exceto se for boleto pendente)
    const limits = PLAN_LIMITS[normalizedPlan as keyof typeof PLAN_LIMITS];
    
    // Se for plano anual, multiplicar tokens por 12
    const tokensLimit = billingCycle === 'yearly' && limits.tokensLimit !== -1
      ? limits.tokensLimit * 12
      : limits.tokensLimit;
    
    if (paymentMethod !== 'boleto') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: normalizedPlan,
          planExpiresAt: nextBillingDate,
          ideasLimit: limits.ideasLimit,
          aiTokensLimit: tokensLimit,
          // Resetar contadores
          aiRequestsCount: 0,
          aiTokensUsed: 0,
          chatMessagesCount: 0,
          ideasCount: 0,
          usageResetAt: new Date()
        }
      });
    }

    // Enviar comprovante por email (exceto boleto)
    let emailSent = false;
    if (paymentMethod !== 'boleto') {
      emailSent = await sendPurchaseReceipt(
        user.email,
        user.name,
        {
          plan: normalizedPlan,
          planName: planName,
          price: price,
          billingCycle: billingCycle,
          transactionId: transactionId,
          purchaseDate: purchaseDate,
          nextBillingDate: nextBillingDate
        }
      );

      if (!emailSent) {
        console.warn('⚠️ Falha ao enviar comprovante por email');
      }
    }

    // Resposta específica por método de pagamento
    const responseData: any = {
      success: true,
      message: 'Purchase completed successfully',
      purchase: {
        id: purchase.id,
        plan: planName,
        amount: price,
        billingCycle: billingCycle,
        transactionId: transactionId,
        nextBillingDate: nextBillingDate,
        paymentMethod: paymentMethod
      },
      emailSent: emailSent
    };

    // Adicionar informações específicas do método
    if (paymentMethod === 'pix') {
      responseData.pix = {
        qrCode: `00020126580014br.gov.bcb.pix0136${transactionId}520400005303986540${price.toFixed(2)}5802BR5925Second Brain6009Sao Paulo62070503***6304`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020126580014br.gov.bcb.pix0136${transactionId}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
      };
    } else if (paymentMethod === 'boleto') {
      responseData.boleto = {
        barcodeNumber: `34191.79001 01043.510047 91020.150008 1 ${Date.now().toString().slice(-14)}`,
        boletoUrl: `https://boleto.example.com/${transactionId}`,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
        status: 'pending'
      };
      responseData.message = 'Boleto gerado com sucesso. Aguardando pagamento.';
    } else if (paymentMethod === 'paypal') {
      responseData.paypal = {
        redirectUrl: `https://www.paypal.com/checkoutnow?token=${transactionId}`,
        orderId: transactionId
      };
    }

    res.json(responseData);

  } catch (error) {
    console.error('Process checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/purchase/history - Buscar histórico de compras do usuário
export const getPurchaseHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const purchases = await prisma.purchase.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      take: 50 // Últimas 50 compras
    });

    res.json({
      purchases: purchases.map(p => ({
        id: p.id,
        plan: p.planName,
        amount: p.amount,
        billingCycle: p.billingCycle,
        status: p.status,
        transactionId: p.transactionId,
        paymentMethod: p.paymentMethod,
        date: p.createdAt
      }))
    });

  } catch (error) {
    console.error('Get purchase history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/purchase/:transactionId - Buscar detalhes de uma compra específica
export const getPurchaseDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { transactionId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const purchase = await prisma.purchase.findFirst({
      where: {
        transactionId: transactionId,
        userId: userId
      }
    });

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.json({
      purchase: {
        id: purchase.id,
        plan: purchase.planName,
        amount: purchase.amount,
        billingCycle: purchase.billingCycle,
        status: purchase.status,
        transactionId: purchase.transactionId,
        paymentMethod: purchase.paymentMethod,
        date: purchase.createdAt
      }
    });

  } catch (error) {
    console.error('Get purchase details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
