'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PlanBadge } from '@/components/PlanBadge';
import { motion } from 'framer-motion';
import { Crown, Zap, Building2, ArrowRight, Check, AlertCircle, TrendingUp, Calendar, CreditCard } from 'lucide-react';

export default function PlanSettingsPage() {
  const router = useRouter();
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [ideasCount, setIdeasCount] = useState(0);
  const [ideasLimit, setIdeasLimit] = useState(10);
  const [planExpiresAt, setPlanExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    loadUserPlan();
  }, []);

  const loadUserPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/user/plan', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserPlan(data.plan);
        setIdeasCount(data.ideasCount);
        setIdeasLimit(data.ideasLimit);
        setPlanExpiresAt(data.planExpiresAt);
      }
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Zap,
      price: 'R$0',
      period: 'para sempre',
      features: [
        '10 ideias por mês',
        'IA básica',
        'Chat básico',
        'Suporte por email'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      price: 'R$29',
      period: 'por mês',
      features: [
        'Ideias ilimitadas',
        'IA avançada (GPT-4)',
        'Chat ilimitado',
        'Exportar PDF/Markdown',
        'Suporte prioritário'
      ],
      highlighted: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building2,
      price: 'R$99',
      period: 'por mês',
      features: [
        'Tudo do Pro',
        'Equipes ilimitadas',
        'API personalizada',
        'SSO',
        'Suporte 24/7'
      ]
    }
  ];

  const usagePercentage = (ideasCount / ideasLimit) * 100;

  return (
    <DashboardLayout>
      <div className="min-h-screen ui-shell">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 space-y-8">
          
          {/* Header Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Plano e Cobrança
                </h1>
                <p className="text-zinc-400">
                  Gerencie sua assinatura e uso
                </p>
              </div>
            </div>
          </motion.div>

          {/* Current Plan Card Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="ui-card p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">Plano Atual</h2>
                  <PlanBadge plan={userPlan} size="md" />
                </div>
                {planExpiresAt && (
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    Renova em {new Date(planExpiresAt).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
              
              {userPlan !== 'enterprise' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/pricing')}
                  className="ui-btn ui-btn-primary"
                >
                  <TrendingUp className="w-4 h-4" />
                  Fazer Upgrade
                </motion.button>
              )}
            </div>

            {/* Usage Stats Premium */}
            {userPlan === 'free' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">Ideias este mês</span>
                    <span className="text-sm font-semibold text-white">
                      {ideasCount} / {ideasLimit}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full transition-all ${
                        usagePercentage >= 90
                          ? 'bg-gradient-to-r from-red-500 to-orange-500'
                          : usagePercentage >= 70
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                    />
                  </div>
                </div>

                {usagePercentage >= 80 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
                  >
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-400 mb-1">
                        Você está próximo do limite
                      </p>
                      <p className="text-sm text-zinc-300">
                        Faça upgrade para o plano Pro e tenha ideias ilimitadas
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {userPlan !== 'free' && (
              <div className="flex items-center gap-2 text-emerald-400">
                <Check className="w-5 h-5" />
                <span className="text-sm font-medium">✨ Ideias ilimitadas ativadas</span>
              </div>
            )}
          </motion.div>

          {/* Available Plans Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Planos Disponíveis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => {
                const Icon = plan.icon;
                const isCurrent = plan.id === userPlan;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`ui-card p-6 transition-all ${
                      plan.highlighted
                        ? 'border-indigo-500/50'
                        : 'border-zinc-800'
                    } ${isCurrent ? 'ring-2 ring-emerald-500/50' : ''}`}
                  >
                    {/* Icon */}
                    <div className="mb-4">
                      <div className={`inline-flex p-3 rounded-xl ${
                        plan.highlighted 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-500' 
                          : 'bg-zinc-800'
                      }`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Name & Price */}
                    <h3 className="text-xl font-bold text-white mb-1">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-bold text-white">
                        {plan.price}
                      </span>
                      <span className="text-zinc-500 text-sm">
                        {plan.period}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-zinc-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {isCurrent ? (
                      <div className="w-full py-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl text-center text-sm font-semibold border border-emerald-500/30">
                        ✓ Plano Atual
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push(`/pricing`)}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          plan.highlighted
                            ? 'ui-btn ui-btn-primary'
                            : 'ui-btn ui-btn-secondary'
                        }`}
                      >
                        {plan.id === 'free' ? 'Downgrade' : 'Fazer Upgrade'}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Billing History Premium */}
          {userPlan !== 'free' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="ui-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">
                  Histórico de Pagamentos
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                  <div>
                    <p className="text-white font-medium">Plano {userPlan === 'pro' ? 'Pro' : 'Enterprise'} - Mensal</p>
                    <p className="text-sm text-zinc-500">01/05/2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {userPlan === 'pro' ? 'R$29,00' : 'R$99,00'}
                    </p>
                    <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                      Pago
                    </span>
                  </div>
                </div>

                <button className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                  Ver todos os pagamentos
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Cancel Subscription Premium */}
          {userPlan !== 'free' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="ui-card p-8 border-red-500/20"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Cancelar Assinatura
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Você continuará tendo acesso até {planExpiresAt ? new Date(planExpiresAt).toLocaleDateString('pt-BR') : 'o final do período'}
              </p>
              <button className="px-6 py-2.5 bg-red-500/20 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors border border-red-500/30">
                Cancelar Plano
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
