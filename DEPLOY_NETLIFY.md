# 🚀 Deploy do Second Brain no Netlify

## ⚠️ AVISO IMPORTANTE

O Netlify tem **suporte limitado** para Next.js 16 com App Router. Se você encontrar problemas, recomendo usar **Vercel** (feito pela mesma empresa do Next.js).

---

## Passo a Passo

### 1. Instale o Plugin do Next.js

No terminal, dentro da pasta `frontend`:

```bash
cd frontend
npm install --save-dev @netlify/plugin-nextjs
```

### 2. Acesse o Netlify
- Vá para: https://app.netlify.com
- Clique em **"Sign Up"** ou **"Login"**
- Escolha **"Continue with GitHub"**

### 3. Importe o Projeto
- Clique em **"Add new site"** → **"Import an existing project"**
- Escolha **"Deploy with GitHub"**
- Selecione o repositório **"SecondBrain"**
- Clique em **"Authorize Netlify"** se necessário

### 4. Configure o Build

#### Base directory:
```
frontend
```

#### Build command:
```
npm run build
```

#### Publish directory:
```
frontend/.next
```

#### Functions directory:
```
(deixe vazio)
```

### 5. Adicione Variáveis de Ambiente

Clique em **"Show advanced"** → **"New variable"**

```
Key: NEXT_PUBLIC_API_URL
Value: https://seu-backend-url.com
```

**⚠️ IMPORTANTE:** Se você ainda não tem o backend em produção, use temporariamente:
```
Value: http://localhost:3001
```
(Mas isso só funciona localmente)

### 6. Deploy!

- Clique em **"Deploy [nome-do-site]"**
- Aguarde 3-5 minutos
- Seu site estará no ar! 🎉

---

## 🐛 Problemas Comuns no Netlify

### ❌ Erro: "Build failed" ou "Next.js not supported"

**Solução:** O Netlify não suporta bem Next.js 16 com App Router.

**Opções:**

1. **Use Vercel (Recomendado)** ✅
   - Suporte completo ao Next.js
   - Deploy mais rápido
   - Gratuito
   - Veja: `DEPLOY_VERCEL.md`

2. **Downgrade para Next.js 14** (não recomendado)
   - Perde recursos novos
   - Mais trabalho

3. **Use Netlify com Static Export**
   - Adicione no `next.config.ts`:
   ```typescript
   output: 'export'
   ```
   - Perde funcionalidades server-side

---

## 📝 Depois do Deploy

### URL do seu site:
```
https://[nome-aleatorio].netlify.app
```

Você pode mudar o nome em:
**Site settings** → **Change site name**

---

## 🔄 Atualizações Automáticas

Toda vez que você fizer `git push` para o GitHub, o Netlify fará deploy automático! 🚀

---

## 🎯 Recomendação Final

Se você encontrar **qualquer problema** no Netlify, use o **Vercel**:

1. É feito pela mesma empresa do Next.js
2. Suporte 100% garantido
3. Deploy mais rápido
4. Mesma facilidade de uso
5. Também é gratuito

👉 Veja o guia: `DEPLOY_VERCEL.md`

---

## 📞 Precisa de Ajuda?

- Documentação Netlify: https://docs.netlify.com
- Plugin Next.js: https://github.com/netlify/netlify-plugin-nextjs

---

**Criado em:** Maio 2026
**Versão:** 1.0
