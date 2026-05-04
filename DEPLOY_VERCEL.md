# 🚀 Deploy do Second Brain no Vercel

## Passo a Passo

### 1. Acesse o Vercel
- Vá para: https://vercel.com
- Clique em **"Sign Up"** ou **"Login"**
- Escolha **"Continue with GitHub"**

### 2. Importe o Projeto
- Clique em **"Add New..."** → **"Project"**
- Selecione o repositório **"SecondBrain"**
- Clique em **"Import"**

### 3. Configure o Projeto

#### Root Directory:
```
frontend
```
(Clique em "Edit" ao lado de "Root Directory" e digite `frontend`)

#### Framework Preset:
```
Next.js
```
(Deve detectar automaticamente)

#### Build Command:
```
npm run build
```
(Já vem configurado)

#### Output Directory:
```
.next
```
(Já vem configurado)

### 4. Adicione Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

```
Name: NEXT_PUBLIC_API_URL
Value: https://seu-backend-url.com
```

**⚠️ IMPORTANTE:** Se você ainda não tem o backend em produção, use temporariamente:
```
Value: http://localhost:3001
```
(Mas isso só funciona localmente - você precisará fazer deploy do backend depois)

### 5. Deploy!

- Clique em **"Deploy"**
- Aguarde 2-3 minutos
- Seu site estará no ar! 🎉

---

## 📝 Depois do Deploy

### URL do seu site:
```
https://second-brain-[seu-usuario].vercel.app
```

### Para fazer deploy do Backend:

Recomendo usar **Railway** ou **Render**:

#### Railway (Recomendado):
1. Acesse: https://railway.app
2. Conecte GitHub
3. Selecione repositório (crie um novo só para backend)
4. Configure variáveis de ambiente
5. Deploy automático!

#### Render:
1. Acesse: https://render.com
2. New → Web Service
3. Conecte GitHub
4. Configure variáveis de ambiente
5. Deploy!

---

## 🔄 Atualizações Automáticas

Toda vez que você fizer `git push` para o GitHub, o Vercel fará deploy automático! 🚀

---

## 🐛 Problemas Comuns

### Erro: "Module not found"
- Verifique se o `Root Directory` está configurado como `frontend`

### Erro: "Build failed"
- Verifique se todas as dependências estão no `package.json`
- Rode `npm install` localmente para testar

### Site carrega mas não conecta com backend
- Verifique a variável `NEXT_PUBLIC_API_URL`
- Certifique-se que o backend está rodando

---

## 📞 Precisa de Ajuda?

- Documentação Vercel: https://vercel.com/docs
- Documentação Next.js: https://nextjs.org/docs

---

**Criado em:** Maio 2026
**Versão:** 1.0
