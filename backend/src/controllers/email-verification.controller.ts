import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  isDisposableEmail,
  isValidEmailFormat,
  generateVerificationCode,
  sendVerificationEmail,
} from '../services/email.service';

const prisma = new PrismaClient();

// Verificar se email é válido (não descartável)
export async function checkEmail(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    // Validar formato
    if (!isValidEmailFormat(email)) {
      return res.status(400).json({
        valid: false,
        error: 'Formato de email inválido',
      });
    }

    // Verificar se é email descartável
    if (isDisposableEmail(email)) {
      return res.status(400).json({
        valid: false,
        error: 'Emails temporários ou descartáveis não são permitidos',
        disposable: true,
      });
    }

    // Verificar se email já está cadastrado (usuário completo)
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({
        valid: false,
        error: 'Este email já está cadastrado',
        exists: true,
      });
    }

    return res.json({
      valid: true,
      message: 'Email válido',
    });
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    return res.status(500).json({ error: 'Erro ao verificar email' });
  }
}

// Enviar código de verificação
export async function sendVerificationCode(req: Request, res: Response) {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email e nome são obrigatórios' });
    }

    // Validações
    if (!isValidEmailFormat(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    if (isDisposableEmail(email)) {
      return res.status(400).json({
        error: 'Emails temporários ou descartáveis não são permitidos',
      });
    }

    // Verificar se já existe usuário COMPLETO com este email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Este email já está cadastrado' });
    }

    // Gerar código
    const code = generateVerificationCode();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15); // Expira em 15 minutos

    // Criar ou atualizar verificação PENDENTE (não cria usuário ainda!)
    await prisma.pendingVerification.upsert({
      where: { email: email.toLowerCase() },
      update: {
        name: name,
        verificationCode: code,
        verificationExpiry: expiry,
      },
      create: {
        email: email.toLowerCase(),
        name: name,
        verificationCode: code,
        verificationExpiry: expiry,
      },
    });

    // Enviar email
    const emailSent = await sendVerificationEmail(email, name, code);

    if (!emailSent) {
      return res.status(500).json({
        error: 'Erro ao enviar email de verificação',
      });
    }

    // Em desenvolvimento, retornar o código (REMOVER EM PRODUÇÃO!)
    const response: any = {
      success: true,
      message: 'Código de verificação enviado',
      expiresIn: 15, // minutos
    };

    // Se estiver em desenvolvimento e sem SMTP/Resend configurado, incluir o código
    if (!process.env.RESEND_API_KEY && !process.env.SMTP_USER) {
      response.code = code; // APENAS PARA DESENVOLVIMENTO!
    }

    return res.json(response);
  } catch (error) {
    console.error('Erro ao enviar código:', error);
    return res.status(500).json({ error: 'Erro ao enviar código de verificação' });
  }
}

// Verificar código
export async function verifyCode(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email e código são obrigatórios' });
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      return res.status(400).json({
        valid: false,
        error: 'Código inválido',
      });
    }

    // Buscar verificação pendente
    const pending = await prisma.pendingVerification.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!pending) {
      return res.status(400).json({
        valid: false,
        error: 'Verificação não encontrada. Solicite um novo código.',
      });
    }

    // Verificar código
    if (pending.verificationCode !== code) {
      return res.status(400).json({
        valid: false,
        error: 'Código incorreto',
      });
    }

    // Verificar expiração
    if (pending.verificationExpiry < new Date()) {
      return res.status(400).json({
        valid: false,
        error: 'Código expirado. Solicite um novo código.',
      });
    }

    // Código válido! Não remove a verificação pendente ainda
    // Ela será removida quando o usuário completar o registro

    return res.json({
      valid: true,
      message: 'Código verificado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao verificar código:', error);
    return res.status(500).json({ error: 'Erro ao verificar código' });
  }
}

// Reenviar código
export async function resendCode(req: Request, res: Response) {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email e nome são obrigatórios' });
    }

    // Buscar verificação pendente
    const pending = await prisma.pendingVerification.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!pending) {
      return res.status(400).json({ error: 'Verificação não encontrada' });
    }

    // Gerar novo código
    const code = generateVerificationCode();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);

    // Atualizar código
    await prisma.pendingVerification.update({
      where: { email: email.toLowerCase() },
      data: {
        verificationCode: code,
        verificationExpiry: expiry,
      },
    });
    
    // Enviar email
    const emailSent = await sendVerificationEmail(email, name, code);

    if (!emailSent) {
      return res.status(500).json({
        error: 'Erro ao reenviar código',
      });
    }

    const response: any = {
      success: true,
      message: 'Código reenviado com sucesso',
    };

    // Em desenvolvimento, incluir o código
    if (!process.env.RESEND_API_KEY && !process.env.SMTP_USER) {
      response.code = code;
    }

    return res.json(response);
  } catch (error) {
    console.error('Erro ao reenviar código:', error);
    return res.status(500).json({ error: 'Erro ao reenviar código' });
  }
}
