'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AnimatedButton } from '@/components/animated/AnimatedButton';
import { AnimatedCard, AnimatedClickableCard } from '@/components/animated/AnimatedCard';
import { AnimatedPage, AnimatedSection, StaggerContainer, StaggerItem } from '@/components/animated/AnimatedPage';
import { AnimatedInput } from '@/components/animated/AnimatedInput';
import { AnimatedIcon, AnimatedIconBox, AnimatedLoadingIcon } from '@/components/animated/AnimatedIcon';
import { useToast } from '@/hooks/useToast';
import { ToastContainer, AnimatedToast } from '@/components/animated/AnimatedToast';
import {
  Sparkles,
  Save,
  Trash2,
  Heart,
  Star,
  Zap,
  Mail,
  Lock,
  User,
  Loader
} from 'lucide-react';

export default function AnimationsDemoPage() {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, success, error, warning, info, removeToast } = useToast();

  const handleAction = (type: string) => {
    switch (type) {
      case 'success':
        success('Operação bem-sucedida!', 'Seus dados foram salvos com sucesso');
        break;
      case 'error':
        error('Erro ao processar', 'Não foi possível completar a operação');
        break;
      case 'warning':
        warning('Atenção necessária', 'Verifique os dados antes de continuar');
        break;
      case 'info':
        info('Informação', 'Esta é uma mensagem informativa');
        break;
    }
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      success('Concluído!', 'Operação finalizada');
    }, 3000);
  };

  return (
    <DashboardLayout>
      <AnimatedPage>
        <div className="p-8 space-y-12">
          {/* Header */}
          <AnimatedSection delay={0}>
            <div className="flex items-center gap-3 mb-2">
              <AnimatedIconBox gradient="from-indigo-500/20 to-purple-500/20">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </AnimatedIconBox>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Demonstração de Animações
                </h1>
                <p className="text-slate-400 text-lg">
                  Explore todas as microinterações premium
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Buttons Section */}
          <AnimatedSection delay={0.1}>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Botões Animados</h2>
              <div className="flex flex-wrap gap-4">
                <AnimatedButton
                  variant="primary"
                  icon={<Save className="w-4 h-4" />}
                  onClick={() => handleAction('success')}
                >
                  Primary Button
                </AnimatedButton>

                <AnimatedButton
                  variant="secondary"
                  icon={<Star className="w-4 h-4" />}
                >
                  Secondary Button
                </AnimatedButton>

                <AnimatedButton
                  variant="ghost"
                  icon={<Zap className="w-4 h-4" />}
                >
                  Ghost Button
                </AnimatedButton>

                <AnimatedButton
                  variant="danger"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleAction('error')}
                >
                  Danger Button
                </AnimatedButton>

                <AnimatedButton
                  variant="primary"
                  loading={loading}
                  onClick={handleLoadingDemo}
                >
                  {loading ? 'Carregando...' : 'Com Loading'}
                </AnimatedButton>
              </div>
            </div>
          </AnimatedSection>

          {/* Cards Section */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Cards Animados</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedCard delay={0}>
                  <div className="space-y-3">
                    <AnimatedIconBox gradient="from-indigo-500/20 to-purple-500/20">
                      <Heart className="w-5 h-5 text-indigo-400" />
                    </AnimatedIconBox>
                    <h3 className="text-white font-semibold">Card Normal</h3>
                    <p className="text-slate-400 text-sm">
                      Card com hover effect e animação de entrada
                    </p>
                  </div>
                </AnimatedCard>

                <AnimatedClickableCard
                  delay={0.1}
                  onClick={() => handleAction('info')}
                >
                  <div className="space-y-3">
                    <AnimatedIconBox gradient="from-purple-500/20 to-pink-500/20">
                      <Star className="w-5 h-5 text-purple-400" />
                    </AnimatedIconBox>
                    <h3 className="text-white font-semibold">Card Clicável</h3>
                    <p className="text-slate-400 text-sm">
                      Clique para ver o efeito de tap
                    </p>
                  </div>
                </AnimatedClickableCard>

                <AnimatedCard delay={0.2}>
                  <div className="space-y-3">
                    <AnimatedIconBox gradient="from-emerald-500/20 to-teal-500/20">
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </AnimatedIconBox>
                    <h3 className="text-white font-semibold">Com Delay</h3>
                    <p className="text-slate-400 text-sm">
                      Animação com delay escalonado
                    </p>
                  </div>
                </AnimatedCard>
              </div>
            </div>
          </AnimatedSection>

          {/* Icons Section */}
          <AnimatedSection delay={0.3}>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Ícones Animados</h2>
              <div className="flex flex-wrap gap-6">
                <div className="text-center space-y-2">
                  <AnimatedIcon variant="bounce">
                    <Heart className="w-8 h-8 text-red-400" />
                  </AnimatedIcon>
                  <p className="text-slate-400 text-sm">Bounce</p>
                </div>

                <div className="text-center space-y-2">
                  <AnimatedIcon variant="rotate">
                    <Star className="w-8 h-8 text-yellow-400" />
                  </AnimatedIcon>
                  <p className="text-slate-400 text-sm">Rotate</p>
                </div>

                <div className="text-center space-y-2">
                  <AnimatedIcon variant="pulse">
                    <Zap className="w-8 h-8 text-indigo-400" />
                  </AnimatedIcon>
                  <p className="text-slate-400 text-sm">Pulse</p>
                </div>

                <div className="text-center space-y-2">
                  <AnimatedIcon variant="shake">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </AnimatedIcon>
                  <p className="text-slate-400 text-sm">Shake</p>
                </div>

                <div className="text-center space-y-2">
                  <AnimatedLoadingIcon loading={true}>
                    <Loader className="w-8 h-8 text-emerald-400" />
                  </AnimatedLoadingIcon>
                  <p className="text-slate-400 text-sm">Loading</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Inputs Section */}
          <AnimatedSection delay={0.4}>
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-semibold text-white">Inputs Animados</h2>
              <div className="space-y-4">
                <AnimatedInput
                  label="Email"
                  type="email"
                  placeholder="seu@email.com"
                  icon={<Mail className="w-4 h-4" />}
                />

                <AnimatedInput
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                />

                <AnimatedInput
                  label="Nome"
                  type="text"
                  placeholder="Seu nome"
                  icon={<User className="w-4 h-4" />}
                  error="Este campo é obrigatório"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Toasts Section */}
          <AnimatedSection delay={0.5}>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Notificações (Toasts)</h2>
              <div className="flex flex-wrap gap-4">
                <AnimatedButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleAction('success')}
                >
                  Success Toast
                </AnimatedButton>

                <AnimatedButton
                  variant="danger"
                  size="sm"
                  onClick={() => handleAction('error')}
                >
                  Error Toast
                </AnimatedButton>

                <AnimatedButton
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAction('warning')}
                >
                  Warning Toast
                </AnimatedButton>

                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction('info')}
                >
                  Info Toast
                </AnimatedButton>
              </div>
            </div>
          </AnimatedSection>

          {/* Stagger Section */}
          <AnimatedSection delay={0.6}>
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Stagger Animation</h2>
              <StaggerContainer staggerDelay={0.1}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <StaggerItem key={item}>
                    <div className="glass-effect rounded-xl p-4 border border-slate-800/50">
                      <p className="text-white">Item {item}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </AnimatedSection>
        </div>
      </AnimatedPage>

      {/* Toast Container */}
      <ToastContainer>
        {toasts.map((toast) => (
          <AnimatedToast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </DashboardLayout>
  );
}
