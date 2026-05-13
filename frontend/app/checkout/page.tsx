'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Lock,
  Check,
  ArrowLeft,
  Sparkles,
  Crown,
  Building2,
  Loader2,
  AlertCircle,
  Mail
} from 'lucide-react';
import { API_BASE_URL } from '@/shared/constants/api';
import { useAuth } from '@/contexts/AuthContext';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto' | 'paypal'>('credit_card');
  const [paymentData, setPaymentData] = useState<any>(null);

  const plan = (searchParams.get('plan') || 'pro').toLowerCase();
  const cycle = searchParams.get('cycle') || 'monthly';

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingCycle: cycle as 'monthly' | 'yearly',
    // PIX
    pixEmail: '',
    pixCpf: '',
    // Boleto
    boletoName: '',
    boletoCpf: '',
    boletoAddress: '',
    // PayPal
    paypalEmail: ''
  });

  const planDetails = {
    pro: {
      name: 'Pro',
      icon: Crown,
      price: { monthly: 29, yearly: 290 },
      features: [
        'Ideias ilimitadas',
        '3 milhões de tokens de IA/mês',
        'Chat ilimitado',
        'Exportar PDF/Markdown',
        'Suporte prioritário'
      ],
      tokensMonthly: 3000000,
      tokensYearly: 36000000
    },
    max: {
      name: 'Max',
      icon: Sparkles,
      price: { monthly: 70, yearly: 700 },
      features: [
        'Tudo do Pro',
        '20 milhões de tokens de IA/mês',
        'Prioridade máxima na IA',
        'Modelos avançados',
        'Análises profundas',
        'Suporte VIP'
      ],
      tokensMonthly: 20000000,
      tokensYearly: 240000000
    },
    enterprise: {
      name: 'Enterprise',
      icon: Building2,
      price: { monthly: 99, yearly: 990 },
      features: [
        'Tudo do Max',
        'Tokens ilimitados',
        'Equipes ilimitadas',
        'API personalizada',
        'Suporte 24/7 dedicado'
      ],
      tokensMonthly: -1,
      tokensYearly: -1
    }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.pro;
  const Icon = currentPlan.icon;
  const price = currentPlan.price[formData.billingCycle as keyof typeof currentPlan.price];
  const savings = formData.billingCycle === 'yearly' 
    ? currentPlan.price.monthly * 12 - price 
    : 0;

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login?redirect=/checkout');
    }
  }, [router]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setFormData({ ...formData, cardNumber: formatted });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace('/', '').length <= 4) {
      setFormData({ ...formData, expiryDate: formatted });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setFormData({ ...formData, cvv: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login?redirect=/checkout');
        return;
      }

      // Validações por método de pagamento
      if (paymentMethod === 'credit_card') {
        if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
          setError('Número do cartão inválido');
          setLoading(false);
          return;
        }

        if (formData.expiryDate.length !== 5) {
          setError('Data de validade inválida');
          setLoading(false);
          return;
        }

        if (formData.cvv.length < 3) {
          setError('CVV inválido');
          setLoading(false);
          return;
        }
      } else if (paymentMethod === 'pix') {
        if (!formData.pixEmail || !formData.pixCpf) {
          setError('Preencha todos os campos do PIX');
          setLoading(false);
          return;
        }
      } else if (paymentMethod === 'boleto') {
        if (!formData.boletoName || !formData.boletoCpf || !formData.boletoAddress) {
          setError('Preencha todos os campos do Boleto');
          setLoading(false);
          return;
        }
      } else if (paymentMethod === 'paypal') {
        if (!formData.paypalEmail) {
          setError('Preencha o email do PayPal');
          setLoading(false);
          return;
        }
      }

      // Processar checkout
      console.log('🛒 Enviando checkout:', { plan, billingCycle: formData.billingCycle, paymentMethod });
      
      const response = await fetch(`${API_BASE_URL}/api/purchase/checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan: plan,
          billingCycle: formData.billingCycle,
          paymentMethod: paymentMethod
        })
      });

      console.log('📡 Status da resposta:', response.status, response.statusText);
      
      // Verificar se a resposta tem conteúdo
      const responseText = await response.text();
      console.log('📄 Resposta raw:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ Erro ao parsear JSON:', e);
        setError('Erro ao processar resposta do servidor');
        setLoading(false);
        return;
      }
      
      console.log('📦 Resposta parseada:', data);

      if (response.ok) {
        setSuccess(true);
        setTransactionId(data.purchase.transactionId);
        setPaymentData(data);
        
        // Atualizar dados do usuário do backend
        try {
          await refreshUser();
        } catch (error) {
          console.error('Erro ao atualizar dados do usuário:', error);
          // Não impedir o sucesso mesmo se refreshUser falhar
        }
        
        // Redirecionar após 5 segundos (exceto PIX e Boleto)
        if (paymentMethod === 'credit_card' || paymentMethod === 'paypal') {
          setTimeout(() => {
            router.push('/dashboard');
          }, 5000);
        }
      } else {
        console.error('❌ Erro no checkout:', data);
        const errorMessage = data?.error || data?.message || 'Erro ao processar pagamento';
        console.error('❌ Mensagem de erro:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('❌ Erro de conexão:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen ui-shell flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="ui-card p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-emerald-400" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-3 text-center">
              {paymentData?.paymentMethod === 'boleto' ? 'Boleto Gerado!' : 'Pagamento Confirmado!'} 🎉
            </h1>
            <p className="text-zinc-400 mb-6 text-center">
              {paymentData?.paymentMethod === 'boleto' 
                ? 'Pague o boleto para ativar seu plano'
                : `Seu plano ${currentPlan.name} foi ativado com sucesso`
              }
            </p>

            {/* PIX QR Code */}
            {paymentData?.pix && (
              <div className="bg-zinc-800/50 rounded-xl p-6 mb-6 border border-zinc-700">
                <h3 className="text-lg font-bold text-white mb-4 text-center">
                  Escaneie o QR Code para pagar
                </h3>
                <div className="flex justify-center mb-4">
                  <img 
                    src={paymentData.pix.qrCodeUrl} 
                    alt="QR Code PIX" 
                    className="w-64 h-64 rounded-xl bg-white p-4"
                  />
                </div>
                <div className="bg-zinc-900 rounded-lg p-4 mb-4">
                  <p className="text-xs text-zinc-400 mb-2 text-center">Código PIX Copia e Cola:</p>
                  <p className="text-xs text-white font-mono break-all text-center">
                    {paymentData.pix.qrCode}
                  </p>
                </div>
                <p className="text-sm text-zinc-400 text-center">
                  ⏰ Expira em: {new Date(paymentData.pix.expiresAt).toLocaleTimeString('pt-BR')}
                </p>
              </div>
            )}

            {/* Boleto */}
            {paymentData?.boleto && (
              <div className="bg-zinc-800/50 rounded-xl p-6 mb-6 border border-zinc-700">
                <h3 className="text-lg font-bold text-white mb-4">
                  Dados do Boleto
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-zinc-400">Código de Barras:</p>
                    <p className="text-sm text-white font-mono">{paymentData.boleto.barcodeNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Vencimento:</p>
                    <p className="text-sm text-white">
                      {new Date(paymentData.boleto.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={paymentData.boleto.boletoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ui-btn ui-btn-primary w-full mt-4"
                  >
                    📄 Baixar Boleto
                  </motion.a>
                </div>
              </div>
            )}

            {/* PayPal */}
            {paymentData?.paypal && (
              <div className="bg-zinc-800/50 rounded-xl p-6 mb-6 border border-zinc-700">
                <p className="text-sm text-zinc-300 mb-4 text-center">
                  Você será redirecionado para o PayPal para completar o pagamento
                </p>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={paymentData.paypal.redirectUrl}
                  className="ui-btn ui-btn-primary w-full"
                >
                  Continuar para PayPal
                </motion.a>
              </div>
            )}

            {/* Transaction Details */}
            {paymentData?.paymentMethod !== 'pix' && (
              <div className="bg-zinc-800/50 rounded-xl p-6 mb-6 border border-zinc-700">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <p className="text-sm text-zinc-300">
                    {paymentData?.emailSent 
                      ? 'Comprovante enviado para seu email'
                      : 'Detalhes da transação'
                    }
                  </p>
                </div>
                <div className="text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">ID da Transação:</span>
                    <span className="text-white font-mono text-xs">{transactionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Valor:</span>
                    <span className="text-white font-semibold">R$ {price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Método:</span>
                    <span className="text-white">
                      {paymentData?.paymentMethod === 'credit_card' && 'Cartão de Crédito'}
                      {paymentData?.paymentMethod === 'pix' && 'PIX'}
                      {paymentData?.paymentMethod === 'boleto' && 'Boleto'}
                      {paymentData?.paymentMethod === 'paypal' && 'PayPal'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {(paymentData?.paymentMethod === 'credit_card' || paymentData?.paymentMethod === 'paypal') && (
              <p className="text-sm text-zinc-500 mb-6 text-center">
                Redirecionando para o dashboard...
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/dashboard')}
              className="ui-btn ui-btn-primary w-full"
            >
              Ir para Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ui-shell">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Finalizar Compra</h1>
          </div>
          <p className="text-zinc-400">
            Complete seu pagamento de forma segura
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Billing Cycle */}
              <div className="ui-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Ciclo de Cobrança</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, billingCycle: 'monthly' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.billingCycle === 'monthly'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                    }`}
                  >
                    <p className="text-white font-semibold">Mensal</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      R${currentPlan.price.monthly}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">por mês</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, billingCycle: 'yearly' })}
                    className={`p-4 rounded-xl border-2 transition-all relative ${
                      formData.billingCycle === 'yearly'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                    }`}
                  >
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                      -17%
                    </span>
                    <p className="text-white font-semibold">Anual</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      R${currentPlan.price.yearly}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">por ano</p>
                  </button>
                </div>
              </div>

              {/* Card Details */}
              <div className="ui-card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Método de Pagamento
                </h2>

                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'credit_card'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-white" />
                    <span className="text-sm font-semibold text-white">Cartão</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'pix'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                    }`}
                  >
                    <div className="w-6 h-6 text-white font-bold text-lg">₿</div>
                    <span className="text-sm font-semibold text-white">PIX</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('boleto')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'boleto'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                    }`}
                  >
                    <div className="w-6 h-6 text-white font-bold">📄</div>
                    <span className="text-sm font-semibold text-white">Boleto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'paypal'
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                    }`}
                  >
                    <div className="w-6 h-6 text-white font-bold">P</div>
                    <span className="text-sm font-semibold text-white">PayPal</span>
                  </button>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        className="ui-input font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        value={formData.cardName}
                        onChange={(e) => setFormData({ ...formData, cardName: e.target.value.toUpperCase() })}
                        placeholder="NOME COMPLETO"
                        className="ui-input uppercase"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Validade
                        </label>
                        <input
                          type="text"
                          value={formData.expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/AA"
                          className="ui-input font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={formData.cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          className="ui-input font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PIX Form */}
                {paymentMethod === 'pix' && (
                  <div className="space-y-4">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-4">
                      <p className="text-sm text-indigo-300">
                        ⚡ Pagamento instantâneo! Após confirmar, você receberá um QR Code para pagar.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.pixEmail}
                        onChange={(e) => setFormData({ ...formData, pixEmail: e.target.value })}
                        placeholder="seu@email.com"
                        className="ui-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={formData.pixCpf}
                        onChange={(e) => setFormData({ ...formData, pixCpf: e.target.value })}
                        placeholder="000.000.000-00"
                        className="ui-input"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Boleto Form */}
                {paymentMethod === 'boleto' && (
                  <div className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
                      <p className="text-sm text-yellow-300">
                        📄 O boleto será gerado após a confirmação. Prazo de compensação: 1-3 dias úteis.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={formData.boletoName}
                        onChange={(e) => setFormData({ ...formData, boletoName: e.target.value })}
                        placeholder="Nome completo"
                        className="ui-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={formData.boletoCpf}
                        onChange={(e) => setFormData({ ...formData, boletoCpf: e.target.value })}
                        placeholder="000.000.000-00"
                        className="ui-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Endereço Completo
                      </label>
                      <input
                        type="text"
                        value={formData.boletoAddress}
                        onChange={(e) => setFormData({ ...formData, boletoAddress: e.target.value })}
                        placeholder="Rua, número, bairro, cidade - UF"
                        className="ui-input"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* PayPal Form */}
                {paymentMethod === 'paypal' && (
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                      <p className="text-sm text-blue-300">
                        💳 Você será redirecionado para o PayPal para completar o pagamento.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Email do PayPal
                      </label>
                      <input
                        type="email"
                        value={formData.paypalEmail}
                        onChange={(e) => setFormData({ ...formData, paypalEmail: e.target.value })}
                        placeholder="seu@email.com"
                        className="ui-input"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full ui-btn ui-btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" />
                    {paymentMethod === 'credit_card' && `Pagar R$ ${price.toFixed(2)}`}
                    {paymentMethod === 'pix' && `Gerar QR Code PIX`}
                    {paymentMethod === 'boleto' && `Gerar Boleto`}
                    {paymentMethod === 'paypal' && `Pagar com PayPal`}
                  </span>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                <Lock className="w-3 h-3" />
                <span>Pagamento 100% seguro e criptografado</span>
              </div>

              {paymentMethod === 'pix' && (
                <p className="text-center text-xs text-zinc-400">
                  ⚡ Aprovação instantânea após o pagamento
                </p>
              )}

              {paymentMethod === 'boleto' && (
                <p className="text-center text-xs text-zinc-400">
                  📄 Compensação em até 3 dias úteis
                </p>
              )}
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="ui-card p-8 sticky top-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Plano {currentPlan.name}</h2>
                  <p className="text-zinc-400 text-sm">
                    {formData.billingCycle === 'monthly' ? 'Cobrança mensal' : 'Cobrança anual'}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6 pb-6 border-b border-zinc-700">
                {currentPlan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </div>
                ))}
                
                {/* Tokens Info */}
                {currentPlan.tokensMonthly !== -1 && (
                  <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <p className="text-sm font-semibold text-indigo-300 mb-1">
                      🚀 Tokens de IA
                    </p>
                    <p className="text-xs text-zinc-400">
                      {formData.billingCycle === 'monthly' 
                        ? `${(currentPlan.tokensMonthly / 1000000).toFixed(0)} milhões/mês`
                        : `${(currentPlan.tokensYearly / 1000000).toFixed(0)} milhões/ano (12x mais!)`
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>R$ {price.toFixed(2)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Economia anual</span>
                    <span>-R$ {savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-zinc-700 flex justify-between">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-white font-bold text-2xl">
                    R$ {price.toFixed(2)}
                  </span>
                </div>
              </div>

              {formData.billingCycle === 'yearly' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-sm text-emerald-400 font-semibold">
                    💰 Você está economizando R$ {savings.toFixed(2)} por ano!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen ui-shell flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
