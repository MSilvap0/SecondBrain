# ⚡ SOLUÇÃO RÁPIDA - Erro CORS no Railway

## 🎯 O que você precisa fazer AGORA

### 1️⃣ Obter URLs do Railway

Abra o Railway e anote:

**URL do Backend:**
```
https://_____________________.up.railway.app
```

**URL do Frontend:**
```
https://_____________________.up.railway.app
```

---

### 2️⃣ Configurar Variável no Frontend (Railway)

1. Railway → **Frontend Service** → **Variables**
2. Adicione ou edite:

```
NEXT_PUBLIC_API_URL=https://SUA-URL-DO-BACKEND.up.railway.app
```

**⚠️ Substitua pela URL real do backend!**

3. Clique em **"Redeploy"** no frontend

---

### 3️⃣ Adicionar URL no Backend (Código)

Edite `backend/src/index.ts` linha 29:

**ANTES:**
```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'https://second-brain-5ucwr7sek-msilvap0s-projects.vercel.app',
  process.env.FRONTEND_URL || '',
  // Adicione aqui a URL do seu frontend no Railway quando fizer deploy
  // Exemplo: 'https://second-brain-frontend-production.up.railway.app'
].filter((origin): origin is string => Boolean(origin));
```

**DEPOIS:**
```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'https://second-brain-5ucwr7sek-msilvap0s-projects.vercel.app',
  'https://SUA-URL-DO-FRONTEND.up.railway.app', // ← ADICIONE AQUI
  process.env.FRONTEND_URL || '',
].filter((origin): origin is string => Boolean(origin));
```

**⚠️ Substitua pela URL real do frontend!**

---

### 4️⃣ Commit e Push

```bash
git add backend/src/index.ts
git commit -m "fix: adicionar URL do Railway no CORS"
git push origin main
```

Railway fará deploy automático.

---

### 5️⃣ Configurar Variável no Backend (Railway)

1. Railway → **Backend Service** → **Variables**
2. Adicione:

```
FRONTEND_URL=https://SUA-URL-DO-FRONTEND.up.railway.app
```

**⚠️ Substitua pela URL real do frontend!**

3. Clique em **"Redeploy"** no backend

---

## ✅ Pronto!

Aguarde 2-3 minutos e teste novamente.

---

## 🧪 Como Testar

1. Abra seu site (URL do frontend)
2. Pressione **F12** (abrir console)
3. Vá na aba **"Network"**
4. Tente fazer login
5. Verifique se as requisições vão para a URL do Railway (não localhost)

---

## ❌ Ainda não funciona?

### Limpar Cache
- **Ctrl + Shift + R** (Windows)
- **Cmd + Shift + R** (Mac)
- Ou abra em **aba anônima**

### Verificar Variáveis
Railway → Frontend → Variables:
- `NEXT_PUBLIC_API_URL` deve ter `https://` e apontar para o backend

Railway → Backend → Variables:
- `FRONTEND_URL` deve ter `https://` e apontar para o frontend

---

**💡 Dica:** Sempre use `https://` nas URLs do Railway!
