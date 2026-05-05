# Como Separar o Backend em Outro Repositório

## 📋 Passo a Passo

### 1. Criar novo repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `SecondBrain-Backend`
3. Descrição: `Backend API do Second Brain - Sistema de organização de ideias com IA`
4. **Privado** (recomendado para proteger suas chaves)
5. **NÃO** adicione README, .gitignore ou license
6. Clique em "Create repository"
7. **Copie a URL** (ex: `https://github.com/MSilvap0/SecondBrain-Backend.git`)

### 2. Preparar o backend localmente

Abra o terminal na pasta do projeto e execute:

```bash
# Criar uma cópia da pasta backend
cp -r backend ../SecondBrain-Backend

# Entrar na nova pasta
cd ../SecondBrain-Backend

# Inicializar git
git init

# Criar .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build
dist/
build/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
coverage/

# Prisma
prisma/dev.db
prisma/dev.db-journal

# Misc
.cache/
temp/
tmp/
EOF

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "feat: initial backend setup"

# Adicionar remote (USE SUA URL DO GITHUB)
git remote add origin https://github.com/MSilvap0/SecondBrain-Backend.git

# Push
git branch -M main
git push -u origin main
```

### 3. Remover backend do repositório frontend

Volte para o repositório do frontend:

```bash
# Voltar para o projeto principal
cd ../Second\ Brain

# Remover pasta backend
rm -rf backend

# Atualizar .gitignore (já está configurado para ignorar backend)

# Commit
git add .
git commit -m "refactor: mover backend para repositório separado"
git push origin main
```

### 4. Criar README.md no backend

Crie um arquivo `README.md` no repositório do backend:

```markdown
# Second Brain - Backend API

API REST para o sistema Second Brain - Organize suas ideias com inteligência artificial.

## 🚀 Tecnologias

- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Groq AI (LLaMA)
- Resend (Email)

## 📦 Instalação

\`\`\`bash
npm install
\`\`\`

## ⚙️ Configuração

Crie um arquivo `.env`:

\`\`\`env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=seu_jwt_secret_aqui
GROQ_API_KEY=sua_groq_api_key_aqui
RESEND_API_KEY=sua_resend_api_key_aqui
EMAIL_FROM=noreply@seudominio.com
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
\`\`\`

## 🗄️ Database

\`\`\`bash
# Executar migrations
npx prisma migrate dev

# Abrir Prisma Studio
npx prisma studio
\`\`\`

## 🏃 Executar

\`\`\`bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
\`\`\`

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-email` - Verificar email

### Ideas
- `GET /api/ideas` - Listar ideias
- `POST /api/ideas` - Criar ideia
- `PUT /api/ideas/:id` - Atualizar ideia
- `DELETE /api/ideas/:id` - Deletar ideia

### AI
- `POST /api/ai/expand` - Expandir ideia com IA
- `POST /api/ai/chat` - Chat com IA

## 🚀 Deploy

### Railway
1. Conecte o repositório
2. Configure variáveis de ambiente
3. Adicione PostgreSQL
4. Deploy automático

### Render
1. New Web Service
2. Conecte o repositório
3. Configure variáveis de ambiente
4. Deploy

## 📝 License

MIT
\`\`\`

## 5. Deploy no Railway

Agora que o backend está em um repositório separado:

1. Acesse https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. Selecione `SecondBrain-Backend`
4. Configure variáveis de ambiente
5. Adicione PostgreSQL
6. Deploy automático! ✅

**Muito mais simples!** Railway detecta automaticamente que é um projeto Node.js.

## 6. Atualizar Frontend

No repositório do frontend, atualize o `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
```

---

## ✅ Resultado Final

Você terá:

- 📁 **SecondBrain** (Frontend) → Vercel
- 📁 **SecondBrain-Backend** (Backend) → Railway
- 🔗 Frontend conecta no backend via `NEXT_PUBLIC_API_URL`

---

## 🎯 Vantagens

✅ Deploy independente de cada parte
✅ Backend privado (protege suas chaves)
✅ Frontend público (pode ser open source)
✅ Mais fácil de gerenciar
✅ CI/CD mais rápido
✅ Melhor organização

---

## 📌 Importante

Depois de separar, você terá que fazer push em 2 repositórios:

```bash
# Frontend
cd SecondBrain
git push origin main

# Backend
cd ../SecondBrain-Backend
git push origin main
```

Mas o deploy será automático em ambos! 🚀
