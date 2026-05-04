'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Check,
  Brain,
  Lightbulb,
  Target
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  // Verifica se o usuário já está logado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "IA Avançada",
      description: "Expanda suas ideias com inteligência artificial de última geração"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Organização Inteligente",
      description: "Sistema de tags e categorias que aprende com você"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Foco no que Importa",
      description: "Interface limpa e minimalista para máxima produtividade"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Rápido e Eficiente",
      description: "Capture ideias em segundos, organize em minutos"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Seguro e Privado",
      description: "Seus dados são criptografados e protegidos"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Evolua Constantemente",
      description: "Acompanhe o crescimento das suas ideias ao longo do tempo"
    }
  ];

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Empreendedora",
      content: "Transformou completamente como organizo minhas ideias de negócio. Indispensável!",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      role: "Designer",
      content: "A IA realmente entende o contexto e sugere conexões que eu não tinha pensado.",
      rating: 5
    },
    {
      name: "Marina Costa",
      role: "Escritora",
      content: "Finalmente um lugar onde posso capturar e desenvolver todas as minhas ideias.",
      rating: 5
    }
  ];

  const stats = [
    { value: "50k+", label: "Ideias Criadas" },
    { value: "10k+", label: "Usuários Ativos" },
    { value: "98%", label: "Satisfação" },
    { value: "4.9/5", label: "Avaliação" }
  ];

  return (
    <div className="min-h-screen ui-shell">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Powered by AI</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Seu Segundo Cérebro
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Potencializado por IA
              </span>
            </h1>

            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Capture, organize e expanda suas ideias com inteligência artificial. 
              Transforme pensamentos em projetos concretos.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/register')}
                className="ui-btn ui-btn-primary text-lg px-8 py-4 shadow-2xl"
              >
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/login')}
                className="ui-btn ui-btn-secondary text-lg px-8 py-4"
              >
                Fazer Login
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Grátis para começar</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Tudo que você precisa para organizar suas ideias
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Ferramentas poderosas e intuitivas para transformar pensamentos em realidade
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="ui-card p-8 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Amado por milhares de usuários
            </h2>
            <p className="text-xl text-zinc-400">
              Veja o que nossos usuários estão dizendo
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="ui-card p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-zinc-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ui-card p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-xl text-zinc-400 mb-8">
                Junte-se a milhares de pessoas que já estão organizando suas ideias
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/register')}
                className="ui-btn ui-btn-primary text-lg px-10 py-4"
              >
                Criar Conta Gratuita
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-zinc-500 text-sm">
            <p>© 2026 Second Brain. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
