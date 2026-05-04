'use client';

interface LogoProps {
  className?: string;
  height?: number;
  usePng?: boolean; // Usar PNG se disponível
}

export function Logo({ className = '', height = 1000, usePng = false }: LogoProps) {
  // Componente SVG
  const SvgLogo = () => (
    <div className="flex flex-col items-center gap-2">
      {/* Ícone do cérebro com rede neural */}
      <div className="relative">
        <svg
          width="120"
          height="80"
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-24 md:w-28 lg:w-32 h-auto"
        >
          {/* Cérebro esquerdo */}
          <path
            d="M25 20C25 15 28 12 32 12C35 12 38 14 38 18C38 15 40 12 44 12C48 12 50 15 50 20C50 25 48 30 45 35C42 40 38 45 35 50C32 45 28 40 25 35C22 30 20 25 20 20C20 15 22 12 25 12C28 12 30 14 30 18"
            stroke="currentColor"
            className="text-slate-700 dark:text-slate-300"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Linha divisória */}
          <line
            x1="60"
            y1="15"
            x2="60"
            y2="65"
            stroke="currentColor"
            className="text-indigo-500"
            strokeWidth="2"
          />
          
          {/* Rede neural direita */}
          <circle cx="75" cy="20" r="4" className="fill-indigo-500" />
          <circle cx="95" cy="25" r="4" className="fill-indigo-500" />
          <circle cx="95" cy="45" r="4" className="fill-indigo-500" />
          <circle cx="75" cy="50" r="4" className="fill-indigo-500" />
          <circle cx="85" cy="35" r="4" className="fill-indigo-500" />
          <circle cx="105" cy="35" r="4" className="fill-indigo-500" />
          
          {/* Conexões da rede */}
          <line x1="75" y1="20" x2="95" y2="25" stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" />
          <line x1="75" y1="20" x2="85" y2="35" stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" />
          <line x1="95" y1="25" x2="85" y2="35" stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" />
          <line x1="95" y1="25" x2="105" y2="35" stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" />
          <line x1="85" y1="35" x2="95" y2="45" stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" />
          <line x1="85" y1="35" x2="75" y2="50" stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" />
          <line x1="95" y1="45" x2="75" y2="50" stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" />
          <line x1="95" y1="45" x2="105" y2="35" stroke="currentColor" className="text-indigo-400" strokeWidth="1.5" />
        </svg>
      </div>
      
      {/* Texto */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className="text-slate-800 dark:text-slate-200">SECOND </span>
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            BRAIN
          </span>
        </h1>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 tracking-wider mt-1">
          ORGANIZE. CONECTE. EVOLUA.
        </p>
      </div>
    </div>
  );

  // Se usePng for true, tentar carregar PNG
  if (usePng) {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm">
          <img
            src={`/logo.png?v=${Date.now()}`}
            alt="Second Brain - Organize. Conecte. Evolua."
            className="h-96 md:h-[32rem] lg:h-[36rem] w-auto object-contain mx-auto"
            style={{ filter: 'brightness(1.2) contrast(1.2) saturate(1.1)' }}
            onError={(e) => {
            // Se falhar, esconder a imagem e mostrar SVG
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            const parent = img.parentElement;
            if (parent && !parent.querySelector('svg')) {
              const div = document.createElement('div');
              div.innerHTML = `
                <div class="flex flex-col items-center gap-2">
                  <div class="relative">
                    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-24 md:w-28 lg:w-32 h-auto">
                      <path d="M25 20C25 15 28 12 32 12C35 12 38 14 38 18C38 15 40 12 44 12C48 12 50 15 50 20C50 25 48 30 45 35C42 40 38 45 35 50C32 45 28 40 25 35C22 30 20 25 20 20C20 15 22 12 25 12C28 12 30 14 30 18" stroke="currentColor" class="text-slate-700 dark:text-slate-300" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="60" y1="15" x2="60" y2="65" stroke="currentColor" class="text-indigo-500" stroke-width="2"/>
                      <circle cx="75" cy="20" r="4" class="fill-indigo-500"/>
                      <circle cx="95" cy="25" r="4" class="fill-indigo-500"/>
                      <circle cx="95" cy="45" r="4" class="fill-indigo-500"/>
                      <circle cx="75" cy="50" r="4" class="fill-indigo-500"/>
                      <circle cx="85" cy="35" r="4" class="fill-indigo-500"/>
                      <circle cx="105" cy="35" r="4" class="fill-indigo-500"/>
                      <line x1="75" y1="20" x2="95" y2="25" stroke="currentColor" class="text-indigo-400" stroke-width="1.5"/>
                      <line x1="75" y1="20" x2="85" y2="35" stroke="currentColor" class="text-indigo-400" stroke-width="1.5"/>
                      <line x1="95" y1="25" x2="85" y2="35" stroke="currentColor" class="text-indigo-400" stroke-width="1.5"/>
                      <line x1="95" y1="25" x2="105" y2="35" stroke="currentColor" class="text-indigo-400" stroke-width="1.5"/>
                      <line x1="85" y1="35" x2="95" y2="45" stroke="currentColor" class="text-indigo-400" stroke-width="1.5"/>
                      <line x1="85" y1="35" x2="75" y2="50" stroke="currentColor" class="text-indigo-400" stroke-width="1.5"/>
                      <line x1="95" y1="45" x2="75" y2="50" stroke="currentColor" class="text-indigo-400" stroke-width="1.5"/>
                      <line x1="95" y1="45" x2="105" y2="35" stroke="currentColor" class="text-indigo-400" stroke-width="1.5"/>
                    </svg>
                  </div>
                  <div class="text-center">
                    <h1 class="text-2xl md:text-3xl font-bold tracking-tight">
                      <span class="text-slate-800 dark:text-slate-200">SECOND </span>
                      <span class="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">BRAIN</span>
                    </h1>
                    <p class="text-xs md:text-sm text-slate-600 dark:text-slate-400 tracking-wider mt-1">ORGANIZE. CONECTE. EVOLUA.</p>
                  </div>
                </div>
              `;
              parent.appendChild(div);
            }
          }}
        />
        </div>
      </div>
    );
  }

  // Por padrão, usar SVG
  return (
    <div className={`flex justify-center items-center py-4 ${className}`}>
      <SvgLogo />
    </div>
  );
}
