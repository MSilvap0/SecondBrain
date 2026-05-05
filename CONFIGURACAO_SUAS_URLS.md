# ⚡ Configuração para Suas URLs Específicas

## 🌐 Suas URLs

- **Frontend (Vercel):** `https://second-brain-neon-eight.vercel.app`
- **Backend (Railway):** `https://alert-quietude-production-a54e.up.railway.app`

---

## ✅ O que já foi feito no código

### 1. Backend - CORS Configurado ✅

Arquivo `backend/src/index.ts` já está com sua URL do Vercel:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'https://second-brain-neon-eight.vercel.app', // ✅ Sua URL
  process.env.FRONTEND_URL || '',
];
```

### 2. Frontend - .env.local Corrigido ✅

Arquivo `frontend/.env.local` corrigido de `8080` para `3001`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🚀 O que você precisa fazer AGORA

### Passo 1: Commit e Push do Backend

```bash
git add backend/src/index.ts
git commit -m "fix: adicionar URL do Vercel no CORS"
git push origin main
```

✅ Railway fará deploy automático do backend

---

### Passo 2: Configurar Variável no Vercel

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique no projeto **Second Brain**
3. Vá em **"Settings"** → **"Environment Variables"**
4. Procure por `NEXT_PUBLIC_API_URL`

**Se existir:**
- Clique em **"Edit"**
- Mude o valor para: `https://alert-quietude-production-a54e.up.railway.app`
- Clique em **"Save"**

**Se NÃO existir:**
- Clique em **"Add New"**
- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://alert-quietude-production-a54e.up.railway.app`
- **Environment:** Selecione **Production**, **Preview** e **Development**
- Clique em **"Save"**

---

### Passo 3: Redeploy no Vercel

1. Vá em **"Deployments"**
2. Clique nos **3 pontinhos** do deployment mais recente
3. Clique em **"Redeploy"**
4. Aguarde 1-2 minutos

---

### Passo 4: Configurar Variável no Railway (Opcional)

1. Acesse [Railway Dashboard](https://railway.app/)
2. Clique no projeto **Second Brain**
3. Clique no serviço **Backend**
4. Vá em **"Variables"**
5. Adicione:

```
FRONTEND_URL=https://second-brain-neon-eight.vercel.app
```

6. Clique em **"Add"**

---

## 🧪 Testar

### 1. Testar Backend

Abra no navegador:
```
https://alert-quietude-production-a54e.up.railway.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "message": "Second Brain API is running"
}
```

### 2. Testar Frontend

1. Abra: `https://second-brain-neon-eight.vercel.app`
2. Pressione **F12** (abrir console)
3. Vá na aba **"Network"**
4. Tente fazer **login** ou **criar conta**
5. Verifique se as requisições vão para:
   - ✅ `https://alert-quietude-production-a54e.up.railway.app`
   - ❌ **NÃO** `localhost:8080`

### 3. Verificar CORS

No console (F12), **NÃO** deve aparecer:
- ❌ `CORS Failed`
- ❌ `No payload for this request`
- ❌ `Access-Control-Allow-Origin`

Se aparecer, significa que:
- Variável `NEXT_PUBLIC_API_URL` não foi configurada no Vercel
- Ou você não fez redeploy

---

## 🐛 Troubleshooting

### Erro: "CORS Failed"

**Causa:** Vercel ainda está usando `localhost:8080`

**Solução:**
1. Verifique se configurou `NEXT_PUBLIC_API_URL` no Vercel
2. Fez redeploy no Vercel
3. Limpe cache: **Ctrl + Shift + R**

---

### Erro: "Failed to fetch"

**Causa:** Backend não está respondendo

**Solução:**
1. Teste: `https://alert-quietude-production-a54e.up.railway.app/health`
2. Se não funcionar, verifique logs no Railway
3. Railway → Backend → Deployments → Logs

---

### Erro: "Cannot find module '/app/dist/index.js'"

**Causa:** Build do TypeScript falhou no Railway

**Solução:**
1. Railway → Backend → Settings → Deploy
2. **Build Command:** `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
3. **Start Command:** `npm run start`
4. Redeploy

---

## 📋 Checklist Final

- [ ] Commit e push do backend (CORS atualizado)
- [ ] Aguardei deploy automático no Railway (2-3 min)
- [ ] Configurei `NEXT_PUBLIC_API_URL` no Vercel
- [ ] Fiz redeploy no Vercel
- [ ] Aguardei deploy no Vercel (1-2 min)
- [ ] Testei `/health` do backend (deve retornar JSON)
- [ ] Abri o site no Vercel
- [ ] Abri console (F12) → Network
- [ ] Tentei fazer login
- [ ] Verifiquei que requisições vão para Railway
- [ ] **NÃO** aparece erro de CORS
- [ ] Limpei cache (Ctrl + Shift + R)

---

## ✅ Pronto!

Depois desses passos, seu site deve estar funcionando perfeitamente:

- ✅ Frontend no Vercel
- ✅ Backend no Railway
- ✅ CORS configurado
- ✅ Requisições funcionando

---

## 📞 Ainda com problemas?

Me avise qual erro específico está aparecendo no console (F12) e eu te ajudo!
