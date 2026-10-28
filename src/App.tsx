import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SmartCalculator } from './components/SmartCalculator';
import { CodeViewer } from './components/CodeViewer';
import { ComponentExplainer } from './components/ComponentExplainer';
import { HowToRunGuide } from './components/HowToRunGuide';
import { CodingChallenges } from './components/CodingChallenges';
import { BASIC_CALCULATOR_CODE, TKINTER_CALCULATOR_CODE } from './data/pythonCode';
import {
  BookOpen,
  Code2,
  HelpCircle,
  Download,
  Terminal,
  ArrowDown,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('calc');
  const [codeInitialVariant, setCodeInitialVariant] = useState<'basic' | 'loop' | 'tkinter'>('basic');

  const handleDownloadPy = () => {
    const blob = new Blob([BASIC_CALCULATOR_CODE], {
      type: 'text/x-python;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculadora.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTkinter = () => {
    const blob = new Blob([TKINTER_CALCULATOR_CODE], {
      type: 'text/x-python;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calculadora_gui.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Smooth scroll helper for quick access to sections below
  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleGoToTkinterCode = () => {
    setCodeInitialVariant('tkinter');
    scrollToSection('codigo-fonte');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={scrollToSection}
        onDownload={handleDownloadPy}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        
        {/* ================= SECTION 1: CALCULADORA LOGO DE CARA ================= */}
        <section id="calc" className="space-y-4 pt-1 scroll-mt-20">
          {/* Calculadora em Python principal */}
          <SmartCalculator onGoToCode={handleGoToTkinterCode} />

          {/* Quick jump anchor bar to scroll down to explanations */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <ArrowDown className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
              Role para baixo para ver as explicações e o código:
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollToSection('explicacoes')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-1.5"
              >
                <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                <span>Explicações e Especificações</span>
              </button>

              <button
                onClick={() => scrollToSection('codigo-fonte')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-1.5"
              >
                <Code2 className="h-3.5 w-3.5 text-purple-400" />
                <span>Código Python Completo</span>
              </button>

              <button
                onClick={() => scrollToSection('como-executar')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-1.5"
              >
                <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
                <span>Como Executar no PC</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: EXPLICAÇÕES E ESPECIFICAÇÕES ================= */}
        <section id="explicacoes" className="space-y-6 pt-6 border-t border-slate-800 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-0.5">
                Fundamentos de Programação
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-400" />
                Explicações e Especificações da Calculadora
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Aprenda o que cada bloco e comando do Python faz: funções, entrada de dados, conversão para decimal e tratamento de erros.
            </p>
          </div>

          <ComponentExplainer />
        </section>

        {/* ================= SECTION 3: CÓDIGO FONTE PYTHON ================= */}
        <section id="codigo-fonte" className="space-y-6 pt-6 border-t border-slate-800 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-0.5">
                Scripts Prontos para Uso
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Code2 className="h-5 w-5 text-purple-400" />
                Código em Python
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Copie ou baixe o código para rodar no seu computador (versão simples, versão com loop infinito ou versão com janela gráfica Tkinter).
            </p>
          </div>

          <CodeViewer initialVariant={codeInitialVariant} />

          {/* Download Tkinter option banner */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white block mb-0.5">
                Deseja criar a janela com botões no seu computador?
              </span>
              O script com <strong>Tkinter</strong> utiliza a biblioteca gráfica nativa do Python e roda sem precisar instalar nada via pip.
            </div>
            <button
              onClick={handleDownloadTkinter}
              className="px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition text-xs font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Baixar calculadora_gui.py</span>
            </button>
          </div>
        </section>

        {/* ================= SECTION 4: COMO EXECUTAR & DESAFIOS ================= */}
        <section id="como-executar" className="space-y-8 pt-6 border-t border-slate-800 scroll-mt-20">
          <HowToRunGuide />
          <CodingChallenges />
        </section>

      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-amber-400" />
            <span className="text-slate-400 font-medium">
              Calculadora em Python
            </span>
            <span aria-hidden="true">·</span>
            <span>Didática e Prática para Iniciantes</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => scrollToSection('calc')}
              className="hover:text-slate-200 transition"
            >
              Calculadora
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => scrollToSection('explicacoes')}
              className="hover:text-slate-200 transition"
            >
              Explicações
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => scrollToSection('codigo-fonte')}
              className="hover:text-slate-200 transition"
            >
              Código Python
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleDownloadPy}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Download .py
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
