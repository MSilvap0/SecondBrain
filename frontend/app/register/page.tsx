"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { API_BASE_URL, API_ENDPOINTS } from '@/shared/constants/api';

export default function RegisterPage() {
  const router = useRouter();
  const { error: showError, success: showSuccess } = useToast();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const totalSteps = 4;

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar conta');
      }

      setSuccess('Código de verificação enviado para seu email!');
      showSuccess('Código enviado', 'Verifique seu email');
      setStep(4); // Move to verification step
    } catch (err: any) {
      const msg = err?.message || 'Erro ao criar conta';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Código inválido');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setSuccess('Email verificado com sucesso! Redirecionando para escolha de plano...');
      showSuccess('Verificado', 'Bem-vindo!');
      setTimeout(() => {
        window.location.href = '/onboarding';
      }, 1000);
    } catch (err: any) {
      const msg = err?.message || 'Erro ao verificar código';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !name.trim()) {
      setError('Por favor, digite seu nome');
      showError('Por favor, digite seu nome');
      return;
    }
    if (step === 2 && !email.trim()) {
      setError('Por favor, digite seu email');
      showError('Por favor, digite seu email');
      return;
    }
    if (step === 3 && password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      showError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    setError('');
    
    if (step === 3) {
      // Register user and send verification email
      handleRegister();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen ui-shell flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Card */}
          <div className="ui-card p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Criar conta</h1>
              <p className="text-zinc-400">Passo {step} de {totalSteps}</p>
            </div>

            <div className="mb-6">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div 
                    key={s} 
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      s <= step 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                        : 'bg-zinc-800'
                    }`} 
                  />
                ))}
              </div>
            </div>

            <form onSubmit={step === 4 ? handleVerification : (e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <div key="step1" className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">Como devemos te chamar?</h2>
                      <p className="text-sm text-slate-400 mb-4">Vamos começar com o básico</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Nome completo</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="ui-input" placeholder="João Silva" autoFocus />
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

                    <button type="button" onClick={nextStep} className="ui-btn ui-btn-primary w-full inline-flex items-center justify-center gap-2">Continuar <ArrowRight className="w-4 h-4" /></button>
                  </div>
                )}

                {step === 2 && (
                  <div key="step2" className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">Qual seu email, <span className="text-blue-400">{name.split(' ')[0]}</span>?</h2>
                      <p className="text-sm text-slate-400 mb-4">Usaremos para enviar atualizações</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ui-input" placeholder="joao@email.com" autoFocus />
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

                    <div className="flex gap-3">
                      <button type="button" onClick={prevStep} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-semibold">Voltar</button>
                      <button type="button" onClick={nextStep} className="flex-1 ui-btn ui-btn-primary">Continuar</button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div key="step3" className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">Crie uma senha segura</h2>
                      <p className="text-sm text-slate-400 mb-4">Mínimo de 6 caracteres</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="ui-input" placeholder="••••••••" minLength={6} autoFocus />
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

                    <div className="flex gap-3">
                      <button type="button" onClick={prevStep} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-semibold">Voltar</button>
                      <button type="button" onClick={nextStep} disabled={loading} className="flex-1 ui-btn ui-btn-primary disabled:opacity-50">{loading ? 'Criando...' : 'Continuar'}</button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div key="step4" className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">Verifique seu email</h2>
                      <p className="text-sm text-slate-400 mb-4">Enviamos um código de 6 dígitos para <span className="text-blue-400 font-medium">{email}</span></p>
                    </div>

                    {success && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2"><Check className="w-4 h-4" />{success}</div>}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Código de verificação</label>
                      <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="ui-input text-center text-2xl font-mono tracking-widest" placeholder="000000" maxLength={6} autoFocus />
                      <p className="text-slate-400 text-xs mt-2 text-center">Digite o código de 6 dígitos</p>
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

                    <button type="submit" disabled={loading || verificationCode.length !== 6} className="ui-btn ui-btn-primary w-full">{loading ? 'Verificando...' : 'Verificar e criar conta'}</button>

                    <div className="text-center">
                      <button type="button" onClick={() => handleRegister()} disabled={loading} className="text-sm text-slate-400 hover:text-slate-200">Não recebeu o código? <span className="text-blue-400 font-semibold">Reenviar</span></button>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-400">
                Já tem uma conta?{' '}
                <button onClick={() => router.push('/login')} className="ui-link font-semibold">
                  Fazer login
                </button>
              </p>
            </div>
          </div>

          {/* Info Panel */}
          <div className="hidden lg:flex flex-col justify-between p-8 ui-card">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-indigo-300">SecondBrain</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white leading-tight mb-4">
                Seu segundo cérebro para ideias brilhantes
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Capture, organize e expanda suas ideias com o poder da inteligência artificial
              </p>

              {/* Features List */}
              <div className="space-y-4">
                {[
                  'IA avançada para expandir ideias',
                  'Organização inteligente com tags',
                  'Interface limpa e intuitiva',
                  'Sincronização em tempo real'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-800">
              <div>
                <div className="text-2xl font-bold text-white">10k+</div>
                <div className="text-xs text-zinc-400">Usuários</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">50k+</div>
                <div className="text-xs text-zinc-400">Ideias</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-xs text-zinc-400">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
