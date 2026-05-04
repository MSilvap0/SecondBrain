'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Crown, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      window.location.href = '/login';
      return;
    }

    const userData = JSON.parse(user);
    setUserName(userData.name);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/dashboard';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen ui-shell flex items-center justify-center px-6">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="ui-card p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-white mb-2">
            Pagamento Confirmado!
          </h1>
          <p className="text-neutral-300 mb-8">
            Bem-vindo ao plano Pro, {userName}!
          </p>

          {/* Plan Card */}
          <div className="ui-card-soft p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-card rounded-xl flex items-center justify-center">
                  <Crown className="w-7 h-7 text-on-surface" />
                </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-on-surface">Plano Pro</h3>
                <p className="text-neutral-300 text-sm">Agora você tem acesso a tudo</p>
              </div>
            </div>

            {/* Features */}
            <div className="text-left space-y-3">
              {[
                'Ideias ilimitadas',
                'IA avançada com GPT-4',
                'Chat ilimitado',
                'Histórico completo',
                'Exportar em PDF/Markdown',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-neutral-200 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full ui-btn ui-btn-primary"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Countdown */}
          <p className="text-neutral-400 text-sm mt-6">
            Redirecionando em {countdown} segundos...
          </p>
        </div>
      </div>
    </div>
  );
}
