'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Check,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Loader2,
  AlertCircle,
  TrendingUp,
  Lock,
  Mail
} from 'lucide-react';
import { API_BASE_URL } from '@/shared/constants/api';

export default function BuyCreditsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto' | 'paypal'>('credit_card');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [purchaseData, setPurchaseData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    loadPackages();
  }, [router]);

  const loadPackages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/credits/packages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages);
        setUserStats({
          currentTokens: data.currentTokens,
          remainingTokens: data.remainingTokens,
          maxTokens: data.maxTokens,
          tokensUsed: data.tokensUsed
        });
      }
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
    } finally {
      setPackagesLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      setError('Selecione um pacote');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/credits/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          package: selectedPackage,
          paymentMethod: paymentMethod
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setPurchaseData(data);
        
        // Redirecionar após 5 segundos (exceto PIX e Boleto)
        if (paymentMethod === 'credit_card' || paymentMethod === 'paypal') {
          setTimeout(() => {
            router.push('/settings');
          }, 5000);
        }
      } else {
        setError(data.message || data.error || 'Erro ao processar compra');
      }
    } catch (err) {
      console.error('Erro na compra:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (success && purchaseData) {
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
              Créditos Adicionados! 🎉
            </h1>
            <p className="text-zinc-400 mb-6 text-center">
              {purchaseData.purchase.tokens.toLocaleString()} tokens foram adicionados à sua conta
            </p>

            <div className="bg-zinc-800/50 rounded-xl p-6 mb-6 border border-zinc-700">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-indigo-400" />
                <p className="text-sm text-zinc-300">
                  Detalhes da compra
                </p>
              </div>
              <div className="text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Pacote:</span>
                  <span className="text-white font-semibold">{purchaseData.purchase.package}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Tokens:</span>
                  <span className="text-white font-semibold">{purchaseData.purchase.tokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Valor:</span>
                  <span className="text-white font-semibold">R$ {purchaseData.purchase.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Novo Total:</span>
                  <span className="text-emerald-400 font-bold">{purchaseData.newTokensLimit.toLocaleString()} tokens</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/settings')}
              className="ui-btn ui-btn-primary w-full"
            >
              Ir para Configurações
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
            <Zap className="w-8 h-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Comprar Créditos</h1>
          </div>
          <p className="text-zinc-400">
            Adicione mais tokens de IA à sua conta (limite máximo: 1 bilhão)
          </p>
        </motion.div>

        {/* User Stats */}
        {userStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="ui-card p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-zinc-400 mb-1">Tokens Atuais</p>
                <p className="text-2xl font-bold text-white">
                  {userStats.currentTokens.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Tokens Restantes</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {userStats.remainingTokens === Infinity ? '∞' : userStats.remainingTokens.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400 mb-1">Limite Máximo</p>
                <p className="text-2xl font-bold text-zinc-500">
                  {userStats.maxTokens.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Packages */}
        {packagesLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => pkg.canPurchase && setSelectedPackage(pkg.id)}
                className={`ui-card p-6 cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : pkg.canPurchase
                    ? 'border-zinc-700 hover:border-zinc-600'
                    : 'border-zinc-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  {selectedPackage === pkg.id && (
                    <Check className="w-6 h-6 text-indigo-400" />
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-white mb-1">
                    {(pkg.tokens / 1000000).toFixed(0)}M
                  </p>
                  <p className="text-sm text-zinc-400">tokens</p>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-emerald-400">
                    R$ {pkg.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    R$ {pkg.pricePerMillion}/milhão
                  </p>
                </div>

                {!pkg.canPurchase && (
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Excede limite máximo</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Payment Method */}
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ui-card p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">Método de Pagamento</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'credit_card', label: 'Cartão', icon: '💳' },
                { id: 'pix', label: 'PIX', icon: '⚡' },
                { id: 'boleto', label: 'Boleto', icon: '📄' },
                { id: 'paypal', label: 'PayPal', icon: 'P' }
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === method.id
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-sm font-semibold text-white">{method.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-8"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Purchase Button */}
        {selectedPackage && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={handlePurchase}
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
                Comprar Créditos
              </span>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
