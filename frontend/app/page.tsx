'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Sempre redireciona para landing - a landing page é a porta de entrada
    router.push('/landing');
  }, [router]);

  return null;
}
