import dotenv from 'dotenv';

// Carregar variáveis de ambiente PRIMEIRO
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import ideaRoutes from './routes/idea.routes';
import tagRoutes from './routes/tag.routes';
import aiRoutes from './routes/ai.routes';
import emailVerificationRoutes from './routes/email-verification.routes';
import userRoutes from './routes/user.routes';
import passwordResetRoutes from './routes/password-reset.routes';
import userSettingsRoutes from './routes/user-settings.routes';
import purchaseRoutes from './routes/purchase.routes';
import creditsRoutes from './routes/credits.routes';
import { chatWithAI } from './controllers/ai-chat.controller';
import { authMiddleware } from './middlewares/auth.middleware';
import { verifyEmailConfig } from './services/email.service';

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Second Brain API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/email-verification', emailVerificationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/user', userSettingsRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/credits', creditsRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const startServer = async () => {
  // Conectar MongoDB (não bloqueia o servidor se falhar)
  connectDB().catch(err => {
    console.error('MongoDB connection failed, but server will continue:', err.message);
  });

  // Verificar configuração de email
  await verifyEmailConfig();

  // Iniciar servidor SEMPRE (mesmo sem MongoDB)
  httpServer.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Frontend: http://localhost:3000`);
    console.log(`🔌 Backend: http://localhost:${PORT}`);
  });
};

startServer();
