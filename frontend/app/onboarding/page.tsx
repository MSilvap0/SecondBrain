'use client';

import { useOnboarding, OnboardingModal } from '@/components/OnboardingModal';

export default function OnboardingPage() {
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onComplete={completeOnboarding}
          onSkip={skipOnboarding}
        />
      )}
    </div>
  );
}
