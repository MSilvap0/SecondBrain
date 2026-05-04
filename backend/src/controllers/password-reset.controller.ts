import { Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { sendPasswordResetEmail } from '../services/email.service';

// Solicitar reset de senha (envia email)
export const requestPasswordReset = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    // SEMPRE retornar sucesso (segurança - não revelar se email existe)
    if (!user) {
      console.log(`⚠️  Tentativa de reset para email não cadastrado: ${email}`);
      return res.json({
        message: 'If this email is registered, you will receive a password reset link.'
      });
    }

    // Gerar token único e seguro
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Salvar token no banco
    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token: resetToken,
        expiresAt,
        used: false
      }
    });

    // Enviar email
    console.log(`📧 Enviando email de reset para ${user.email}...`);
    const emailSent = await sendPasswordResetEmail(user.email, user.name, resetToken);
    
    if (!emailSent) {
      console.log('⚠️  Falha ao enviar email, mas token foi gerado');
    }
    
    // Sempre mostrar no console para desenvolvimento
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    console.log(`🔑 Link de reset para ${user.email}:`);
    console.log(resetUrl);

    res.json({
      message: 'If this email is registered, you will receive a password reset link.'
    });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verificar se token é válido
export const verifyResetToken = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Buscar token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Verificar se já foi usado
    if (resetToken.used) {
      return res.status(400).json({ error: 'Token already used' });
    }

    // Verificar se expirou
    if (resetToken.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Token expired' });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    res.json({
      valid: true,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Resetar senha
export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Validar senha
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Buscar token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Verificar se já foi usado
    if (resetToken.used) {
      return res.status(400).json({ error: 'Token already used' });
    }

    // Verificar se expirou
    if (resetToken.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Token expired' });
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // Marcar token como usado
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true }
    });

    console.log(`✅ Senha redefinida com sucesso para ${user.email}`);

    res.json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
