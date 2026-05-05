# 🔧 Corrigir Erro CORS no Railway - AGORA

## ❌ Problema Atual

Você está vendo no console:
- `CORS Failed`
- `No payload for this request`
- Requisições indo para `localhost:8080`

---

## ✅ Solução em 5 Passos

### Passo 1: Obter URL do Backend

1. Abra [Railway Dashboard](https://railway.app/)
2. Clique no seu projeto **Second Brain**
3. Clique no serviço **Backend**
4. Vá em **"Settings"** → **"Domains"**
5. **Copie a URL** (exemplo: `second-brain-backend-production.up.railway.app`)

**⚠️ IMPORTANTE:** Anote essa URL, você vai precisar dela!

---

### Passo 2: Configurar Frontend no Railway

1. Volte para o dashboard do projeto
2. Clique no serviço **Frontend**
3. Clique em **"Variables"** (no menu lateral)
4. Procure por `NEXT_PUBLIC_API_URL`
   - **Se existir:** Clique em **"Edit"**
   - **Se NÃO existir:** Clique em **"New Variable"**

5. Configure assim:
   ```
   Variable Name: NEXT_PUBLIC_API_URL
   Value: https://second-brain-backend-production.up.railway.app
   ```
   
   **⚠️ SUBSTITUA** `second-brain-backend-production.up.railway.app` pela URL que você copiou no Passo 1!
   
   **⚠️ NÃO ESQUEÇA** do `https://` no início!

6. Clique em **"Add"** ou **"Save"**

---

### Passo 3: Redeploy do Frontend

1. Ainda no serviço **Frontend**
2. Clique em **"Deployments"** (no menu lateral)
3. Clique nos **3 pontinhos** do deployment mais recente
4. Clique em **"Redeploy"**
5. Aguarde 2-3 minutos

---

### Passo 4: Configurar CORS no Backend (Código)

Você precisa editar o código do backend localmente:

**Arquivo:** `backend/src/index.ts`

**Procure por:**
```typescript
app.use(cors());
```

**Substitua por:**
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://seu-frontend.up.railway.app', // Substitua pela URL do seu frontend
    process.env.FRONTEND_URL || ''
  ],
  credentials: true
}));
```

**⚠️ IMPORTANTE:** Substitua `seu-frontend.up.railway.app` pela URL do seu frontend no Railway!

Para obter a URL do frontend:
1. Railway → Frontend Service → Settings → Domains
2. Copie a URL

---

### Passo 5: Commit e Push

```bash
git add backend/src/index.ts
git commit -m "fix: configurar CORS para Railway"
git push origin main
```

Railway fará deploy automático do backend.

---

## 🧪 Testar

1. Abra seu site no Railway (URL do frontend)
2. Abra o **Console do navegador** (F12)
3. Vá na aba **"Network"**
4. Tente fazer login ou qualquer ação
5. Verifique se as requisições vão para:
   - ✅ `https://seu-backend.up.railway.app`
   - ❌ **NÃO** `localhost:8080`

---

## 🔍 Ainda não funciona?

### Limpar Cache do Navegador

1. Pressione **Ctrl + Shift + R** (Windows/Linux)
2. Ou **Cmd + Shift + R** (Mac)
3. Ou abra em **Aba Anônima** (Ctrl + Shift + N)

### Verificar Variáveis

1. Railway → Frontend → Variables
2. Confirme que `NEXT_PUBLIC_API_URL` está correta
3. Deve ter `https://` no início
4. Deve ser a URL do **backend**, não do frontend

### Verificar Logs

1. Railway → Backend → Deployments → Clique no deployment ativo
2. Veja se há erros nos logs
3. Procure por mensagens de CORS

---

## 📞 Checklist Final

- [ ] Copiei a URL do backend no Railway
- [ ] Adicionei `NEXT_PUBLIC_API_URL` no frontend com `https://`
- [ ] Fiz redeploy do frontend
- [ ] Editei `backend/src/index.ts` com CORS correto
- [ ] Fiz commit e push do backend
- [ ] Aguardei deploy automático (2-3 min)
- [ ] Testei no navegador
- [ ] Verifiquei que requisições vão para URL do Railway
- [ ] Limpei cache do navegador

---

**✅ Depois desses passos, o erro de CORS deve estar resolvido!**

Se ainda tiver problemas, me avise qual erro específico está aparecendo no console.
