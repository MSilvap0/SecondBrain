# 🔍 Verificar Deploy - Checklist Completo

## 1️⃣ Verificar Backend (Railway)

### Teste 1: Health Check

Abra no navegador:
```
https://alert-quietude-production-a54e.up.railway.app/health
```

**✅ Esperado:**
```json
{
  "status": "ok",
  "message": "Second Brain API is running"
}
```

**❌ Se der erro:**
- Backend não está rodando
- Vá em Railway → Backend → Deployments → Logs
- Procure por erros

---

### Teste 2: CORS Headers

Abra o console (F12) e execute:

```javascript
fetch('https://alert-quietude-production-a54e.up.railway.app/health', {
  method: 'GET',
  headers: {
    'Origin': 'https://second-brain-neon-eight.vercel.app'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**✅ Esperado:**
- Retorna o JSON sem erro
- Sem mensagem de CORS

**❌ Se der erro de CORS:**
- URL do Vercel não está no `allowedOrigins` do backend
- Faça commit e push do `backend/src/index.ts`

---

## 2️⃣ Verificar Frontend (Vercel)

### Teste 1: Variável de Ambiente

1. Vercel Dashboard → Second Brain → Settings → Environment Variables
2. Procure: `NEXT_PUBLIC_API_URL`
3. Valor deve ser: `https://alert-quietude-production-a54e.up.railway.app`

**❌ Se não existir ou estiver errado:**
- Adicione/edite a variável
- Faça redeploy

---

### Teste 2: Build Logs

1. Vercel Dashboard → Deployments → Último deployment
2. Clique em **"View Function Logs"** ou **"Build Logs"**
3. Procure por:

```
NEXT_PUBLIC_API_URL=https://alert-quietude-production-a54e.up.railway.app
```

**✅ Se aparecer:** Variável está configurada
**❌ Se não aparecer:** Variável não foi salva, configure novamente

---

### Teste 3: Runtime (Console do Navegador)

1. Abra: `https://second-brain-neon-eight.vercel.app`
2. Pressione **F12**
3. Vá na aba **"Console"**
4. Execute:

```javascript
console.log(process.env.NEXT_PUBLIC_API_URL);
```

**✅ Esperado:**
```
https://alert-quietude-production-a54e.up.railway.app
```

**❌ Se mostrar `undefined` ou `localhost:8080`:**
- Variável não foi configurada no Vercel
- Ou você não fez redeploy

---

## 3️⃣ Verificar Integração Completa

### Teste 1: Network Tab

1. Abra: `https://second-brain-neon-eight.vercel.app`
2. Pressione **F12** → Aba **"Network"**
3. Clique em **"Register"** (criar conta)
4. Preencha o formulário
5. Clique em **"Criar conta"**

**Verifique:**
- ✅ Requisição vai para: `https://alert-quietude-production-a54e.up.railway.app/api/auth/register`
- ✅ Status: `200` ou `201` (sucesso) ou `400` (erro esperado)
- ❌ **NÃO** deve ir para `localhost:8080`

---

### Teste 2: CORS no Console

No console (F12), **NÃO** deve aparecer:

```
❌ Access to fetch at 'https://alert-quietude-production-a54e.up.railway.app/...' 
   from origin 'https://second-brain-neon-eight.vercel.app' 
   has been blocked by CORS policy
```

**Se aparecer:**
- Backend não tem a URL do Vercel no CORS
- Commit e push do `backend/src/index.ts`
- Aguarde deploy automático no Railway

---

### Teste 3: Login Completo

1. Tente fazer **login** com uma conta existente
2. Ou **crie uma conta nova**
3. Verifique se:
   - ✅ Não dá erro de CORS
   - ✅ Requisição vai para Railway
   - ✅ Resposta chega corretamente
   - ✅ Você é redirecionado para o dashboard

---

## 4️⃣ Verificar Banco de Dados (Railway)

### Teste 1: Conexão

1. Railway → PostgreSQL → Connect
2. Copie a `DATABASE_URL`
3. No terminal local:

```bash
cd backend
DATABASE_URL="sua_url_aqui" npx prisma studio
```

4. Abra: `http://localhost:5555`
5. Verifique se as tabelas existem:
   - ✅ User
   - ✅ Idea
   - ✅ PendingVerification
   - ✅ PasswordResetToken
   - ✅ Purchase

**❌ Se não existir:**
- Migrações não foram executadas
- Railway → Backend → Settings → Deploy
- Build Command deve ter: `npx prisma migrate deploy`

---

## 5️⃣ Verificar Variáveis de Ambiente

### Backend (Railway)

Railway → Backend → Variables

**Obrigatórias:**
- ✅ `DATABASE_URL` (gerado automaticamente)
- ✅ `JWT_SECRET`
- ✅ `GROQ_API_KEY`
- ✅ `OPENAI_API_KEY` (mesmo valor do GROQ)
- ✅ `OPENAI_BASE_URL=https://api.groq.com/openai/v1`
- ✅ `NODE_ENV=production`
- ✅ `PORT=3001`
- ✅ `FRONTEND_URL=https://second-brain-neon-eight.vercel.app`

**Opcionais (Email):**
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

---

### Frontend (Vercel)

Vercel → Settings → Environment Variables

**Obrigatórias:**
- ✅ `NEXT_PUBLIC_API_URL=https://alert-quietude-production-a54e.up.railway.app`

---

## 📋 Checklist Resumido

### Backend
- [ ] `/health` retorna JSON
- [ ] Logs sem erros no Railway
- [ ] CORS configurado com URL do Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados conectado
- [ ] Migrações executadas

### Frontend
- [ ] `NEXT_PUBLIC_API_URL` configurada no Vercel
- [ ] Redeploy feito após configurar variável
- [ ] Console mostra URL correta do Railway
- [ ] Network tab mostra requisições para Railway
- [ ] Sem erros de CORS no console

### Integração
- [ ] Login funciona
- [ ] Criar conta funciona
- [ ] Dashboard carrega
- [ ] IA funciona (expandir ideia)
- [ ] Chat funciona

---

## ✅ Tudo OK?

Se todos os testes passaram, seu deploy está **100% funcional**! 🎉

---

## ❌ Algo falhou?

Me avise qual teste específico falhou e qual erro apareceu, que eu te ajudo a resolver!
