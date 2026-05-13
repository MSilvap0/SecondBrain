'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Mail,
  Save,
  Check,
  Key,
  Sparkles,
  Crown,
  CreditCard,
  TrendingUp,
  Zap,
  Calendar,
  Activity,
  BarChart3,
  Clock,
  Plus,
  Trash2,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import { API_BASE_URL } from '@/shared/constants/api';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'ai-usage' | 'plan' | 'payment'>('profile');
  const [saved, setSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState('');
  
  // Profile Settings
  const [settings, setSettings] = useState({
    name: 'João Silva',
    email: 'joao@example.com',
    notifications: {
      email: true,
      push: false,
      weekly: true
    },
    theme: 'dark',
    language: 'pt-BR'
  });

  // AI Usage Stats
  const [aiUsage, setAiUsage] = useState({
    totalRequests: 1247,
    tokensUsed: 45230,
    tokensLimit: 100000,
    ideasExpanded: 89,
    chatMessages: 342,
    lastReset: '2026-05-01',
    nextReset: '2026-06-01'
  });

  // Plan Info
  const [planInfo, setPlanInfo] = useState({
    currentPlan: 'pro' as 'free' | 'pro' | 'max' | 'enterprise',
    billingCycle: 'monthly' as 'monthly' | 'yearly',
    price: 29,
    renewsAt: '2026-06-03',
    ideasCount: 89,
    ideasLimit: -1 // -1 = unlimited
  });

  // Payment Methods (mockado - será implementado com gateway real)
  const [paymentMethods] = useState<Array<{
    id: string;
    type: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
  }>>([]);

  // Billing History
  const [billingHistory, setBillingHistory] = useState<Array<{
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
  }>>([]);

  useEffect(() => {
    loadUserData();
    loadPurchaseHistory();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      // Buscar dados reais da API
      const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Atualizar profile
        setSettings(prev => ({
          ...prev,
          name: data.profile.name,
          email: data.profile.email
        }));

        // Atualizar AI Usage com dados reais
        setAiUsage({
          totalRequests: data.aiUsage.totalRequests,
          tokensUsed: data.aiUsage.tokensUsed,
          tokensLimit: data.aiUsage.tokensLimit,
          ideasExpanded: data.aiUsage.ideasExpanded,
          chatMessages: data.aiUsage.chatMessages,
          lastReset: data.aiUsage.lastReset,
          nextReset: data.aiUsage.nextReset
        });

        // Atualizar Plan Info com dados reais
        setPlanInfo({
          currentPlan: data.plan.currentPlan,
          billingCycle: 'monthly',
          price: data.plan.currentPlan === 'pro' ? 29 : data.plan.currentPlan === 'max' ? 70 : data.plan.currentPlan === 'enterprise' ? 99 : 0,
          renewsAt: data.plan.planExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          ideasCount: data.plan.ideasCount,
          ideasLimit: data.plan.ideasLimit
        });

        console.log('✅ Dados do usuário carregados:', data);
        console.log('📊 Plan Info:', {
          currentPlan: data.plan.currentPlan,
          ideasLimit: data.plan.ideasLimit,
          ideasCount: data.plan.ideasCount
        });
      } else {
        console.error('Erro ao carregar dados do usuário');
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const loadPurchaseHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/purchase/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Mapear compras para o formato esperado
        const mappedHistory = data.purchases.map((p: any) => ({
          id: p.id,
          date: new Date(p.date).toISOString().split('T')[0],
          amount: p.amount,
          status: p.status === 'completed' ? 'paid' : p.status,
          description: `Plano ${p.plan} - ${p.billingCycle === 'monthly' ? 'Mensal' : 'Anual'}`
        }));

        setBillingHistory(mappedHistory);
        console.log('✅ Histórico de compras carregado:', mappedHistory);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: settings.name,
          email: settings.email
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Atualizar localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.name = data.user.name;
        user.email = data.user.email;
        localStorage.setItem('user', JSON.stringify(user));

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleRequestPasswordReset = async () => {
    setPasswordResetLoading(true);
    setPasswordResetError('');
    setPasswordResetSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/password-reset/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: settings.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordResetSuccess(true);
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordResetSuccess(false);
        }, 3000);
      } else {
        setPasswordResetError(data.error || 'Erro ao solicitar reset de senha');
      }
    } catch (error) {
      setPasswordResetError('Erro ao conectar com o servidor');
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Perfil', icon: User },
    { id: 'ai-usage' as const, label: 'Uso da IA', icon: Sparkles },
    { id: 'plan' as const, label: 'Plano', icon: Crown },
    { id: 'payment' as const, label: 'Pagamento', icon: CreditCard }
  ];

  const tokensPercentage = aiUsage.tokensLimit === -1 ? 0 : (aiUsage.tokensUsed / aiUsage.tokensLimit) * 100;

  return (
    <DashboardLayout>
      <div className="min-h-screen ui-shell">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 space-y-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Configurações
            </h1>
            <p className="text-zinc-400">
              Gerencie sua conta, uso e preferências
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 overflow-x-auto pb-2"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Info */}
                <div className="ui-card p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Informações Pessoais</h2>
                      <p className="text-zinc-400 text-sm">Atualize seus dados</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Nome completo
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        className="ui-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="ui-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="ui-card p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Notificações</h2>
                      <p className="text-zinc-400 text-sm">Configure como quer ser notificado</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { key: 'email', icon: Mail, label: 'Notificações por email', desc: 'Receba atualizações por email' },
                      { key: 'push', icon: Bell, label: 'Notificações push', desc: 'Receba notificações no navegador' },
                      { key: 'weekly', icon: Calendar, label: 'Resumo semanal', desc: 'Receba um resumo das suas ideias' }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <label key={item.key} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors border border-zinc-700">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-zinc-400" />
                            <div>
                              <p className="text-white font-medium">{item.label}</p>
                              <p className="text-zinc-500 text-sm">{item.desc}</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, [item.key]: e.target.checked }
                            })}
                            className="w-5 h-5 rounded border-zinc-600 bg-zinc-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Security */}
                <div className="ui-card p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Segurança</h2>
                      <p className="text-zinc-400 text-sm">Proteja sua conta</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors text-left border border-zinc-700"
                    >
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-zinc-400" />
                        <div>
                          <p className="text-white font-medium">Alterar senha</p>
                          <p className="text-zinc-500 text-sm">Receba um link por email para redefinir</p>
                        </div>
                      </div>
                      <span className="text-zinc-500">→</span>
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-4">
                  {saved && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 text-emerald-400"
                    >
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Salvo com sucesso!</span>
                    </motion.div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="ui-btn ui-btn-primary px-8 py-3"
                  >
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                  </motion.button>
                </div>
              </div>
            )}

            {/* AI USAGE TAB */}
            {activeTab === 'ai-usage' && (
              <div className="space-y-6">
                {/* Low Credits Warning */}
                {aiUsage.tokensLimit !== -1 && tokensPercentage >= 80 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ui-card p-6 border-yellow-500/20 bg-yellow-500/5"
                  >
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-yellow-400 mb-2">
                          {tokensPercentage >= 95 ? 'Créditos Quase Esgotados!' : 'Atenção: Créditos Baixos'}
                        </h3>
                        <p className="text-zinc-300 mb-4">
                          Você já usou {tokensPercentage.toFixed(1)}% dos seus tokens. 
                          {tokensPercentage >= 95 
                            ? ' Compre mais créditos para continuar usando a IA sem interrupções.'
                            : ' Considere comprar mais créditos para não ficar sem.'
                          }
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => window.location.href = '/buy-credits'}
                          className="ui-btn ui-btn-primary"
                        >
                          <Zap className="w-4 h-4" />
                          Comprar Créditos
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Usage Overview */}
                <div className="ui-card p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Uso da IA</h2>
                      <p className="text-zinc-400 text-sm">Acompanhe seu consumo de IA</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Requisições', value: aiUsage.totalRequests.toLocaleString(), icon: Activity, color: 'indigo' },
                      { label: 'Ideias Expandidas', value: aiUsage.ideasExpanded, icon: Zap, color: 'purple' },
                      { label: 'Mensagens de Chat', value: aiUsage.chatMessages, icon: Mail, color: 'violet' },
                      { label: 'Tokens Usados', value: aiUsage.tokensUsed.toLocaleString(), icon: BarChart3, color: 'pink' }
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
                          <div className="flex items-center justify-between mb-3">
                            <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                          </div>
                          <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                          <p className="text-sm text-zinc-400">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Tokens Usage Bar */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-semibold">Tokens Utilizados</p>
                          <p className="text-sm text-zinc-400">Limite mensal do seu plano</p>
                        </div>
                        <span className="text-white font-bold">
                          {aiUsage.tokensUsed.toLocaleString()} / {aiUsage.tokensLimit === -1 ? '∞' : aiUsage.tokensLimit.toLocaleString()}
                        </span>
                      </div>
                      {aiUsage.tokensLimit !== -1 && (
                        <>
                          <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(tokensPercentage, 100)}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                tokensPercentage >= 90
                                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                  : tokensPercentage >= 70
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                              }`}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
                            <span>0</span>
                            <span>{tokensPercentage.toFixed(1)}% usado</span>
                            <span>{aiUsage.tokensLimit.toLocaleString()}</span>
                          </div>
                        </>
                      )}
                      {aiUsage.tokensLimit === -1 && (
                        <div className="flex items-center gap-2 text-emerald-400 mt-2">
                          <Check className="w-5 h-5" />
                          <span className="text-sm font-medium">✨ Tokens ilimitados ativados</span>
                        </div>
                      )}
                    </div>

                    {tokensPercentage >= 80 && aiUsage.tokensLimit !== -1 && (
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
                            Considere fazer upgrade para continuar usando a IA sem interrupções
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Billing Cycle */}
                <div className="ui-card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Ciclo de Cobrança</h2>
                        <p className="text-zinc-400 text-sm">Período de uso atual</p>
                      </div>
                    </div>
                    
                    {aiUsage.tokensLimit !== -1 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/buy-credits'}
                        className="ui-btn ui-btn-primary"
                      >
                        <Zap className="w-4 h-4" />
                        Comprar Créditos
                      </motion.button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
                      <p className="text-sm text-zinc-400 mb-2">Início do Período</p>
                      <p className="text-2xl font-bold text-white">
                        {new Date(aiUsage.lastReset).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
                      <p className="text-sm text-zinc-400 mb-2">Próxima Renovação</p>
                      <p className="text-2xl font-bold text-white">
                        {new Date(aiUsage.nextReset).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PLAN TAB */}
            {activeTab === 'plan' && (
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="ui-card p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Plano Atual</h2>
                        <p className="text-zinc-400 text-sm">
                          Plano {planInfo.currentPlan === 'pro' ? 'Pro' : planInfo.currentPlan === 'max' ? 'Max' : planInfo.currentPlan === 'enterprise' ? 'Enterprise' : 'Free'}
                        </p>
                      </div>
                    </div>
                    
                    {planInfo.currentPlan !== 'enterprise' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/pricing'}
                        className="ui-btn ui-btn-primary"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Fazer Upgrade
                      </motion.button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
                      <p className="text-sm text-zinc-400 mb-2">Valor Mensal</p>
                      <p className="text-3xl font-bold text-white">R${planInfo.price}</p>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
                      <p className="text-sm text-zinc-400 mb-2">Próxima Cobrança</p>
                      <p className="text-xl font-bold text-white">
                        {new Date(planInfo.renewsAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
                      <p className="text-sm text-zinc-400 mb-2">Ideias</p>
                      <p className="text-3xl font-bold text-white">
                        {planInfo.ideasLimit === -1 ? '∞' : `${planInfo.ideasCount}/${planInfo.ideasLimit}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="ui-card p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Recursos do Seu Plano</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Ideias ilimitadas',
                      'IA avançada (GPT-4)',
                      'Chat ilimitado',
                      'Exportar PDF/Markdown',
                      'Suporte prioritário',
                      'Sem anúncios'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT TAB */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                {/* Payment Methods */}
                <div className="ui-card p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Métodos de Pagamento</h2>
                        <p className="text-zinc-400 text-sm">Gerencie seus cartões</p>
                      </div>
                    </div>
                  </div>

                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                      <p className="text-zinc-400 mb-4">Nenhum método de pagamento cadastrado</p>
                      <p className="text-sm text-zinc-500">
                        Os métodos de pagamento serão salvos automaticamente na primeira compra
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <p className="text-white font-semibold">
                                  {method.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {method.last4}
                                </p>
                                {method.isDefault && (
                                  <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full">
                                    Padrão
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-zinc-400">
                                Expira em {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!method.isDefault && (
                              <button className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                                Tornar padrão
                              </button>
                            )}
                            <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Billing History */}
                <div className="ui-card p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Histórico de Pagamentos</h2>
                      <p className="text-zinc-400 text-sm">Últimas transações</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {billingHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-zinc-400">Nenhuma compra realizada ainda</p>
                      </div>
                    ) : (
                      billingHistory.map((bill) => (
                        <div key={bill.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                          <div>
                            <p className="text-white font-medium">{bill.description}</p>
                            <p className="text-sm text-zinc-400">
                              {new Date(bill.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <p className="text-white font-semibold">
                              R${bill.amount.toFixed(2)}
                            </p>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              bill.status === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : bill.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {bill.status === 'paid' ? 'Pago' : bill.status === 'pending' ? 'Pendente' : 'Falhou'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <button className="mt-4 text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                    Ver todos os pagamentos
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </div>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !passwordResetLoading && setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="ui-card p-8 max-w-md w-full"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPasswordModal(false)}
                disabled={passwordResetLoading}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Alterar Senha</h2>
                  <p className="text-zinc-400 text-sm">Enviaremos um link por email</p>
                </div>
              </div>

              {passwordResetSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Email Enviado!</h3>
                  <p className="text-zinc-400">
                    Verifique sua caixa de entrada em <span className="text-white font-medium">{settings.email}</span>
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Content */}
                  <div className="space-y-4 mb-6">
                    <p className="text-zinc-300">
                      Enviaremos um link de redefinição de senha para:
                    </p>
                    
                    <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-indigo-400" />
                        <span className="text-white font-medium">{settings.email}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-400 font-semibold mb-1">
                          Atenção
                        </p>
                        <p className="text-sm text-zinc-300">
                          O link expira em 1 hora. Verifique também sua pasta de spam.
                        </p>
                      </div>
                    </div>

                    {passwordResetError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-400">{passwordResetError}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPasswordModal(false)}
                      disabled={passwordResetLoading}
                      className="flex-1 ui-btn ui-btn-secondary py-3 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleRequestPasswordReset}
                      disabled={passwordResetLoading}
                      className="flex-1 ui-btn ui-btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordResetLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Enviando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Mail className="w-5 h-5" />
                          Enviar Link
                        </span>
                      )}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
