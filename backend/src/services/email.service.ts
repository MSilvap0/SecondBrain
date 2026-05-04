import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Inicializar Resend se a API key estiver configurada
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Lista de domínios de email descartáveis/temporários
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
  'yopmail.com', 'maildrop.cc', 'getnada.com', 'tempr.email',
  'sharklasers.com', 'guerrillamail.info', 'grr.la', 'guerrillamail.biz',
  'guerrillamail.de', 'spam4.me', 'mailnesia.com', 'mytemp.email'
];

// Configurar transporter do Nodemailer
// Para desenvolvimento, use um serviço como Mailtrap, SendGrid, ou Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verificar se o email é descartável
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}

// Validar formato de email
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Gerar código de verificação de 6 dígitos
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Enviar email de verificação
export async function sendVerificationEmail(
  email: string,
  name: string,
  code: string
): Promise<boolean> {
  try {
    // HTML do email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fafafa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #000000 0%, #262626 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">
                      Second Brain
                    </h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 16px; font-weight: 300;">
                      Organize suas ideias com IA
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px 0; color: #171717; font-size: 24px; font-weight: 600; letter-spacing: -0.02em;">
                      Olá, ${name}! 👋
                    </h2>
                    
                    <p style="margin: 0 0 24px 0; color: #525252; font-size: 16px; line-height: 1.6; font-weight: 300;">
                      Obrigado por se cadastrar no Second Brain! Para completar seu cadastro e começar a organizar suas ideias, por favor verifique seu email usando o código abaixo:
                    </p>
                    
                    <!-- Verification Code -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                      <tr>
                        <td align="center" style="background-color: #fafafa; border: 2px solid #e5e5e5; border-radius: 12px; padding: 24px;">
                          <p style="margin: 0 0 8px 0; color: #737373; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
                            Seu código de verificação
                          </p>
                          <p style="margin: 0; color: #000000; font-size: 36px; font-weight: 700; letter-spacing: 0.1em; font-variant-numeric: tabular-nums;">
                            ${code}
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 24px 0 0 0; color: #737373; font-size: 14px; line-height: 1.6; font-weight: 300;">
                      Este código expira em <strong style="color: #171717; font-weight: 500;">15 minutos</strong>. Se você não solicitou este código, pode ignorar este email com segurança.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; padding: 32px; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 8px 0; color: #737373; font-size: 14px; font-weight: 300;">
                      Precisa de ajuda? Entre em contato conosco
                    </p>
                    <p style="margin: 0; color: #171717; font-size: 14px; font-weight: 500;">
                      suporte@secondbrain.com
                    </p>
                    
                    <p style="margin: 24px 0 0 0; color: #a3a3a3; font-size: 12px; font-weight: 300;">
                      © 2026 Second Brain. Todos os direitos reservados.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const textContent = `
Olá, ${name}!

Obrigado por se cadastrar no Second Brain!

Seu código de verificação é: ${code}

Este código expira em 15 minutos.

Se você não solicitou este código, pode ignorar este email.

---
Second Brain - Organize suas ideias com IA
    `.trim();

    // PRIORIDADE 1: Usar Gmail SMTP se configurado
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log('📧 Enviando email via Gmail SMTP...');
      
      const mailOptions = {
        from: `"Second Brain" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verifique seu email - Second Brain',
        html: htmlContent,
        text: textContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado via Gmail para ${email}`);
      return true;
    }

    // PRIORIDADE 2: Usar Resend como fallback
    if (resend) {
      console.log('📧 Enviando email via Resend...');
      
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Second Brain <onboarding@resend.dev>';
      
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Verifique seu email - Second Brain',
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error('❌ Erro ao enviar via Resend:', error);
        return false;
      }

      console.log(`✅ Email enviado via Resend para ${email}`);
      console.log(`📬 ID do email: ${data?.id}`);
      return true;
    }

    // Fallback: Modo desenvolvimento (console)
    console.log('\n=================================');
    console.log('📧 EMAIL DE VERIFICAÇÃO (DEV MODE)');
    console.log('=================================');
    console.log(`Para: ${email}`);
    console.log(`Nome: ${name}`);
    console.log(`Código: ${code}`);
    console.log('=================================\n');
    return true;

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
}

// Verificar configuração do email
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    // Verificar Resend
    if (process.env.RESEND_API_KEY) {
      console.log('✅ Resend configurado - emails serão enviados via Resend');
      return true;
    }

    // Verificar SMTP
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.verify();
      console.log('✅ SMTP configurado - emails serão enviados via SMTP');
      return true;
    }

    // Modo desenvolvimento
    console.log('⚠️  Email não configurado - usando modo desenvolvimento (códigos no console)');
    return true;
  } catch (error) {
    console.error('❌ Erro na configuração de email:', error);
    return false;
  }
}

// Enviar email de reset de senha
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
): Promise<boolean> {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // HTML do email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinir Senha</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fafafa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">
                      🔐 Redefinir Senha
                    </h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 300;">
                      Second Brain
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px 0; color: #171717; font-size: 24px; font-weight: 600; letter-spacing: -0.02em;">
                      Olá, ${name}! 👋
                    </h2>
                    
                    <p style="margin: 0 0 24px 0; color: #525252; font-size: 16px; line-height: 1.6; font-weight: 300;">
                      Recebemos uma solicitação para redefinir a senha da sua conta no Second Brain. Se você não fez essa solicitação, pode ignorar este email com segurança.
                    </p>
                    
                    <p style="margin: 0 0 32px 0; color: #525252; font-size: 16px; line-height: 1.6; font-weight: 300;">
                      Para redefinir sua senha, clique no botão abaixo:
                    </p>
                    
                    <!-- Reset Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 32px 0;">
                      <tr>
                        <td align="center">
                          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                            Redefinir Minha Senha
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 0 0 16px 0; color: #737373; font-size: 14px; line-height: 1.6; font-weight: 300;">
                      Ou copie e cole este link no seu navegador:
                    </p>
                    
                    <p style="margin: 0 0 24px 0; padding: 16px; background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; color: #6366f1; font-size: 13px; word-break: break-all; font-family: 'Courier New', monospace;">
                      ${resetUrl}
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0 0 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                      <tr>
                        <td>
                          <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6; font-weight: 500;">
                            ⚠️ <strong>Importante:</strong> Este link expira em <strong>1 hora</strong>. Se você não solicitou a redefinição de senha, ignore este email e sua senha permanecerá inalterada.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; padding: 32px; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 8px 0; color: #737373; font-size: 14px; font-weight: 300;">
                      Precisa de ajuda? Entre em contato conosco
                    </p>
                    <p style="margin: 0; color: #171717; font-size: 14px; font-weight: 500;">
                      suporte@secondbrain.com
                    </p>
                    
                    <p style="margin: 24px 0 0 0; color: #a3a3a3; font-size: 12px; font-weight: 300;">
                      © 2026 Second Brain. Todos os direitos reservados.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const textContent = `
Olá, ${name}!

Recebemos uma solicitação para redefinir a senha da sua conta no Second Brain.

Para redefinir sua senha, acesse o link abaixo:
${resetUrl}

Este link expira em 1 hora.

Se você não solicitou a redefinição de senha, ignore este email e sua senha permanecerá inalterada.

---
Second Brain - Organize suas ideias com IA
    `.trim();

    // PRIORIDADE 1: Usar Gmail SMTP se configurado
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log('📧 Enviando email de reset via Gmail SMTP...');
      
      const mailOptions = {
        from: `"Second Brain" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Redefinir sua senha - Second Brain',
        html: htmlContent,
        text: textContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email de reset enviado via Gmail para ${email}`);
      return true;
    }

    // PRIORIDADE 2: Usar Resend como fallback
    if (resend) {
      console.log('📧 Enviando email de reset via Resend...');
      
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Second Brain <onboarding@resend.dev>';
      
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Redefinir sua senha - Second Brain',
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error('❌ Erro ao enviar via Resend:', error);
        return false;
      }

      console.log(`✅ Email de reset enviado via Resend para ${email}`);
      console.log(`📬 ID do email: ${data?.id}`);
      return true;
    }

    // Fallback: Modo desenvolvimento (console)
    console.log('\n=================================');
    console.log('📧 EMAIL DE RESET DE SENHA (DEV MODE)');
    console.log('=================================');
    console.log(`Para: ${email}`);
    console.log(`Nome: ${name}`);
    console.log(`Link: ${resetUrl}`);
    console.log('=================================\n');
    return true;

  } catch (error) {
    console.error('❌ Erro ao enviar email de reset:', error);
    return false;
  }
}


// Enviar comprovante de compra
export async function sendPurchaseReceipt(
  email: string,
  name: string,
  purchaseData: {
    plan: string;
    planName: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    transactionId: string;
    purchaseDate: Date;
    nextBillingDate: Date;
  }
): Promise<boolean> {
  try {
    const { plan, planName, price, billingCycle, transactionId, purchaseDate, nextBillingDate } = purchaseData;
    
    const cycleText = billingCycle === 'monthly' ? 'Mensal' : 'Anual';
    const totalPrice = price; // O preço já vem correto do controller

    // HTML do email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Comprovante de Compra</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fafafa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
                      <tr>
                        <td style="width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; text-align: center; vertical-align: middle;">
                          <span style="font-size: 32px; line-height: 64px; color: #ffffff;">✓</span>
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">
                      Compra Confirmada!
                    </h1>
                    <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 300;">
                      Obrigado pela sua assinatura
                    </p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 16px 0; color: #171717; font-size: 24px; font-weight: 600; letter-spacing: -0.02em;">
                      Olá, ${name}! 🎉
                    </h2>
                    
                    <p style="margin: 0 0 24px 0; color: #525252; font-size: 16px; line-height: 1.6; font-weight: 300;">
                      Sua assinatura do plano <strong style="color: #171717;">${planName}</strong> foi confirmada com sucesso! Abaixo estão os detalhes da sua compra:
                    </p>
                    
                    <!-- Purchase Details -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0; background-color: #fafafa; border-radius: 12px; overflow: hidden;">
                      <tr>
                        <td style="padding: 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                                <p style="margin: 0; color: #737373; font-size: 14px;">Plano</p>
                                <p style="margin: 4px 0 0 0; color: #171717; font-size: 16px; font-weight: 600;">${planName} - ${cycleText}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                                <p style="margin: 0; color: #737373; font-size: 14px;">Valor</p>
                                <p style="margin: 4px 0 0 0; color: #171717; font-size: 16px; font-weight: 600;">R$ ${totalPrice.toFixed(2)}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                                <p style="margin: 0; color: #737373; font-size: 14px;">Data da Compra</p>
                                <p style="margin: 4px 0 0 0; color: #171717; font-size: 16px; font-weight: 600;">${purchaseDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
                                <p style="margin: 0; color: #737373; font-size: 14px;">Próxima Cobrança</p>
                                <p style="margin: 4px 0 0 0; color: #171717; font-size: 16px; font-weight: 600;">${nextBillingDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 12px 0;">
                                <p style="margin: 0; color: #737373; font-size: 14px;">ID da Transação</p>
                                <p style="margin: 4px 0 0 0; color: #171717; font-size: 14px; font-family: 'Courier New', monospace;">${transactionId}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Features -->
                    <div style="margin: 32px 0;">
                      <h3 style="margin: 0 0 16px 0; color: #171717; font-size: 18px; font-weight: 600;">
                        O que está incluído:
                      </h3>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        ${plan === 'pro' ? `
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Ideias ilimitadas</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">3 milhões de tokens de IA por mês</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Chat ilimitado com IA</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Exportar em PDF/Markdown</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Suporte prioritário</span>
                          </td>
                        </tr>
                        ` : plan === 'max' ? `
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Tudo do plano Pro</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">20 milhões de tokens de IA por mês</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Prioridade máxima na IA</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Modelos avançados</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Suporte VIP</span>
                          </td>
                        </tr>
                        ` : `
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Tudo do plano Max</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Tokens de IA ilimitados</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Equipes ilimitadas</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">API personalizada</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">SSO (Single Sign-On)</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span style="color: #10b981; margin-right: 8px;">✓</span>
                            <span style="color: #525252; font-size: 15px;">Suporte 24/7 dedicado</span>
                          </td>
                        </tr>
                        `}
                      </table>
                    </div>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                      <tr>
                        <td align="center">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                            Acessar Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0 0 0; padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
                      <tr>
                        <td>
                          <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                            <strong>💡 Dica:</strong> Você pode gerenciar sua assinatura, visualizar faturas e atualizar seu plano a qualquer momento nas configurações da sua conta.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; padding: 32px; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 8px 0; color: #737373; font-size: 14px; font-weight: 300;">
                      Precisa de ajuda? Entre em contato conosco
                    </p>
                    <p style="margin: 0; color: #171717; font-size: 14px; font-weight: 500;">
                      suporte@secondbrain.com
                    </p>
                    
                    <p style="margin: 24px 0 0 0; color: #a3a3a3; font-size: 12px; font-weight: 300;">
                      © 2026 Second Brain. Todos os direitos reservados.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const textContent = `
Olá, ${name}!

Sua assinatura do plano ${planName} foi confirmada com sucesso!

DETALHES DA COMPRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plano: ${planName} - ${cycleText}
Valor: R$ ${totalPrice.toFixed(2)}
Data da Compra: ${purchaseDate.toLocaleDateString('pt-BR')}
Próxima Cobrança: ${nextBillingDate.toLocaleDateString('pt-BR')}
ID da Transação: ${transactionId}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Acesse seu dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard

---
Second Brain - Organize suas ideias com IA
    `.trim();

    // PRIORIDADE 1: Usar Gmail SMTP se configurado
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log('📧 Enviando comprovante via Gmail SMTP...');
      
      const mailOptions = {
        from: `"Second Brain" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Comprovante de Compra - Plano ${planName}`,
        html: htmlContent,
        text: textContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Comprovante enviado via Gmail para ${email}`);
      return true;
    }

    // PRIORIDADE 2: Usar Resend como fallback
    if (resend) {
      console.log('📧 Enviando comprovante via Resend...');
      
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Second Brain <onboarding@resend.dev>';
      
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Comprovante de Compra - Plano ${planName}`,
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error('❌ Erro ao enviar via Resend:', error);
        return false;
      }

      console.log(`✅ Comprovante enviado via Resend para ${email}`);
      console.log(`📬 ID do email: ${data?.id}`);
      return true;
    }

    // Fallback: Modo desenvolvimento (console)
    console.log('\n=================================');
    console.log('📧 COMPROVANTE DE COMPRA (DEV MODE)');
    console.log('=================================');
    console.log(`Para: ${email}`);
    console.log(`Nome: ${name}`);
    console.log(`Plano: ${planName}`);
    console.log(`Valor: R$ ${totalPrice.toFixed(2)}`);
    console.log(`ID: ${transactionId}`);
    console.log('=================================\n');
    return true;

  } catch (error) {
    console.error('❌ Erro ao enviar comprovante:', error);
    return false;
  }
}
