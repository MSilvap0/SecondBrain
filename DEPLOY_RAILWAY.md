# 🚀 Deploy no Railway - Guia Completo

Este guia mostra como fazer deploy do **Second Brain** no Railway, incluindo backend (Node.js + Express + Prisma) e frontend (Next.js).

---

## 🆘 PROBLEMAS COMUNS (Leia Primeiro!)

### ❌ Erro: "CORS Failed" ou "No payload for this request"

**Causa:** Frontend está tentando conectar em `localhost:8080` ao invés da URL do Railway.

**Solução Rápida:**

1. **Railway → Frontend Service → Variables**
2. Adicione: `NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app`
3. Substitua pela URL real do seu backend
4. Clique em **"Redeploy"**

[Ver solução completa](#frontend-não-conecta-ao-backend)

---

### ❌ Erro: "Cannot find module '/app/dist/index.js'"

**Causa:** Build do TypeScript não está rodando.

**Solução Rápida:**

1. **Railway → Backend Service → Settings → Deploy**
2. **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
3. **Start Command**: `npm run start`
4. Clique em **"Redeploy"**

[Ver solução completa](#erro-prisma-client-not-generated)

---

## 📋 Pré-requisitos

- Conta no [Railway](https://railway.app/)
- Conta no GitHub (para conectar o repositório)
- Código do projeto no GitHub
- Groq API Key (para IA)
- SMTP configurado (Gmail ou outro)

---

## 🏗️ Arquitetura no Railway

O projeto será dividido em **3 serviços**:

1. **PostgreSQL Database** - Banco de dados gerenciado
2. **Backend API** - Node.js + Express + Prisma
3. **Frontend** - Next.js (SSR)

---

## 📦 Parte 1: Preparar o Projeto

### 1.1 Atualizar Prisma Schema para PostgreSQL

O projeto usa SQLite localmente, mas no Railway usaremos PostgreSQL.

**Edite `backend/prisma/schema.prisma`:**

```prisma
datasource db {
  provider = "postgresql"  // Mudou de sqlite para postgresql
  url      = env("DATABASE_URL")
}
```

### 1.2 Criar arquivo `railway.json` na raiz do backend

Crie `backend/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npx prisma migrate deploy"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 1.3 Verificar Scripts no package.json

**Backend (`backend/package.json`):**

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "npx prisma migrate deploy"
  }
}
```

**Frontend (`frontend/package.json`):**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### 1.4 Commit e Push para GitHub

```bash
git add .
git commit -m "Preparar projeto para deploy no Railway"
git push origin main
```

---

## 🚂 Parte 2: Configurar Railway

### 2.1 Criar Novo Projeto

1. Acesse [railway.app](https://railway.app/)
2. Clique em **"New Project"**
3. Escolha **"Deploy from GitHub repo"**
4. Selecione seu repositório **Second Brain**
5. Railway detectará automaticamente o projeto

### 2.2 Adicionar PostgreSQL Database

1. No dashboard do projeto, clique em **"+ New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. Railway criará automaticamente:
   - Banco de dados PostgreSQL
   - Variável `DATABASE_URL` (gerada automaticamente)

### 2.3 Configurar Backend Service

1. Clique em **"+ New"** → **"GitHub Repo"**
2. Selecione o repositório novamente
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm run start`

#### Variáveis de Ambiente do Backend

Clique no serviço Backend → **"Variables"** → Adicione:

```env
# Database (gerado automaticamente pelo Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui_min_32_chars

# Groq API (IA)
GROQ_API_KEY=gsk_sua_chave_groq_aqui
OPENAI_API_KEY=${{GROQ_API_KEY}}
OPENAI_BASE_URL=https://api.groq.com/openai/v1

# Node
NODE_ENV=production
PORT=3001

# Frontend URL (será configurado depois)
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app_do_gmail
```

**⚠️ IMPORTANTE:**
- `DATABASE_URL` é gerado automaticamente quando você adiciona PostgreSQL
- `FRONTEND_URL` será preenchido automaticamente após deploy do frontend
- Para Gmail SMTP, use [App Password](https://myaccount.google.com/apppasswords)

### 2.4 Configurar Frontend Service

1. Clique em **"+ New"** → **"GitHub Repo"**
2. Selecione o repositório novamente
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

#### Variáveis de Ambiente do Frontend

Clique no serviço Frontend → **"Variables"** → Adicione:

```env
# Backend API URL (IMPORTANTE: adicione https:// na frente!)
NEXT_PUBLIC_API_URL=https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}

# Node
NODE_ENV=production
```

**⚠️ IMPORTANTE:**
- `NEXT_PUBLIC_API_URL` deve ter `https://` no início
- Exemplo: `https://second-brain-backend-production.up.railway.app`
- **NÃO use** `localhost:8080` em produção
- Railway preenche `${{Backend.RAILWAY_PUBLIC_DOMAIN}}` automaticamente, mas você precisa adicionar `https://`

---

## 🔄 Parte 3: Deploy e Migrações

### 3.1 Ordem de Deploy

1. **PostgreSQL** (já está rodando)
2. **Backend** (aguarde terminar o build)
3. **Frontend** (aguarde backend estar online)

### 3.2 Executar Migrações do Prisma

As migrações são executadas automaticamente no build command:

```bash
npx prisma migrate deploy
```

Se precisar executar manualmente:

1. Clique no serviço **Backend**
2. Vá em **"Settings"** → **"Deploy"**
3. Clique em **"Redeploy"**

### 3.3 Verificar Logs

Para cada serviço:
1. Clique no serviço
2. Vá em **"Deployments"**
3. Clique no deployment ativo
4. Veja os logs em tempo real

**Logs esperados do Backend:**
```
✓ Prisma schema loaded
✓ Migrations applied
✓ Server running on port 3001
✓ Database connected
```

**Logs esperados do Frontend:**
```
✓ Next.js build completed
✓ Server running on port 3000
✓ Ready on http://0.0.0.0:3000
```

---

## 🌐 Parte 4: Domínios e URLs

### 4.1 URLs Geradas Automaticamente

Railway gera URLs públicas automaticamente:

- **Backend**: `https://seu-projeto-backend.up.railway.app`
- **Frontend**: `https://seu-projeto-frontend.up.railway.app`

### 4.2 Configurar Domínio Customizado (Opcional)

1. Clique no serviço **Frontend**
2. Vá em **"Settings"** → **"Domains"**
3. Clique em **"Custom Domain"**
4. Adicione seu domínio (ex: `app.seusite.com`)
5. Configure DNS no seu provedor:
   ```
   CNAME app.seusite.com → seu-projeto-frontend.up.railway.app
   ```

### 4.3 Atualizar CORS no Backend

Edite `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://seu-projeto-frontend.up.railway.app',
    'https://app.seusite.com' // Se usar domínio customizado
  ],
  credentials: true
}));
```

Commit e push para atualizar.

---

## 🔧 Parte 5: Configurações Avançadas

### 5.1 Configurar Health Checks

Railway faz health checks automaticamente. Para customizar:

**Backend (`backend/src/index.ts`):**

```typescript
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### 5.2 Configurar Auto-Deploy

Por padrão, Railway faz deploy automático a cada push no GitHub.

Para desabilitar:
1. Clique no serviço
2. Vá em **"Settings"** → **"Service"**
3. Desmarque **"Auto Deploy"**

### 5.3 Configurar Recursos (CPU/RAM)

Railway oferece:
- **Hobby Plan**: 512MB RAM, 1 vCPU (grátis com limites)
- **Pro Plan**: Até 8GB RAM, 8 vCPU

Para ajustar:
1. Clique no serviço
2. Vá em **"Settings"** → **"Resources"**
3. Ajuste conforme necessário

### 5.4 Configurar Restart Policy

Já configurado no `railway.json`:

```json
{
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Opções:
- `ON_FAILURE` - Reinicia apenas em caso de erro
- `ALWAYS` - Sempre reinicia
- `NEVER` - Nunca reinicia

---

## 🐛 Parte 6: Troubleshooting

### Erro: "Prisma Client not generated"

**Solução:**
```bash
# Adicione ao buildCommand
npx prisma generate
```

### Erro: "Database connection failed"

**Solução:**
1. Verifique se `DATABASE_URL` está configurado
2. Verifique se PostgreSQL está rodando
3. Teste conexão nos logs

### Erro: "CORS blocked"

**Solução:**

1. **No Backend**, adicione a URL do frontend no CORS:

```typescript
// backend/src/index.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL || '',
    'https://seu-frontend.up.railway.app' // Adicione sua URL do Railway
  ],
  credentials: true
}));
```

2. **No Frontend**, verifique se `NEXT_PUBLIC_API_URL` está configurada:
   - Vá em Railway → Frontend Service → Variables
   - Verifique se `NEXT_PUBLIC_API_URL` tem o valor correto
   - Exemplo: `https://seu-backend.up.railway.app`
   - **IMPORTANTE**: Deve ter `https://` no início!

3. **Redeploy** ambos os serviços após as mudanças

### Erro: "Port already in use"

**Solução:**
Railway define a porta automaticamente via `PORT` env var:

```typescript
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Erro: "Build timeout"

**Solução:**
1. Otimize dependências (remova não utilizadas)
2. Use cache do Railway
3. Aumente timeout em Settings → Deploy

### Erro: "Migration failed"

**Solução:**
```bash
# Reset database (CUIDADO: apaga dados)
npx prisma migrate reset

# Ou aplique manualmente
npx prisma migrate deploy
```

### Frontend não conecta ao Backend

**Sintomas:**
- Console mostra: `CORS Failed` ou `No payload for this request`
- Requisições para `localhost:8080` ao invés da URL do Railway

**Solução:**

**Passo 1: Configurar URL da API no Frontend**

1. Acesse Railway → Seu Projeto → **Frontend Service**
2. Clique em **"Variables"**
3. Adicione ou edite:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app
   ```
4. **IMPORTANTE**: Substitua `seu-backend.up.railway.app` pela URL real do seu backend
5. Clique em **"Add"** ou **"Save"**

**Passo 2: Obter URL do Backend**

1. Vá em Railway → Seu Projeto → **Backend Service**
2. Clique em **"Settings"** → **"Domains"**
3. Copie a URL (ex: `second-brain-backend-production.up.railway.app`)
4. Adicione `https://` na frente: `https://second-brain-backend-production.up.railway.app`

**Passo 3: Configurar CORS no Backend**

Edite `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://seu-frontend.up.railway.app', // URL do frontend no Railway
    process.env.FRONTEND_URL || ''
  ],
  credentials: true
}));
```

**Passo 4: Redeploy**

1. Commit e push as mudanças do backend
2. No Railway, clique em **"Redeploy"** no Frontend
3. Aguarde 2-3 minutos
4. Teste novamente

**Passo 5: Verificar**

Abra o console do navegador (F12) e verifique:
- As requisições devem ir para `https://seu-backend.up.railway.app`
- **NÃO** devem ir para `localhost:8080`

Se ainda mostrar `localhost:8080`, limpe o cache:
- Ctrl + Shift + R (Windows/Linux)
- Cmd + Shift + R (Mac)

---

## 📊 Parte 7: Monitoramento

### 7.1 Logs em Tempo Real

```bash
# Via Railway CLI
railway logs --service backend
railway logs --service frontend
```

### 7.2 Métricas

Railway mostra automaticamente:
- CPU usage
- Memory usage
- Network traffic
- Request count

Acesse: Serviço → **"Metrics"**

### 7.3 Alertas

Configure alertas em:
1. Project Settings → **"Notifications"**
2. Adicione webhook ou email
3. Configure triggers (deploy failed, high CPU, etc.)

---

## 💰 Parte 8: Custos

### Hobby Plan (Grátis)
- $5 de crédito grátis/mês
- 512MB RAM por serviço
- 1GB storage
- 100GB bandwidth

### Pro Plan ($20/mês)
- $20 de crédito/mês
- Recursos ilimitados
- Prioridade no suporte
- Domínios customizados ilimitados

**Estimativa para Second Brain:**
- PostgreSQL: ~$2-5/mês
- Backend: ~$3-7/mês
- Frontend: ~$3-7/mês
- **Total**: ~$8-19/mês (dentro do Pro Plan)

---

## 🔐 Parte 9: Segurança

### 9.1 Variáveis de Ambiente Seguras

✅ **NUNCA** commite:
- `JWT_SECRET`
- `GROQ_API_KEY`
- `SMTP_PASS`
- `DATABASE_URL`

✅ **SEMPRE** use Railway Variables

### 9.2 HTTPS

Railway fornece HTTPS automaticamente para todos os serviços.

### 9.3 Rate Limiting

Adicione rate limiting no backend:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requests por IP
});

app.use('/api/', limiter);
```

### 9.4 Helmet.js

Adicione headers de segurança:

```bash
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

---

## 🚀 Parte 10: Checklist Final

Antes de ir para produção:

- [ ] PostgreSQL rodando
- [ ] Backend rodando (verificar `/health`)
- [ ] Frontend rodando
- [ ] Migrações aplicadas
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] SMTP funcionando (testar email)
- [ ] Groq API funcionando (testar IA)
- [ ] Domínio customizado configurado (opcional)
- [ ] Health checks passando
- [ ] Logs sem erros
- [ ] Testar fluxo completo:
  - [ ] Registro de usuário
  - [ ] Login
  - [ ] Criar ideia
  - [ ] Expandir com IA
  - [ ] Chat com IA
  - [ ] Comprar créditos
  - [ ] Reset de senha

---

## 📚 Recursos Úteis

- [Railway Docs](https://docs.railway.app/)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Prisma + Railway](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
- [Next.js + Railway](https://railway.app/template/next-js)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique logs no Railway
2. Consulte este guia
3. Verifique [Railway Status](https://status.railway.app/)
4. Entre em contato: [Railway Discord](https://discord.gg/railway)

---

**✅ Deploy concluído! Seu Second Brain está no ar! 🎉**
