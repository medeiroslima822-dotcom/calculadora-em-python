import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Layers, Info, Smartphone } from 'lucide-react';
import {
  BASIC_CALCULATOR_CODE,
  LOOP_CALCULATOR_CODE,
  TKINTER_CALCULATOR_CODE,
  CODE_EXPLANATION_SECTIONS,
} from '../data/pythonCode';

interface CodeViewerProps {
  onSelectSection?: (sectionId: string) => void;
  selectedSectionId?: string | null;
  initialVariant?: 'basic' | 'loop' | 'tkinter';
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  onSelectSection,
  selectedSectionId,
  initialVariant = 'basic',
}) => {
  const [activeVariant, setActiveVariant] = useState<'basic' | 'loop' | 'tkinter'>(initialVariant);
  const [copied, setCopied] = useState(false);
  const [showOnlyCode, setShowOnlyCode] = useState(false);

  const rawCode =
    activeVariant === 'basic'
      ? BASIC_CALCULATOR_CODE
      : activeVariant === 'loop'
      ? LOOP_CALCULATOR_CODE
      : TKINTER_CALCULATOR_CODE;

  // Filter comments if showOnlyCode is true
  const displayedCode = showOnlyCode
    ? rawCode
        .split('\n')
        .filter((line) => !line.trim().startsWith('#') && !line.trim().startsWith('"""'))
        .join('\n')
    : rawCode;

  const lines = displayedCode.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([displayedCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download =
      activeVariant === 'basic'
        ? 'calculadora_simples.py'
        : activeVariant === 'loop'
        ? 'calculadora_completa.py'
        : 'calculadora_smartphone_tkinter.py';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Syntax highlighting helper for Python
  const renderHighlightedLine = (line: string) => {
    if (line.trim().startsWith('#')) {
      return <span className="text-emerald-400/80 italic">{line}</span>;
    }

    // Split words and match keywords
    const pythonKeywords = [
      'def', 'return', 'if', 'elif', 'else', 'while', 'True', 'False',
      'break', 'continue', 'try', 'except', 'in', 'not', 'and', 'or', 'import',
      'global', 'from', 'lambda'
    ];

    const builtins = ['print', 'input', 'float', 'int', 'str', 'round', 'len', 'strip', 'lower', 'isinstance'];

    // Tokenize strings, comments, numbers, keywords
    const tokens: React.ReactNode[] = [];
    let current = '';
    let inString: string | null = null;
    let stringBuffer = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (inString) {
        stringBuffer += char;
        if (char === inString && line[i - 1] !== '\\') {
          tokens.push(
            <span key={i} className="text-amber-300">
              {stringBuffer}
            </span>
          );
          inString = null;
          stringBuffer = '';
        }
        continue;
      }

      if (char === '"' || char === "'") {
        if (current) {
          tokens.push(processWord(current, i));
          current = '';
        }
        inString = char;
        stringBuffer = char;
        continue;
      }

      if (char === '#' && !inString) {
        if (current) {
          tokens.push(processWord(current, i));
          current = '';
        }
        tokens.push(
          <span key={`comment-${i}`} className="text-emerald-400/80 italic">
            {line.slice(i)}
          </span>
        );
        break;
      }

      if (/[\s(),:+\-*/=!<>]/.test(char)) {
        if (current) {
          tokens.push(processWord(current, i));
          current = '';
        }
        tokens.push(
          <span key={`symbol-${i}`} className={/[+\-*/=!<>]/.test(char) ? 'text-rose-400' : 'text-slate-400'}>
            {char}
          </span>
        );
      } else {
        current += char;
      }
    }

    if (current) {
      tokens.push(processWord(current, line.length));
    }

    return <>{tokens}</>;

    function processWord(word: string, keyIdx: number) {
      if (pythonKeywords.includes(word)) {
        return <span key={keyIdx} className="text-purple-400 font-semibold">{word}</span>;
      }
      if (builtins.includes(word)) {
        return <span key={keyIdx} className="text-cyan-400">{word}</span>;
      }
      if (!isNaN(Number(word)) && word.trim() !== '') {
        return <span key={keyIdx} className="text-amber-400">{word}</span>;
      }
      return <span key={keyIdx} className="text-slate-200">{word}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        {/* Variant selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800/80 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveVariant('basic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeVariant === 'basic'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Código Básico (Passo a Passo)
          </button>
          <button
            onClick={() => setActiveVariant('loop')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeVariant === 'loop'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Com Loop while (Terminal)
          </button>
          <button
            onClick={() => setActiveVariant('tkinter')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeVariant === 'tkinter'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Com Interface Tkinter (Estilo Celular)
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOnlyCode(!showOnlyCode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition flex items-center gap-1.5 whitespace-nowrap ${
              showOnlyCode
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
            title="Ocular ou mostrar comentários explicativos"
          >
            <Layers className="h-3.5 w-3.5" />
            {showOnlyCode ? 'Com Comentários' : 'Ocultar Comentários'}
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white transition flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Baixar .py</span>
          </button>
        </div>
      </div>

      {/* Editor Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Editor Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1">
              <FileCode className="h-3.5 w-3.5 text-amber-400" />
              {activeVariant === 'basic' ? 'calculadora_simples.py' : 'calculadora_completa.py'}
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Python 3.x</span>
            <span aria-hidden="true">·</span>
            <span>UTF-8</span>
          </div>
        </div>

        {/* Code Lines Container */}
        <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed max-h-[620px] overflow-y-auto">
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            // Check if this line is in the selected section
            const isHighlighted =
              selectedSectionId &&
              activeVariant === 'basic' &&
              CODE_EXPLANATION_SECTIONS.find(
                (s) => s.id === selectedSectionId && lineNumber >= s.startLine && lineNumber <= s.endLine
              );

            return (
              <div
                key={index}
                className={`flex items-start group hover:bg-slate-900/60 rounded px-1.5 transition-colors ${
                  isHighlighted ? 'bg-amber-500/10 border-l-2 border-amber-400 pl-1' : ''
                }`}
              >
                <span className="w-8 shrink-0 select-none text-right pr-4 text-slate-600 font-mono text-xs pt-0.5">
                  {lineNumber}
                </span>
                <span className="whitespace-pre flex-1">{renderHighlightedLine(line)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanatory Banner Below Code */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-200 mb-1">
            Dica para quem está começando:
          </p>
          <p>
            Você pode copiar este código, salvar em um arquivo com nome <code className="text-amber-300 font-mono">calculadora.py</code> e executá-lo digitando <code className="text-amber-300 font-mono">python calculadora.py</code> no seu terminal. Na aba <strong>Anatomia do Código</strong> você descobre o que cada linha faz detalhadamente.
          </p>
        </div>
      </div>
    </div>
  );
};
