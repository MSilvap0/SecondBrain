'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  X,
  Zap,
  Target,
  MessageCircle
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: string;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Second Brain!',
    description: 'Sua ferramenta inteligente de ideias',
    icon: Sparkles,
    content: 'Vamos mostrar como você pode organizar suas ideias com o poder da IA.',
  },
  {
    id: 'capture',
    title: 'Capture suas ideias',
    description: 'O primeiro passo para a produtividade',
    icon: Lightbulb,
    content: 'Clique em "Nova Ideia" para registrar qualquer pensamento. Adicione título, descrição e tags para organizar.',
  },
  {
    id: 'ai',
    title: 'Expanda com IA',
    description: 'Deixe a inteligência artificial ajudar',
    icon: MessageCircle,
    content: 'Use o chat com IA para expandir, melhorar ou gerar novas ideias a partir das suas.',
  },
];

interface OnboardingModalProps {
  isOpen?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function OnboardingModal({ 
  isOpen = true, 
  onComplete, 
  onSkip 
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const next = () => {
    if (isLastStep) {
      onComplete?.();
      localStorage.setItem('onboarding_complete', 'true');
      router.push('/dashboard');
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const skip = () => {
    onSkip?.();
    localStorage.setItem('onboarding_complete', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Progress Bar */}
        <div className="h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl">
              <Icon className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {step.title}
            </h2>
            <p className="text-slate-400">
              {step.description}
            </p>
          </div>

          {/* Description */}
          <div className="bg-slate-800/50 rounded-xl p-4 mb-8">
            <p className="text-slate-300 text-center">
              {step.content}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-8 bg-blue-500'
                    : idx < currentStep
                    ? 'bg-green-500'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={skip}
              className="px-4 py-3 text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={prev}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-white"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Voltar</span>
                </button>
              )}
              <button
                onClick={next}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl transition-colors text-white font-medium"
              >
                <span>{isLastStep ? 'Começar' : 'Próximo'}</span>
                {isLastStep ? <Check className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to check if onboarding should show
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_complete');
    if (!completed) {
      setShowOnboarding(true);
    }
    setMounted(true);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding_complete');
    setShowOnboarding(true);
  };

  return { 
    showOnboarding: showOnboarding && mounted, 
    completeOnboarding, 
    skipOnboarding,
    resetOnboarding 
  };
}
