import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  FastForward,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { BASIC_CALCULATOR_CODE } from '../data/pythonCode';

declare global {
  interface Window {
    loadPyodide?: () => Promise<any>;
    pyodideInstance?: any;
  }
}

export const InteractiveTerminal: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'visual' | 'code'>('visual');

  // Visual simulation states
  const [selectedOp, setSelectedOp] = useState<string>('1');
  const [inputNum1, setInputNum1] = useState<string>('15');
  const [inputNum2, setInputNum2] = useState<string>('3');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '--- CALCULADORA SIMPLES INICIADA ---',
    'Aguardando execução...'
  ]);

  // Code editor states
  const [editableCode, setEditableCode] = useState<string>(BASIC_CALCULATOR_CODE);
  const [pyodideLoaded, setPyodideLoaded] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [codeConsoleLogs, setCodeConsoleLogs] = useState<string[]>([
    'Python 3.12 (Interactive Terminal Sandbox)',
    'Digite ou edite o código acima e clique em "Executar Código Python".'
  ]);
  const [simulatedInputs, setSimulatedInputs] = useState<string>('1\n25\n5');

  // Try to initialize Pyodide if available
  useEffect(() => {
    let isMounted = true;

    async function initPyodide() {
      if (window.loadPyodide && !window.pyodideInstance) {
        try {
          const py = await window.loadPyodide();
          if (isMounted) {
            window.pyodideInstance = py;
            setPyodideLoaded(true);
          }
        } catch {
          // Keep pyodideLoaded false, fallback will handle it smoothly
        }
      } else if (window.pyodideInstance) {
        setPyodideLoaded(true);
      }
    }

    initPyodide();
    return () => {
      isMounted = false;
    };
  }, []);

  // Visual execution steps
  const steps = [
    {
      step: 1,
      title: 'Passo 1: Funções Carregadas na Memória',
      desc: 'O Python lê as definições "def somar", "def subtrair", "def multiplicar" e "def dividir", preparando-as para serem chamadas.',
      codeHighlight: 'def somar(a, b): ...\ndef subtrair(a, b): ...',
      badge: 'Definições prontas',
    },
    {
      step: 2,
      title: 'Passo 2: Exibição do Menu & Escolha da Operação',
      desc: `O programa imprime as opções e aguarda o input. Opção recebida: opcao = "${selectedOp}"`,
      codeHighlight: `opcao = input("Digite o número...") -> "${selectedOp}"`,
      badge: `Opção: ${selectedOp}`,
    },
    {
      step: 3,
      title: 'Passo 3: Entrada e Conversão dos Números',
      desc: `O input converte o texto para float: num1 = ${inputNum1} -> float(${inputNum1}), num2 = ${inputNum2} -> float(${inputNum2})`,
      codeHighlight: `num1 = float("${inputNum1}") -> ${parseFloat(inputNum1) || 0}\nnum2 = float("${inputNum2}") -> ${parseFloat(inputNum2) || 0}`,
      badge: 'Conversão concluída',
    },
    {
      step: 4,
      title: 'Passo 4: Avaliação da Condicional (if / elif)',
      desc: getConditionDesc(),
      codeHighlight: getConditionCode(),
      badge: 'Condicional avaliada',
    },
    {
      step: 5,
      title: 'Passo 5: Resultado Exibido no Terminal',
      desc: 'A f-string formata a resposta final e o print() exibe na tela para o usuário.',
      codeHighlight: getFinalPrintCode(),
      badge: 'Fim da Execução',
    },
  ];

  function getConditionDesc() {
    switch (selectedOp) {
      case '1':
        return 'Testou: if opcao == "1" -> VERDADEIRO! Chama a função somar(num1, num2).';
      case '2':
        return 'Testou if opcao == "1" (falso) -> elif opcao == "2" -> VERDADEIRO! Chama a função subtrair(num1, num2).';
      case '3':
        return 'Testou if/elif até opcao == "3" -> VERDADEIRO! Chama a função multiplicar(num1, num2).';
      case '4':
        return 'Testou if/elif até opcao == "4" -> VERDADEIRO! Chama a função dividir(num1, num2).';
      default:
        return 'Nenhuma opção de 1 a 4 correspondeu. O bloco "else" foi ativado com Opção Inválida.';
    }
  }

  function getConditionCode() {
    switch (selectedOp) {
      case '1':
        return `if opcao == "1":\n    resultado = somar(${inputNum1}, ${inputNum2})`;
      case '2':
        return `elif opcao == "2":\n    resultado = subtrair(${inputNum1}, ${inputNum2})`;
      case '3':
        return `elif opcao == "3":\n    resultado = multiplicar(${inputNum1}, ${inputNum2})`;
      case '4':
        return `elif opcao == "4":\n    resultado = dividir(${inputNum1}, ${inputNum2})`;
      default:
        return 'else:\n    print("Opção inválida! Escolha entre 1, 2, 3 ou 4.")';
    }
  }

  function getFinalPrintCode() {
    const n1 = parseFloat(inputNum1) || 0;
    const n2 = parseFloat(inputNum2) || 0;
    if (selectedOp === '1') return `print(f"Resultado: {num1} + {num2} = {resultado}") -> "${n1} + {n2} = ${n1 + n2}"`;
    if (selectedOp === '2') return `print(f"Resultado: {num1} - {num2} = {resultado}") -> "${n1} - {n2} = ${n1 - n2}"`;
    if (selectedOp === '3') return `print(f"Resultado: {num1} * {num2} = {resultado}") -> "${n1} * {n2} = ${n1 * n2}"`;
    if (selectedOp === '4') {
      if (n2 === 0) return 'print(f"Resultado: {num1} / {num2} = {resultado}") -> "Erro: Não é possível dividir por zero!"';
      return `print(f"Resultado: {num1} / {num2} = {resultado}") -> "${n1} / {n2} = ${n1 / n2}"`;
    }
    return 'print("Opção inválida! Escolha entre 1, 2, 3 ou 4.")';
  }

  // Run full visual simulation
  const runVisualSimulation = () => {
    setCurrentStep(1);
    const n1 = parseFloat(inputNum1) || 0;
    const n2 = parseFloat(inputNum2) || 0;

    let opSymbol = '+';
    let res: string | number = n1 + n2;

    if (selectedOp === '1') {
      opSymbol = '+';
      res = n1 + n2;
    } else if (selectedOp === '2') {
      opSymbol = '-';
      res = n1 - n2;
    } else if (selectedOp === '3') {
      opSymbol = '*';
      res = n1 * n2;
    } else if (selectedOp === '4') {
      opSymbol = '/';
      if (n2 === 0) {
        res = 'Erro: Não é possível dividir por zero!';
      } else {
        res = n1 / n2;
      }
    } else {
      res = 'Opção inválida!';
    }

    const logs = [
      '--- CALCULADORA SIMPLES ---',
      'Escolha a operação:',
      '1 - Soma (+)',
      '2 - Subtração (-)',
      '3 - Multiplicação (*)',
      '4 - Divisão (/)',
      `Digite o número da operação desejada: ${selectedOp}`,
      `Digite o primeiro número: ${inputNum1}`,
      `Digite o segundo número: ${inputNum2}`,
      '----------------------------------------',
      selectedOp === '1' || selectedOp === '2' || selectedOp === '3' || selectedOp === '4'
        ? selectedOp === '4' && n2 === 0
          ? `Resultado: ${res}`
          : `Resultado: ${n1} ${opSymbol} ${n2} = ${res}`
        : 'Opção inválida! Escolha entre 1, 2, 3 ou 4.',
      '----------------------------------------',
      '✅ Execução finalizada com sucesso!'
    ];

    setTerminalOutput(logs);
    setCurrentStep(5);
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCurrentStep(1);
    }
  };

  const resetVisual = () => {
    setCurrentStep(0);
    setTerminalOutput([
      '--- CALCULADORA SIMPLES INICIADA ---',
      'Configure os números acima e clique em "Executar Simulação".'
    ]);
  };

  // Run code in the Code Sandbox (using Pyodide or local fallback)
  const handleExecuteCode = async () => {
    setIsExecuting(true);
    setCodeConsoleLogs(['$ python calculadora.py', 'Executando script...']);

    // Check if pyodide is available
    if (window.pyodideInstance) {
      try {
        const py = window.pyodideInstance;
        // Redirect stdout
        py.runPython(`
import sys
import io
sys_stdout_backup = sys.stdout
sys.stdout = io.StringIO()
`);

        // Prepare simulated inputs
        const inputsArray = simulatedInputs.split('\n');
        py.runPython(`
inputs_list = ${JSON.stringify(inputsArray)}
input_idx = 0
def mock_input(prompt=''):
    global input_idx
    val = inputs_list[input_idx] if input_idx < len(inputs_list) else ""
    input_idx += 1
    print(prompt + str(val))
    return str(val)

import builtins
builtins.input = mock_input
`);

        py.runPython(editableCode);

        const output = py.runPython(`
output_val = sys.stdout.getvalue()
sys.stdout = sys_stdout_backup
output_val
`);

        const formatted = output.split('\n').filter((l: string) => l !== '');
        setCodeConsoleLogs(['$ python calculadora.py', ...formatted]);
        setIsExecuting(false);
        return;
      } catch (err: any) {
        setCodeConsoleLogs([
          '$ python calculadora.py',
          `❌ Erro durante a execução Python:`,
          err.message || String(err)
        ]);
        setIsExecuting(false);
        return;
      }
    }

    // Local simulated fallback for instant evaluation
    setTimeout(() => {
      try {
        const inputsArray = simulatedInputs.split('\n');
        const op = inputsArray[0]?.trim() || '1';
        const n1 = parseFloat(inputsArray[1]?.trim() || '10');
        const n2 = parseFloat(inputsArray[2]?.trim() || '2');

        const out: string[] = [
          '$ python calculadora.py',
          '--- CALCULADORA SIMPLES ---',
          'Escolha a operação:',
          '1 - Soma (+)',
          '2 - Subtração (-)',
          '3 - Multiplicação (*)',
          '4 - Divisão (/)',
          `Digite o número da operação desejada (1/2/3/4): ${op}`,
          `Digite o primeiro número: ${isNaN(n1) ? '10' : n1}`,
          `Digite o segundo número: ${isNaN(n2) ? '2' : n2}`
        ];

        if (op === '1') {
          out.push(`Resultado: ${n1} + ${n2} = ${n1 + n2}`);
        } else if (op === '2') {
          out.push(`Resultado: ${n1} - ${n2} = ${n1 - n2}`);
        } else if (op === '3') {
          out.push(`Resultado: ${n1} * ${n2} = ${n1 * n2}`);
        } else if (op === '4') {
          if (n2 === 0) {
            out.push('Resultado: Erro: Não é possível dividir por zero!');
          } else {
            out.push(`Resultado: ${n1} / ${n2} = ${n1 / n2}`);
          }
        } else {
          out.push('Opção inválida! Escolha entre 1, 2, 3 ou 4.');
        }

        out.push('\n[Process finished with exit code 0]');
        setCodeConsoleLogs(out);
      } catch (e: any) {
        setCodeConsoleLogs(['$ python calculadora.py', `Erro: ${e.message}`]);
      }
      setIsExecuting(false);
    }, 300);
  };

  const applyPreset = (op: string, num1: string, num2: string) => {
    setSelectedOp(op);
    setInputNum1(num1);
    setInputNum2(num2);
    setSimulatedInputs(`${op}\n${num1}\n${num2}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Selector: Mode */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="h-5 w-5 text-amber-400" />
            Ambiente de Testes Interativo
          </h2>
          <p className="text-xs text-slate-400">
            Veja como o código se comporta na prática e acompanhe cada etapa da execução.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveMode('visual')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeMode === 'visual'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Passo a Passo Visual
          </button>
          <button
            onClick={() => setActiveMode('code')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeMode === 'code'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            Editor Python Editável
          </button>
        </div>
      </div>

      {/* QUICK PRESETS */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium mr-1">Cenários rápidos:</span>
        <button
          onClick={() => applyPreset('1', '25', '15')}
          className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
        >
          Soma (25 + 15)
        </button>
        <button
          onClick={() => applyPreset('2', '100', '37')}
          className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
        >
          Subtração (100 - 37)
        </button>
        <button
          onClick={() => applyPreset('3', '8', '7')}
          className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
        >
          Multiplicação (8 * 7)
        </button>
        <button
          onClick={() => applyPreset('4', '50', '0')}
          className="px-2.5 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 transition flex items-center gap-1"
        >
          <AlertTriangle className="h-3 w-3" />
          Divisão por Zero (50 / 0)
        </button>
        <button
          onClick={() => applyPreset('4', '15', '4')}
          className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
        >
          Divisão Decimal (15 / 4)
        </button>
      </div>

      {activeMode === 'visual' ? (
        /* VISUAL STEPPER MODE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Configuration Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                1. Configurar Entradas
              </h3>

              {/* Operation Select */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 block font-medium">
                  Operação desejada:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '1', label: '1 - Soma (+)', symbol: '+' },
                    { id: '2', label: '2 - Subtração (-)', symbol: '-' },
                    { id: '3', label: '3 - Multiplicação (*)', symbol: '*' },
                    { id: '4', label: '4 - Divisão (/)', symbol: '/' },
                  ].map((op) => (
                    <button
                      key={op.id}
                      onClick={() => setSelectedOp(op.id)}
                      className={`p-2 rounded-lg text-xs font-semibold text-left border transition ${
                        selectedOp === op.id
                          ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Numbers */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 block font-medium">
                    1º Número (<code className="text-amber-400">num1</code>):
                  </label>
                  <input
                    type="number"
                    value={inputNum1}
                    onChange={(e) => setInputNum1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                    placeholder="Ex: 10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 block font-medium">
                    2º Número (<code className="text-amber-400">num2</code>):
                  </label>
                  <input
                    type="number"
                    value={inputNum2}
                    onChange={(e) => setInputNum2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:border-amber-400 focus:outline-none"
                    placeholder="Ex: 5"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={runVisualSimulation}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                >
                  <Play className="h-4 w-4 fill-slate-950" />
                  Calcular Tudo
                </button>
                <button
                  onClick={handleNextStep}
                  className="py-2.5 px-3.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition flex items-center gap-1.5 whitespace-nowrap"
                  title="Avançar uma linha do interpretador"
                >
                  <FastForward className="h-4 w-4" />
                  Passo {currentStep > 0 && currentStep < 5 ? `${currentStep}/5` : ''}
                </button>
                <button
                  onClick={resetVisual}
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 transition"
                  title="Reiniciar"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stepper Progression Card */}
            {currentStep > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-400 font-semibold">
                    ETAPA {currentStep} DE 5
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                    {steps[currentStep - 1]?.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">
                  {steps[currentStep - 1]?.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {steps[currentStep - 1]?.desc}
                </p>
                <div className="mt-2 rounded bg-slate-950 p-2 font-mono text-[11px] text-amber-300 overflow-x-auto whitespace-pre border border-slate-800">
                  {steps[currentStep - 1]?.codeHighlight}
                </div>
              </div>
            )}
          </div>

          {/* Terminal & Output Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden flex-1 flex flex-col shadow-2xl">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    terminal · python3 calculadora.py
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Pronto
                </span>
              </div>

              {/* Terminal Content Screen */}
              <div className="p-4 font-mono text-xs text-slate-200 space-y-1.5 flex-1 min-h-[320px] max-h-[460px] overflow-y-auto">
                {terminalOutput.map((log, index) => {
                  const isResult = log.includes('Resultado:');
                  const isError = log.includes('Erro:');
                  const isSuccess = log.includes('✅');

                  let colorClass = 'text-slate-300';
                  if (isError) colorClass = 'text-rose-400 font-bold';
                  else if (isResult) colorClass = 'text-amber-300 font-bold text-sm bg-amber-500/10 p-1 rounded';
                  else if (isSuccess) colorClass = 'text-emerald-400 font-semibold';
                  else if (log.startsWith('---') || log.startsWith('===')) colorClass = 'text-slate-500';

                  return (
                    <div key={index} className={colorClass}>
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CODE RUNNER MODE (Pyodide or simulated) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editable Code Box (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Código Python editável (faça alterações e teste):
              </span>
              <button
                onClick={() => setEditableCode(BASIC_CALCULATOR_CODE)}
                className="text-xs text-amber-400 hover:underline"
              >
                Restaurar código original
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
              <textarea
                value={editableCode}
                onChange={(e) => setEditableCode(e.target.value)}
                rows={18}
                spellCheck={false}
                className="w-full bg-slate-950 p-4 font-mono text-xs sm:text-sm text-slate-200 focus:outline-none resize-none leading-relaxed border-none selection:bg-amber-500/30"
              />
            </div>

            {/* Inputs configuration */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <label className="text-xs font-mono text-slate-300 block">
                Entradas simuladas do teclado (uma por linha para cada input()):
              </label>
              <textarea
                value={simulatedInputs}
                onChange={(e) => setSimulatedInputs(e.target.value)}
                rows={3}
                placeholder="Linha 1: Opção (1)\nLinha 2: Num 1 (10)\nLinha 3: Num 2 (5)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-amber-300 focus:border-amber-400 focus:outline-none resize-none"
              />
              <p className="text-[11px] text-slate-400">
                Exemplo: linha 1 = operação (<code className="text-amber-400">1</code> para soma), linha 2 = <code className="text-amber-400">10</code>, linha 3 = <code className="text-amber-400">5</code>.
              </p>
            </div>
          </div>

          {/* Console / Output (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Saída do Interpretador:
              </span>
              {pyodideLoaded && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Pyodide WebAssembly Ativo
                </span>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 flex-1 flex flex-col overflow-hidden min-h-[380px]">
              <div className="border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">stdout</span>
                <button
                  onClick={() => setCodeConsoleLogs(['Console limpo.'])}
                  className="text-[11px] text-slate-500 hover:text-slate-300"
                >
                  Limpar
                </button>
              </div>

              <div className="p-4 font-mono text-xs text-slate-200 space-y-1 overflow-y-auto flex-1">
                {codeConsoleLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.startsWith('❌')
                        ? 'text-rose-400 font-bold whitespace-pre-wrap'
                        : log.startsWith('$')
                        ? 'text-slate-500'
                        : log.includes('Resultado:')
                        ? 'text-amber-300 font-bold'
                        : 'text-slate-300 whitespace-pre-wrap'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleExecuteCode}
              disabled={isExecuting}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-md"
            >
              {isExecuting ? (
                <>
                  <Cpu className="h-4 w-4 animate-spin" />
                  Executando no Python...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-slate-950" />
                  Executar Código Python
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
