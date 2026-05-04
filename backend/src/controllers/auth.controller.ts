import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AuthRequest } from '../types';
import { sendVerificationEmail } from '../services/email.service';

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verificar se já existe usuário VERIFICADO com este email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Gerar código de verificação de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Salvar dados TEMPORÁRIOS (NÃO cria usuário ainda!)
    await prisma.pendingVerification.upsert({
      where: { email: email.toLowerCase().trim() },
      update: {
        name: name.trim(),
        password: hashedPassword,
        verificationCode,
        verificationExpiry,
      },
      create: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        password: hashedPassword,
        verificationCode,
        verificationExpiry,
      },
    });

    // Enviar email com o código
    console.log(`📧 Enviando código de verificação para ${email}...`);
    const emailSent = await sendVerificationEmail(email, name, verificationCode);
    
    if (!emailSent) {
      console.log('⚠️  Falha ao enviar email, mas código foi gerado');
    }
    
    // Sempre mostrar no console para desenvolvimento
    console.log(`🔑 Código de verificação para ${email}: ${verificationCode}`);

    res.status(201).json({
      message: 'Verification code sent. Please check your email.',
      // NÃO retorna userId porque usuário ainda não foi criado
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    // Buscar verificação pendente
    const pendingVerification = await prisma.pendingVerification.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!pendingVerification) {
      return res.status(400).json({ error: 'Verification not found' });
    }

    // Verificar se o código está correto
    if (pendingVerification.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Verificar se o código não expirou
    if (pendingVerification.verificationExpiry < new Date()) {
      return res.status(400).json({ error: 'Verification code expired' });
    }

    // Verificar se usuário já existe (caso tenha sido criado antes)
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      // Usuário já existe, apenas atualizar como verificado
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: true }
      });

      // Remover a verificação pendente
      await prisma.pendingVerification.delete({
        where: { email: email.toLowerCase().trim() }
      });

      // Gerar token JWT
      const token = jwt.sign(
        { userId: existingUser.id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Email verified successfully',
        token,
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    }

    // CRIAR O USUÁRIO AGORA (após verificação bem-sucedida)
    const user = await prisma.user.create({
      data: {
        email: pendingVerification.email,
        name: pendingVerification.name,
        password: pendingVerification.password, // Já está com hash
        emailVerified: true, // Já verificado!
      },
    });

    // Remover a verificação pendente
    await prisma.pendingVerification.delete({
      where: { email: email.toLowerCase().trim() }
    });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    console.log(`✅ Usuário criado e verificado: ${user.email}`);

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
