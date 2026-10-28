import React, { useState } from 'react';
import {
  Code,
  ShieldAlert,
  ArrowRightLeft,
  GitBranch,
  Repeat,
  Sparkles,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { CODE_EXPLANATION_SECTIONS, PYTHON_TIPS } from '../data/pythonCode';

interface ComponentExplainerProps {
  onSelectCodeSnippet?: (id: string) => void;
}

export const ComponentExplainer: React.FC<ComponentExplainerProps> = () => {
  const [selectedConcept, setSelectedConcept] = useState<string>('funcoes');
  // Interactive mini sandbox states
  const [testNum1, setTestNum1] = useState<string>('12');
  const [testNum2, setTestNum2] = useState<string>('4');
  const [testOp, setTestOp] = useState<string>('+');

  const currentSection =
    CODE_EXPLANATION_SECTIONS.find((s) => s.id === selectedConcept) ||
    CODE_EXPLANATION_SECTIONS[0];

  // Icons mapping for concepts
  const getConceptIcon = (id: string) => {
    switch (id) {
      case 'funcoes':
        return <Code className="h-4 w-4 text-purple-400" />;
      case 'divisao-zero':
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      case 'menu-input':
        return <ArrowRightLeft className="h-4 w-4 text-cyan-400" />;
      case 'conversao-float':
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      case 'condicionais':
        return <GitBranch className="h-4 w-4 text-emerald-400" />;
      case 'f-strings':
        return <Repeat className="h-4 w-4 text-blue-400" />;
      default:
        return <Code className="h-4 w-4 text-slate-400" />;
    }
  };

  // Mini simulation values for demonstration
  const parsed1 = parseFloat(testNum1);
  const parsed2 = parseFloat(testNum2);
  const isZeroDivision = testOp === '/' && parsed2 === 0;

  let miniCalcResult: string | number = '';
  if (isNaN(parsed1) || isNaN(parsed2)) {
    miniCalcResult = 'Entrada inválida (digite números)';
  } else if (isZeroDivision) {
    miniCalcResult = 'Erro: Não é possível dividir por zero!';
  } else {
    switch (testOp) {
      case '+':
        miniCalcResult = parsed1 + parsed2;
        break;
      case '-':
        miniCalcResult = parsed1 - parsed2;
        break;
      case '*':
        miniCalcResult = parsed1 * parsed2;
        break;
      case '/':
        miniCalcResult = parsed1 / parsed2;
        break;
    }
  }

  return (
    <div className="space-y-8">
      {/* Concept Selector Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Anatomia dos Componentes do Código
          </h2>
          <p className="text-xs text-slate-400">
            Clique em cada componente abaixo para entender sua função lógica, sintaxe e por que ele é essencial para quem está aprendendo a programar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CODE_EXPLANATION_SECTIONS.map((section) => {
            const isSelected = selectedConcept === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setSelectedConcept(section.id)}
                className={`text-left p-3.5 rounded-xl border transition flex flex-col gap-2 ${
                  isSelected
                    ? 'border-amber-500/80 bg-amber-500/10 shadow-md ring-1 ring-amber-500/30'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-200">
                    {getConceptIcon(section.id)}
                    {section.title}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {section.summary}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep Dive Detail Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-xl">
        {/* Header of the concept */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono text-amber-400 mb-1">
              CONCEITO FUNDAMENTAL · {currentSection.concept.toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-white">
              {currentSection.title}
            </h3>
          </div>
          <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            Linhas no código: {currentSection.startLine} até {currentSection.endLine}
          </div>
        </div>

        {/* Deep Explanation */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1.5">
              Como funciona na prática:
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {currentSection.details}
            </p>
          </div>

          {/* Code example box */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 mb-1.5 font-mono">
              EXEMPLO EM PYTHON:
            </h4>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto whitespace-pre">
              {currentSection.example}
            </div>
          </div>

          {/* Golden Tip Callout */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-amber-300 block mb-0.5">
                Dica de Ouro para Iniciantes:
              </span>
              {currentSection.tip}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Concept Simulator (String vs Float & Zero Division) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white mb-1">
            Simulador Didático: Por que convertemos com <code className="text-amber-400 font-mono">float()</code>?
          </h3>
          <p className="text-xs text-slate-400">
            Veja com seus próprios olhos a diferença fundamental entre somar textos (sem conversão) e somar números reais com a linguagem Python.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Without float conversion (string concatenation) */}
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
              <span>SEM float() (Apenas com input)</span>
              <span className="font-mono text-[11px] bg-rose-500/20 px-2 py-0.5 rounded">
                Tipo: str (Texto)
              </span>
            </div>
            <div className="font-mono text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <p className="text-slate-500"># O Python junta os textos (concatenação):</p>
              <p className="text-rose-300">
                &quot;{testNum1}&quot; + &quot;{testNum2}&quot; = &quot;{testNum1}{testNum2}&quot;
              </p>
            </div>
            <p className="text-xs text-rose-300/80 leading-relaxed">
              ⚠️ Se o usuário digitar &quot;5&quot; e &quot;5&quot;, o resultado será &quot;55&quot; e não 10! Por isso precisamos converter.
            </p>
          </div>

          {/* With float conversion */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>COM float(input())</span>
              <span className="font-mono text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded">
                Tipo: float (Decimal)
              </span>
            </div>
            <div className="font-mono text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <p className="text-slate-500"># O Python realiza a soma aritmética:</p>
              <p className="text-emerald-300">
                {isNaN(parsed1) ? '?' : parsed1} + {isNaN(parsed2) ? '?' : parsed2} = {isNaN(parsed1) || isNaN(parsed2) ? '?' : parsed1 + parsed2}
              </p>
            </div>
            <p className="text-xs text-emerald-300/80 leading-relaxed flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 inline" />
              Correto! O Python reconhece os valores como números matemáticos reais.
            </p>
          </div>
        </div>

        {/* Live inputs to test this */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-900 text-xs">
          <span className="text-slate-400 font-medium">Altere os números de teste:</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={testNum1}
              onChange={(e) => setTestNum1(e.target.value)}
              className="w-20 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
              placeholder="Num 1"
            />
            <select
              value={testOp}
              onChange={(e) => setTestOp(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-amber-400 font-mono focus:border-amber-400 focus:outline-none"
            >
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="*">*</option>
              <option value="/">/</option>
            </select>
            <input
              type="text"
              value={testNum2}
              onChange={(e) => setTestNum2(e.target.value)}
              className="w-20 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
              placeholder="Num 2"
            />
          </div>
          <div className="ml-auto font-mono text-slate-300">
            Resultado da operação: <strong className={isZeroDivision ? 'text-rose-400' : 'text-amber-400'}>{miniCalcResult}</strong>
          </div>
        </div>
      </div>

      {/* General Tips for Beginners */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          Boas Práticas e Regras de Ouro em Python
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PYTHON_TIPS.map((tip, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-1.5"
            >
              <h4 className="text-xs font-semibold text-slate-200">
                {tip.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
