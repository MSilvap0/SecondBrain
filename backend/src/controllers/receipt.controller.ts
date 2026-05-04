import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configurar transporter do Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendReceiptEmail = async (req: Request, res: Response) => {
  try {
    const { plan, cycle, paymentMethod } = req.body;
    const userId = (req as any).userId;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Definir preços
    const prices = {
      free: { monthly: 0, yearly: 0 },
      pro: { monthly: 29, yearly: 290 },
      enterprise: { monthly: 99, yearly: 990 },
    };

    const price = prices[plan as keyof typeof prices]?.[cycle as keyof typeof prices.free] || 0;
    const cycleText = cycle === 'monthly' ? 'Mensal' : 'Anual';
    const paymentText = paymentMethod === 'card' ? 'Cartão de Crédito' : paymentMethod === 'pix' ? 'PIX' : 'PayPal';

    // Gerar ID da transação
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Data da compra
    const purchaseDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // HTML do email
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Comprovante de Compra - SecondBrain</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 30px;
          }
          .receipt-number {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
          }
          .receipt-number strong {
            color: #667eea;
            font-size: 18px;
          }
          .details {
            margin-bottom: 20px;
          }
          .details h2 {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-top: 0;
          }
          .details table {
            width: 100%;
            border-collapse: collapse;
          }
          .details td {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
          .details td:last-child {
            text-align: right;
            font-weight: bold;
          }
          .total {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            text-align: right;
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
          }
          .footer {
            background-color: #f0f0f0;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .thank-you {
            text-align: center;
            margin: 20px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 5px;
            border-left: 4px solid #667eea;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Comprovante de Compra</h1>
            <p>SecondBrain - Seu Segundo Cérebro Digital</p>
          </div>
          
          <div class="content">
            <div class="receipt-number">
              <p>Número da Transação:</p>
              <strong>${transactionId}</strong>
            </div>

            <div class="details">
              <h2>Detalhes da Compra</h2>
              <table>
                <tr>
                  <td>Nome do Cliente</td>
                  <td>${user.name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>${user.email}</td>
                </tr>
                <tr>
                  <td>Data da Compra</td>
                  <td>${purchaseDate}</td>
                </tr>
                <tr>
                  <td>Plano Adquirido</td>
                  <td style="text-transform: capitalize;">${plan} (${cycleText})</td>
                </tr>
                <tr>
                  <td>Método de Pagamento</td>
                  <td>${paymentText}</td>
                </tr>
              </table>

              <div class="total">
                Total: R$ ${price.toFixed(2)}
              </div>
            </div>

            <div class="thank-you">
              <h3>Obrigado pela sua compra!</h3>
              <p>Seu plano ${plan} já está ativo e você pode começar a usar o SecondBrain imediatamente.</p>
              <p>Se você tiver alguma dúvida, não hesite em entrar em contato com nosso suporte.</p>
            </div>
          </div>

          <div class="footer">
            <p>Este é um comprovante de compra automático. Por favor, não responda a este email.</p>
            <p>SecondBrain © 2026 - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar email
    await transporter.sendMail({
      from: `"SecondBrain" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: `Comprovante de Compra - Plano ${plan}`,
      html,
    });

    console.log(`Comprovante enviado para ${user.email}`);

    res.json({ 
      success: true, 
      message: 'Comprovante enviado com sucesso',
      transactionId 
    });
  } catch (error) {
    console.error('Erro ao enviar comprovante:', error);
    res.status(500).json({ error: 'Erro ao enviar comprovante' });
  }
};
