# Deploy no Vercel - Second Brain

Este guia explica como fazer o deploy completo (frontend + backend) no Vercel.

## 📋 Pré-requisitos

- Conta no Vercel (https://vercel.com)
- Repositório no GitHub com o código
- Vercel CLI instalado (opcional): `npm i -g vercel`

## 🚀 Deploy via Dashboard (Recomendado)

### 1. Importar Projeto

1. Acesse https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório `SecondBrain`
4. Configure o projeto:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 2. Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

#### Frontend
```
NEXT_PUBLIC_API_URL=https://seu-backend-url.railway.app
```

### 3. Deploy

1. Clique em "Deploy"
2. Aguarde o build completar (2-3 minutos)
3. Acesse a URL fornecida pelo Vercel

## 🗄️ Deploy do Backend (Railway - Recomendado)

O Vercel é otimizado para frontend. Para o backend, use Railway:

### 1. Criar Conta no Railway

1. Acesse https://railway.app
2. Faça login com GitHub
3. Clique em "New Project"

### 2. Deploy do Backend

1. Selecione "Deploy from GitHub repo"
2. Escolha o repositório `SecondBrain`
3. Clique em "Add variables" e configure:

```
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
GROQ_API_KEY=sua_groq_api_key_aqui
RESEND_API_KEY=sua_resend_api_key_aqui
EMAIL_FROM=noreply@seudominio.com
FRONTEND_URL=https://seu-projeto.vercel.app
PORT=3001
NODE_ENV=production
```

4. Em "Settings":
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Watch Paths**: `backend/**`

5. Clique em "Deploy"

### 3. Obter URL do Backend

Após o deploy, copie a URL do Railway (ex: `https://seu-backend.up.railway.app`)

### 4. Atualizar Frontend no Vercel

1. Volte ao dashboard do Vercel
2. Vá em Settings → Environment Variables
3. Edite `NEXT_PUBLIC_API_URL`
4. Cole a URL do Railway
5. Clique em "Redeploy"

## 🗄️ Configurar Banco de Dados

### Opção 1: Railway Postgres (Recomendado)

1. No Railway, clique em "New"
2. Selecione "Database" → "PostgreSQL"
3. Copie a `DATABASE_URL` gerada
4. Cole nas variáveis de ambiente do backend

### Opção 2: Supabase (Grátis)

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Vá em Settings → Database
4. Copie a "Connection string"
5. Cole como `DATABASE_URL`

### Executar Migrations

Após configurar o banco:

```bash
# Localmente
cd backend
DATABASE_URL="sua_url_aqui" npx prisma migrate deploy
```

## 📧 Configurar Email (Resend)

1. Crie conta em https://resend.com
2. Obtenha sua API Key
3. Adicione `RESEND_API_KEY` nas variáveis de ambiente
4. Configure `EMAIL_FROM` (ex: `noreply@seudominio.com`)

## 🤖 Configurar IA (Groq)

1. Crie conta em https://console.groq.com
2. Obtenha sua API Key
3. Adicione `GROQ_API_KEY` nas variáveis de ambiente

## 🔍 Verificar Deploy

Após o deploy, teste:

1. **Frontend**: Acesse `https://seu-projeto.vercel.app`
2. **Backend**: Acesse `https://seu-backend.railway.app/health`
3. **Registro**: Tente criar uma conta
4. **Login**: Tente fazer login

## 🐛 Troubleshooting

### Erro: "Failed to fetch"

- Verifique se `NEXT_PUBLIC_API_URL` está configurada
- Confirme que o backend está rodando no Railway
- Verifique CORS no backend

### Erro: "Database connection failed"

- Verifique se `DATABASE_URL` está configurada
- Execute migrations: `npx prisma migrate deploy`

### Erro: "JWT secret not configured"

- Adicione `JWT_SECRET` nas variáveis de ambiente
- Use um valor seguro: `openssl rand -base64 32`

## 🔄 Atualizações

Para fazer deploy de novas versões:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

- Vercel fará deploy automático do frontend
- Railway fará deploy automático do backend

## 💰 Custos

### Vercel (Frontend)
- **Hobby Plan** (Grátis):
  - 100 GB bandwidth/mês
  - Builds ilimitados

### Railway (Backend)
- **Trial**: $5 grátis/mês
- **Developer**: $5/mês depois do trial
- **Team**: $20/mês

## � Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Railway](https://docs.railway.app)
- [Next.js no Vercel](https://vercel.com/docs/frameworks/nextjs)
