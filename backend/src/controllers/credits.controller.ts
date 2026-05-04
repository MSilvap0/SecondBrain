import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { sendPurchaseReceipt } from '../services/email.service';
import crypto from 'crypto';

// Pacotes de créditos disponíveis
const CREDIT_PACKAGES = {
  small: {
    name: 'Pacote Pequeno',
    tokens: 1000000, // 1 milhão
    price: 10
  },
  medium: {
    name: 'Pacote Médio',
    tokens: 5000000, // 5 milhões
    price: 40
  },
  large: {
    name: 'Pacote Grande',
    tokens: 10000000, // 10 milhões
    price: 70
  },
  xlarge: {
    name: 'Pacote Extra Grande',
    tokens: 50000000, // 50 milhões
    price: 300
  },
  mega: {
    name: 'Pacote Mega',
    tokens: 100000000, // 100 milhões
    price: 500
  }
};

const MAX_TOKENS = 1000000000; // 1 bilhão

// POST /api/credits/purchase - Comprar créditos adicionais
export const purchaseCredits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { package: packageId, paymentMethod } = req.body;

    console.log('💳 Compra de créditos:', { userId, packageId, paymentMethod });

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validar pacote
    if (!packageId || !CREDIT_PACKAGES[packageId as keyof typeof CREDIT_PACKAGES]) {
      return res.status(400).json({ error: 'Invalid package' });
    }

    const creditPackage = CREDIT_PACKAGES[packageId as keyof typeof CREDIT_PACKAGES];

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        aiTokensLimit: true,
        aiTokensUsed: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verificar se não vai ultrapassar 1 bilhão
    const currentTokens = user.aiTokensLimit === -1 ? 0 : user.aiTokensLimit;
    const newTotalTokens = currentTokens + creditPackage.tokens;

    if (newTotalTokens > MAX_TOKENS) {
      return res.status(400).json({ 
        error: 'Token limit exceeded',
        message: `Você atingiria ${newTotalTokens.toLocaleString()} tokens. O limite máximo é ${MAX_TOKENS.toLocaleString()} tokens.`,
        maxTokens: MAX_TOKENS,
        currentTokens: currentTokens
      });
    }

    // Gerar ID de transação
    const transactionId = `CRD-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Criar registro de compra
    const purchase = await prisma.purchase.create({
      data: {
        userId: userId,
        plan: 'credits',
        planName: creditPackage.name,
        amount: creditPackage.price,
        billingCycle: 'one_time',
        status: paymentMethod === 'boleto' ? 'pending' : 'completed',
        transactionId: transactionId,
        paymentMethod: paymentMethod || 'credit_card'
      }
    });

    // Atualizar tokens do usuário (exceto se for boleto pendente)
    if (paymentMethod !== 'boleto') {
      const updatedTokensLimit = user.aiTokensLimit === -1 
        ? creditPackage.tokens 
        : user.aiTokensLimit + creditPackage.tokens;

      await prisma.user.update({
        where: { id: userId },
        data: {
          aiTokensLimit: updatedTokensLimit
        }
      });

      console.log(`✅ Créditos adicionados: ${creditPackage.tokens.toLocaleString()} tokens`);
      console.log(`📊 Total de tokens: ${updatedTokensLimit.toLocaleString()}`);
    }

    // Enviar comprovante por email (exceto boleto)
    let emailSent = false;
    if (paymentMethod !== 'boleto') {
      emailSent = await sendPurchaseReceipt(
        user.email,
        user.name,
        {
          plan: 'credits',
          planName: creditPackage.name,
          price: creditPackage.price,
          billingCycle: 'monthly', // Não importa para créditos
          transactionId: transactionId,
          purchaseDate: new Date(),
          nextBillingDate: new Date() // Não importa para créditos
        }
      );
    }

    // Resposta
    const responseData: any = {
      success: true,
      message: 'Credits purchased successfully',
      purchase: {
        id: purchase.id,
        package: creditPackage.name,
        tokens: creditPackage.tokens,
        amount: creditPackage.price,
        transactionId: transactionId,
        paymentMethod: paymentMethod
      },
      newTokensLimit: user.aiTokensLimit === -1 
        ? creditPackage.tokens 
        : user.aiTokensLimit + creditPackage.tokens,
      emailSent: emailSent
    };

    // Adicionar informações específicas do método
    if (paymentMethod === 'pix') {
      responseData.pix = {
        qrCode: `00020126580014br.gov.bcb.pix0136${transactionId}520400005303986540${creditPackage.price.toFixed(2)}5802BR5925Second Brain6009Sao Paulo62070503***6304`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020126580014br.gov.bcb.pix0136${transactionId}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000)
      };
    } else if (paymentMethod === 'boleto') {
      responseData.boleto = {
        barcodeNumber: `34191.79001 01043.510047 91020.150008 1 ${Date.now().toString().slice(-14)}`,
        boletoUrl: `https://boleto.example.com/${transactionId}`,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
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
    console.error('Purchase credits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/credits/packages - Listar pacotes disponíveis
export const getCreditPackages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Buscar tokens atuais do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        aiTokensLimit: true,
        aiTokensUsed: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentTokens = user.aiTokensLimit === -1 ? 0 : user.aiTokensLimit;
    const remainingTokens = user.aiTokensLimit === -1 ? Infinity : user.aiTokensLimit - user.aiTokensUsed;

    // Mapear pacotes com informações adicionais
    const packages = Object.entries(CREDIT_PACKAGES).map(([id, pkg]) => ({
      id,
      name: pkg.name,
      tokens: pkg.tokens,
      price: pkg.price,
      pricePerMillion: (pkg.price / (pkg.tokens / 1000000)).toFixed(2),
      canPurchase: currentTokens + pkg.tokens <= MAX_TOKENS
    }));

    res.json({
      packages,
      currentTokens,
      remainingTokens,
      maxTokens: MAX_TOKENS,
      tokensUsed: user.aiTokensUsed
    });

  } catch (error) {
    console.error('Get credit packages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
