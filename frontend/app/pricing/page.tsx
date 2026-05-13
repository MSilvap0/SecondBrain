'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building2, ArrowRight, Sparkles, X } from 'lucide-react';
import { API_BASE_URL } from '@/shared/constants/api';

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      window.location.href = '/login';
      return;
    }

    // Carregar nome do usuário
    const userData = JSON.parse(user);
    setUserName(userData.name);

    // Carregar plano atual
    loadCurrentPlan();
  }, []);

  const loadCurrentPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/plan`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentPlan(data.plan);
      }
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
    }
  };

  const plans = [
    {
      name: 'Free',
      icon: Zap,
      price: { monthly: 0, yearly: 0 },
      description: 'Para começar sua jornada',
      features: [
        '10 ideias por mês',
        'IA básica para expandir ideias',
        'Chat com suas ideias',
        'Organização por tags',
        'Suporte por email'
      ],
      limitations: [
        'Sem histórico de chat',
        'Sem exportação',
        'Sem prioridade no suporte'
      ],
      cta: 'Plano Atual',
      highlighted: false,
      planId: 'free'
    },
    {
      name: 'Pro',
      icon: Crown,
      price: { monthly: 29, yearly: 290 },
      description: 'Para profissionais produtivos',
      features: [
        'Ideias ilimitadas',
        billingCycle === 'monthly' ? '3 milhões de tokens/mês' : '36 milhões de tokens/ano',
        'Chat ilimitado',
        'Histórico completo',
        'Exportar em PDF/Markdown',
        'Temas personalizados',
        'Suporte prioritário',
        'Sem anúncios'
      ],
      limitations: [],
      cta: 'Começar Teste Grátis',
      highlighted: false,
      planId: 'pro'
    },
    {
      name: 'Max',
      icon: Sparkles,
      price: { monthly: 70, yearly: 700 },
      description: 'Máximo poder de IA',
      features: [
        'Tudo do Pro',
        billingCycle === 'monthly' ? '20 milhões de tokens/mês' : '240 milhões de tokens/ano',
        'Prioridade máxima na IA',
        'Modelos avançados',
        'Análises profundas',
        'Suporte VIP',
        'Acesso antecipado a recursos'
      ],
      limitations: [],
      cta: 'Começar Teste Grátis',
      highlighted: true,
      planId: 'max',
      badge: 'Mais Popular'
    },
    {
      name: 'Enterprise',
      icon: Building2,
      price: { monthly: 99, yearly: 990 },
      description: 'Para equipes e empresas',
      features: [
        'Tudo do Max',
        'Tokens ilimitados',
        'Equipes ilimitadas',
        'SSO e autenticação avançada',
        'API personalizada',
        'Integração com Slack/Teams',
        'Gerenciamento de usuários',
        'Suporte dedicado 24/7',
        'SLA garantido',
        'Treinamento personalizado'
      ],
      limitations: [],
      cta: 'Falar com Vendas',
      highlighted: false,
      planId: 'enterprise'
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      if (currentPlan === 'free') {
        window.location.href = '/dashboard';
        return;
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/plan/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: 'free',
          planExpiresAt: null,
        }),
      });
      
      if (response.ok) {
        setCurrentPlan('free');
        window.location.href = '/dashboard';
      }
      return;
    } else if (planId === 'enterprise') {
      window.location.href = 'mailto:sales@secondbrain.com?subject=Enterprise Plan Interest';
      return;
    }

    window.location.href = `/checkout?plan=${planId}&cycle=${billingCycle}`;
  };

  return (
    <div className="min-h-screen ui-shell">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <div className="relative border-b border-zinc-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center gap-2 text-white font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
          >
            <Sparkles className="w-6 h-6" />
            SecondBrain
          </button>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm">
              Olá, <span className="text-white font-semibold">{userName}</span>
            </span>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="text-zinc-400 hover:text-white text-sm transition-colors"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Crown className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Plano atual: {currentPlan.toUpperCase()}</span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            Escolha o plano perfeito
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              para suas ideias
            </span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Desbloqueie todo o potencial da IA para organizar e expandir suas ideias
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 ui-card p-1.5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                -17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
            const isCurrentPlan = currentPlan === plan.planId;

            return (
              <motion.div
                key={plan.planId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ui-card p-8 transition-all ${
                  plan.highlighted
                    ? 'border-indigo-500/50 shadow-2xl shadow-indigo-500/20 scale-105'
                    : 'border-zinc-800'
                } ${isCurrentPlan ? 'ring-2 ring-emerald-500/50' : ''}`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      Ativo
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-6">
                  <div className={`inline-flex p-3 rounded-xl ${
                    plan.highlighted 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500' 
                      : 'bg-zinc-800'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-zinc-400 text-sm mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">
                      R${price}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-zinc-500">
                        /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                      </span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                    <p className="text-sm text-emerald-400 mt-2">
                      💰 Economize R${plan.price.monthly * 12 - price} por ano
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: isCurrentPlan ? 1 : 1.02 }}
                  whileTap={{ scale: isCurrentPlan ? 1 : 0.98 }}
                  onClick={() => handleSelectPlan(plan.planId)}
                  disabled={isCurrentPlan}
                  className={`w-full ui-btn mb-8 ${
                    isCurrentPlan
                      ? 'bg-emerald-500/20 text-emerald-400 cursor-default border-emerald-500/30'
                      : plan.highlighted
                        ? 'ui-btn-primary'
                        : 'ui-btn-secondary'
                  }`}
                >
                  {isCurrentPlan ? 'Plano Atual' : plan.cta}
                  {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
                </motion.button>

                {/* Features */}
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Incluído
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-zinc-300 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <>
                      <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mt-6">
                        Limitações
                      </p>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <X className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                            <span className="text-zinc-500 text-sm">
                              {limitation}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Posso mudar de plano depois?',
                a: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. Se fizer upgrade, você será cobrado proporcionalmente.'
              },
              {
                q: 'Como funciona o teste grátis?',
                a: 'O plano Pro oferece 14 dias de teste grátis. Você não será cobrado até o final do período de teste.'
              },
              {
                q: 'Posso cancelar a qualquer momento?',
                a: 'Sim, você pode cancelar sua assinatura a qualquer momento. Você continuará tendo acesso até o final do período pago.'
              },
              {
                q: 'Quais formas de pagamento são aceitas?',
                a: 'Aceitamos cartões de crédito (Visa, Mastercard, American Express) e PIX para pagamentos anuais.'
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="ui-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-zinc-400">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="ui-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ainda tem dúvidas?
              </h2>
              <p className="text-zinc-400 mb-8">
                Nossa equipe está pronta para ajudar você a escolher o melhor plano
              </p>
              <button
                onClick={() => window.location.href = 'mailto:support@secondbrain.com'}
                className="ui-btn ui-btn-primary px-8 py-3"
              >
                Falar com Suporte
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
