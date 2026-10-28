import React from 'react';
import { Terminal, Download, Code2, BookOpen, Smartphone, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDownload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onDownload,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Smartphone className="h-5 w-5" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Calculadora Python
          </span>
        </div>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('calc')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'calc'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Calculadora
          </button>

          <button
            onClick={() => setActiveTab('concepts')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'concepts'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Explicações e Especificações
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'code'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Code2 className="h-4 w-4" />
            Código Python
          </button>

          <button
            onClick={() => setActiveTab('howtorun')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'howtorun'
                ? 'text-amber-400 border-amber-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            Como Executar
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onDownload}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-950 transition hover:bg-amber-400 active:scale-95 whitespace-nowrap shrink-0 shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Baixar .py</span>
          </button>
        </div>
      </div>

      {/* Mobile nav scrollable bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-900 gap-2 text-xs font-medium no-scrollbar">
        <button
          onClick={() => setActiveTab('calc')}
          className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded ${
            activeTab === 'calc' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Calculadora
        </button>
        <button
          onClick={() => setActiveTab('concepts')}
          className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded ${
            activeTab === 'concepts' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Explicações e Especificações
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded ${
            activeTab === 'code' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Código Python
        </button>
        <button
          onClick={() => setActiveTab('howtorun')}
          className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded ${
            activeTab === 'howtorun' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Como Executar
        </button>
      </div>
    </header>
  );
};
