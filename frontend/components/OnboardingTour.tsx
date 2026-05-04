'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, Sparkles, Search, Star, Grid3x3 } from 'lucide-react';
import { AnimatedButton } from './animated/AnimatedButton';

interface TourStep {
  title: string;
  description: string;
  icon: any;
  position: 'center' | 'top' | 'bottom';
}

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Verificar se é a primeira visita
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const steps: TourStep[] = [
    {
      title: 'Bem-vindo ao Second Brain! 🎉',
      description: 'Organize suas ideias com inteligência artificial. Vamos fazer um tour rápido pelas funcionalidades.',
      icon: Sparkles,
      position: 'center'
    },
    {
      title: 'Adicione suas ideias',
      description: 'Digite qualquer ideia e nossa IA irá expandir e organizar automaticamente para você.',
      icon: Sparkles,
      position: 'top'
    },
    {
      title: 'Busca inteligente',
      description: 'Encontre rapidamente qualquer ideia usando nossa busca em tempo real. Use Ctrl+K para acesso rápido!',
      icon: Search,
      position: 'top'
    },
    {
      title: 'Organize com tags',
      description: 'Crie tags personalizadas e organize suas ideias por categorias. Filtre facilmente por tags.',
      icon: Grid3x3,
      position: 'center'
    },
    {
      title: 'Marque favoritas',
      description: 'Destaque suas melhores ideias marcando como favoritas. Acesse rapidamente na página de favoritos.',
      icon: Star,
      position: 'center'
    },
    {
      title: 'Pronto para começar!',
      description: 'Você está pronto para organizar suas ideias de forma inteligente. Vamos lá!',
      icon: Check,
      position: 'center'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTour', 'true');
    setIsOpen(false);
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Tour Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="relative p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-b border-slate-800">
                <button
                  onClick={handleSkip}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white">
                        {currentStepData.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {currentStepData.description}
                  </p>
                </motion.div>
              </div>

              {/* Progress */}
              <div className="px-6 py-4 bg-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">
                    Passo {currentStep + 1} de {steps.length}
                  </span>
                  <span className="text-sm text-slate-400">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 flex items-center justify-between gap-4">
                {currentStep > 0 && (
                  <AnimatedButton
                    variant="ghost"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Voltar
                  </AnimatedButton>
                )}

                <div className="flex-1" />

                {!isLastStep && (
                  <AnimatedButton
                    variant="ghost"
                    onClick={handleSkip}
                  >
                    Pular
                  </AnimatedButton>
                )}

                <AnimatedButton
                  variant="primary"
                  onClick={handleNext}
                  icon={isLastStep ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                >
                  {isLastStep ? 'Começar' : 'Próximo'}
                </AnimatedButton>
              </div>

              {/* Step Indicators */}
              <div className="px-6 pb-6 flex justify-center gap-2">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? 'w-8 bg-indigo-500'
                        : index < currentStep
                        ? 'w-2 bg-indigo-500/50'
                        : 'w-2 bg-slate-700'
                    }`}
                    animate={{
                      scale: index === currentStep ? 1.2 : 1
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
