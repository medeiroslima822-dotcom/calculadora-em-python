import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Check,
  Code2,
  ArrowRight,
  Terminal,
} from 'lucide-react';

interface SmartCalculatorProps {
  onGoToCode?: () => void;
}

export const SmartCalculator: React.FC<SmartCalculatorProps> = ({ onGoToCode }) => {
  // Calculator state
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [historyExpression, setHistoryExpression] = useState<string>('');
  
  // Theme: iOS or Android
  const [theme, setTheme] = useState<'ios' | 'android'>('ios');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Python X-Ray Inspection State
  const [lastExecutedFunction, setLastExecutedFunction] = useState<string>(
    '# Aguardando sua primeira operação...\n# Clique nos números e em +, -, * ou / para ver a mágica do Python!'
  );
  const [pythonVariables, setPythonVariables] = useState<{
    num1: string;
    num2: string;
    operacao: string;
    resultado: string;
  }>({
    num1: 'None',
    num2: 'None',
    operacao: 'None',
    resultado: '0',
  });
  const [actionHistory, setActionHistory] = useState<string[]>([
    'Iniciando Calculadora em Python...',
    'Visor inicial: 0',
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle click sound using Web Audio API
  const playClickSound = (freq = 360, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio not permitted or supported
    }
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in a textarea or input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        inputDot();
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('-');
      } else if (e.key === '*' || e.key === 'x') {
        handleOperator('*');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('/');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        clearAll();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayValue, previousValue, operator, waitingForOperand]);

  // Digits input
  const inputDigit = (digit: string) => {
    playClickSound(440, 'triangle');

    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
      logAction(`Digitou segundo número: "${digit}" (novo valor do visor)`);
      setPythonVariables((prev) => ({
        ...prev,
        num2: digit,
      }));
    } else {
      const nextValue = displayValue === '0' || displayValue === 'Erro' ? digit : displayValue + digit;
      // Max 10 digits to prevent overflow
      if (nextValue.length <= 11) {
        setDisplayValue(nextValue);
        logAction(`Digitou dígito: "${digit}" -> visor = "${nextValue}"`);
        if (previousValue === null) {
          setPythonVariables((prev) => ({
            ...prev,
            num1: nextValue,
          }));
        } else {
          setPythonVariables((prev) => ({
            ...prev,
            num2: nextValue,
          }));
        }
      }
    }
  };

  // Decimal dot
  const inputDot = () => {
    playClickSound(480);
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }

    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
      logAction(`Inseriu ponto decimal -> visor = "${displayValue}."`);
    }
  };

  // Backspace
  const handleBackspace = () => {
    playClickSound(300);
    if (displayValue === 'Erro' || displayValue.length === 1) {
      setDisplayValue('0');
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };

  // Operator selection (+, -, *, /)
  const handleOperator = (nextOperator: string) => {
    playClickSound(520, 'sine');
    const inputValue = parseFloat(displayValue);

    if (isNaN(inputValue)) return;

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setHistoryExpression(`${displayValue} ${formatOperatorSymbol(nextOperator)}`);
      setPythonVariables((prev) => ({
        ...prev,
        num1: `${inputValue}`,
        operacao: `"${nextOperator}"`,
      }));
      setLastExecutedFunction(
        `# Guardando o primeiro número e a operação:\nnum1 = float("${displayValue}")  # ${inputValue}\noperacao = "${nextOperator}"\n# Agora digite o segundo número...`
      );
      logAction(`Selecionou operação ${formatOperatorSymbol(nextOperator)} (guardou num1 = ${inputValue})`);
    } else if (operator) {
      // If chaining operations without hitting equals first
      const result = calculate(previousValue, inputValue, operator);
      if (result === 'Erro') {
        setDisplayValue('Erro');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }
      setDisplayValue(String(result));
      setPreviousValue(result);
      setHistoryExpression(`${result} ${formatOperatorSymbol(nextOperator)}`);
      setPythonVariables({
        num1: `${result}`,
        operacao: `"${nextOperator}"`,
        num2: 'None',
        resultado: `${result}`,
      });
      logAction(`Cadeia de operações: calculou ${result} e definiu nova operação ${formatOperatorSymbol(nextOperator)}`);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  // Equals calculation
  const handleEquals = () => {
    playClickSound(600, 'square');
    if (operator === null || previousValue === null) return;

    const currentNum = parseFloat(displayValue);
    if (isNaN(currentNum)) return;

    const fullExpr = `${previousValue} ${formatOperatorSymbol(operator)} ${currentNum} =`;
    setHistoryExpression(fullExpr);

    const result = calculate(previousValue, currentNum, operator);

    if (result === 'Erro') {
      setDisplayValue('Erro: Divisão por 0');
      setLastExecutedFunction(
        `# Proteção contra Divisão por Zero acionada!\ndef dividir(a, b):\n    if b == 0:\n        return "Erro: Não é possível dividir por zero!"\n\n# Chamada com b = 0:\nresultado = dividir(${previousValue}, 0)\n# Retorna erro amigável sem quebrar o programa!`
      );
      setPythonVariables({
        num1: `${previousValue}`,
        operacao: `"${operator}"`,
        num2: '0',
        resultado: '"Erro: Divisão por 0"',
      });
      logAction(`⚠️ Tentativa de divisão por zero: ${previousValue} / 0 -> Retornou erro tratado`);
    } else {
      const formattedResult = formatCleanNumber(result);
      setDisplayValue(formattedResult);

      let pyFunc = '';
      if (operator === '+') {
        pyFunc = `def somar(a, b):\n    return a + b\n\n# Execução:\nnum1 = float(${previousValue})\nnum2 = float(${currentNum})\nresultado = somar(num1, num2)\n# Saída: ${formattedResult}`;
      } else if (operator === '-') {
        pyFunc = `def subtrair(a, b):\n    return a - b\n\n# Execução:\nnum1 = float(${previousValue})\nnum2 = float(${currentNum})\nresultado = subtrair(num1, num2)\n# Saída: ${formattedResult}`;
      } else if (operator === '*') {
        pyFunc = `def multiplicar(a, b):\n    return a * b\n\n# Execução:\nnum1 = float(${previousValue})\nnum2 = float(${currentNum})\nresultado = multiplicar(num1, num2)\n# Saída: ${formattedResult}`;
      } else if (operator === '/') {
        pyFunc = `def dividir(a, b):\n    if b == 0:\n        return "Erro"\n    return a / b\n\n# Execução:\nnum1 = float(${previousValue})\nnum2 = float(${currentNum})\nresultado = dividir(num1, num2)\n# Saída: ${formattedResult}`;
      }

      setLastExecutedFunction(pyFunc);
      setPythonVariables({
        num1: `${previousValue}`,
        operacao: `"${operator}"`,
        num2: `${currentNum}`,
        resultado: `${formattedResult}`,
      });
      logAction(`✅ Chamou ${pyFunctionName(operator)}(${previousValue}, ${currentNum}) -> ${formattedResult}`);
    }

    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  // Calculate helper
  const calculate = (first: number, second: number, op: string): number | 'Erro' => {
    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        if (second === 0) return 'Erro';
        return first / second;
      default:
        return second;
    }
  };

  // Toggle +/-
  const toggleSign = () => {
    playClickSound(380);
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      const inverted = -val;
      setDisplayValue(String(inverted));
      logAction(`Inverteu sinal (+/-): ${val} -> ${inverted}`);
    }
  };

  // Percentage %
  const handlePercentage = () => {
    playClickSound(420);
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      const pct = val / 100;
      setDisplayValue(String(pct));
      logAction(`Porcentagem (%): ${val} / 100 = ${pct}`);
    }
  };

  // Clear All
  const clearAll = () => {
    playClickSound(260);
    setDisplayValue('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setHistoryExpression('');
    setPythonVariables({
      num1: 'None',
      num2: 'None',
      operacao: 'None',
      resultado: '0',
    });
    setLastExecutedFunction('# Calculadora limpa (AC / reset).\n# Pronto para nova conta!');
    logAction('Limpou a calculadora (AC). Variáveis resetadas para None.');
  };

  const logAction = (msg: string) => {
    setActionHistory((prev) => [msg, ...prev.slice(0, 10)]);
  };

  const formatOperatorSymbol = (op: string) => {
    switch (op) {
      case '/':
        return '÷';
      case '*':
        return '×';
      case '-':
        return '−';
      case '+':
        return '+';
      default:
        return op;
    }
  };

  const pyFunctionName = (op: string) => {
    switch (op) {
      case '+':
        return 'somar';
      case '-':
        return 'subtrair';
      case '*':
        return 'multiplicar';
      case '/':
        return 'dividir';
      default:
        return 'operar';
    }
  };

  const formatCleanNumber = (num: number) => {
    // Avoid floating point inaccuracies like 0.1 + 0.2 = 0.30000000000000004
    const rounded = Math.round(num * 1e10) / 1e10;
    return String(rounded);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Theme Switcher and Sound Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Calculadora em Python
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Toque nos botões numéricos e de operação (+, -, *, /) para calcular e acompanhar o código Python executado.
          </p>
        </div>

        {/* Controls: Theme & Sound */}
        <div className="flex items-center gap-3">
          {/* iOS vs Android Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={() => setTheme('ios')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                theme === 'ios'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tema Escuro
            </button>
            <button
              onClick={() => setTheme('android')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                theme === 'android'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tema Material
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition ${
              soundEnabled
                ? 'border-slate-700 bg-slate-900 text-amber-400'
                : 'border-slate-800 bg-slate-950 text-slate-500'
            }`}
            title={soundEnabled ? 'Sons de clique ativados' : 'Sons desativados'}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Split: Smartphone Body on the Left + Python X-Ray Inspector on the Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= SMARTPHONE BODY (Col 5) ================= */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            className={`w-full max-w-[340px] rounded-[42px] p-5 shadow-2xl transition-all duration-300 relative select-none ${
              theme === 'ios'
                ? 'bg-black border-[6px] border-neutral-800 ring-1 ring-neutral-700/50 shadow-amber-500/5'
                : 'bg-neutral-900 border-[6px] border-neutral-800 ring-1 ring-neutral-700/40 rounded-[36px]'
            }`}
          >
            {/* Top Smartphone Speaker & Camera Notch */}
            <div className="flex items-center justify-between px-2 pt-1 pb-3 text-[11px] text-neutral-400 font-mono">
              <span>9:41</span>
              {theme === 'ios' ? (
                <div className="h-4 w-20 bg-neutral-900 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-neutral-950 mr-2" />
                </div>
              ) : (
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-800" />
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">5G</span>
                <div className="h-2.5 w-4 border border-neutral-400 rounded-sm p-[1px]">
                  <div className="h-full w-full bg-neutral-300 rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Calculator Display Screen */}
            <div className="px-2 py-4 text-right flex flex-col justify-end min-h-[120px]">
              {/* History Expression Line */}
              <div className="h-6 text-sm font-mono text-neutral-400 tracking-wider overflow-hidden text-ellipsis whitespace-nowrap">
                {historyExpression}
              </div>

              {/* Main Number Display with Auto-shrink font */}
              <div
                className={`font-semibold font-mono tracking-tight text-white transition-all overflow-x-auto whitespace-nowrap ${
                  displayValue.length > 8
                    ? 'text-3xl'
                    : displayValue.length > 6
                    ? 'text-4xl'
                    : 'text-5xl'
                }`}
              >
                {displayValue}
              </div>
            </div>

            {/* Calculator Keypad Grid */}
            <div className="grid grid-cols-4 gap-3 pt-2">
              {/* Row 1 */}
              <button
                onClick={clearAll}
                className={`h-16 text-lg font-semibold transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-400 text-black hover:bg-neutral-300'
                    : 'rounded-2xl bg-neutral-700 text-neutral-100 hover:bg-neutral-600'
                }`}
              >
                {displayValue !== '0' ? 'C' : 'AC'}
              </button>

              <button
                onClick={toggleSign}
                className={`h-16 text-lg font-semibold transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-400 text-black hover:bg-neutral-300'
                    : 'rounded-2xl bg-neutral-700 text-neutral-100 hover:bg-neutral-600'
                }`}
              >
                +/−
              </button>

              <button
                onClick={handlePercentage}
                className={`h-16 text-lg font-semibold transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-400 text-black hover:bg-neutral-300'
                    : 'rounded-2xl bg-neutral-700 text-neutral-100 hover:bg-neutral-600'
                }`}
              >
                %
              </button>

              <button
                onClick={() => handleOperator('/')}
                className={`h-16 text-2xl font-bold transition active:scale-95 ${
                  operator === '/' && waitingForOperand
                    ? 'bg-white text-amber-500'
                    : theme === 'ios'
                    ? 'rounded-full bg-amber-500 text-white hover:bg-amber-400'
                    : 'rounded-2xl bg-indigo-500 text-white hover:bg-indigo-400'
                }`}
              >
                ÷
              </button>

              {/* Row 2 */}
              <button
                onClick={() => inputDigit('7')}
                className={`h-16 text-xl font-medium transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                7
              </button>

              <button
                onClick={() => inputDigit('8')}
                className={`h-16 text-xl font-medium transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                8
              </button>

              <button
                onClick={() => inputDigit('9')}
                className={`h-16 text-xl font-medium transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                9
              </button>

              <button
                onClick={() => handleOperator('*')}
                className={`h-16 text-2xl font-bold transition active:scale-95 ${
                  operator === '*' && waitingForOperand
                    ? 'bg-white text-amber-500'
                    : theme === 'ios'
                    ? 'rounded-full bg-amber-500 text-white hover:bg-amber-400'
                    : 'rounded-2xl bg-indigo-500 text-white hover:bg-indigo-400'
                }`}
              >
                ×
              </button>

              {/* Row 3 */}
              <button
                onClick={() => inputDigit('4')}
                className={`h-16 text-xl font-medium transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                4
              </button>

              <button
                onClick={() => inputDigit('5')}
                className={`h-16 text-xl font-medium transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                5
              </button>

              <button
                onClick={() => inputDigit('6')}
                className={`h-16 text-xl font-medium transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                6
              </button>

              <button
                onClick={() => handleOperator('-')}
                className={`h-16 text-2xl font-bold transition active:scale-95 ${
                  operator === '-' && waitingForOperand
                    ? 'bg-white text-amber-500'
                    : theme === 'ios'
                    ? 'rounded-full bg-amber-500 text-white hover:bg-amber-400'
                    : 'rounded-2xl bg-indigo-500 text-white hover:bg-indigo-400'
                }`}
              >
                −
              </button>

              {/* Row 4 */}
              <button
                onClick={() => inputDigit('1')}
                className={`h-16 text-xl font-medium transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                1
              </button>

              <button
                onClick={() => inputDigit('2')}
                className={`h-16 text-xl font-medium transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                2
              </button>

              <button
                onClick={() => inputDigit('3')}
                className={`h-16 text-xl font-medium transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                3
              </button>

              <button
                onClick={() => handleOperator('+')}
                className={`h-16 text-2xl font-bold transition active:scale-95 ${
                  operator === '+' && waitingForOperand
                    ? 'bg-white text-amber-500'
                    : theme === 'ios'
                    ? 'rounded-full bg-amber-500 text-white hover:bg-amber-400'
                    : 'rounded-2xl bg-indigo-500 text-white hover:bg-indigo-400'
                }`}
              >
                +
              </button>

              {/* Row 5 */}
              <button
                onClick={() => inputDigit('0')}
                className={`h-16 col-span-2 text-xl font-medium text-left pl-7 transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                0
              </button>

              <button
                onClick={inputDot}
                className={`h-16 text-xl font-bold transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-neutral-800 text-white hover:bg-neutral-700'
                    : 'rounded-2xl bg-neutral-800 text-white hover:bg-neutral-700'
                }`}
              >
                .
              </button>

              <button
                onClick={handleEquals}
                className={`h-16 text-2xl font-bold transition active:scale-95 ${
                  theme === 'ios'
                    ? 'rounded-full bg-amber-500 text-white hover:bg-amber-400'
                    : 'rounded-2xl bg-indigo-500 text-white hover:bg-indigo-400'
                }`}
              >
                =
              </button>
            </div>

            {/* Bottom Smartphone Indicator Bar */}
            <div className="flex justify-center pt-5 pb-1">
              <div className="h-1 w-32 bg-neutral-700 rounded-full" />
            </div>
          </div>
        </div>

        {/* ================= PYTHON X-RAY & INSPECTION PANEL (Col 7) ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Quick Actions Bar */}
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Raio-X: O que está acontecendo por trás dos botões</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5"
                title="Copiar valor do visor"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Visor'}</span>
              </button>

              <button
                onClick={clearAll}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Reiniciar"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Variables Table in Python Memory */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-amber-400 font-semibold uppercase tracking-wider">
                1. Variáveis na Memória Python
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Estado Atual
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2.5">
                <span className="text-slate-500 block text-[10px]">num1 (float)</span>
                <span className="text-amber-300 font-bold text-sm truncate block">
                  {pythonVariables.num1}
                </span>
              </div>

              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2.5">
                <span className="text-slate-500 block text-[10px]">operacao (str)</span>
                <span className="text-purple-400 font-bold text-sm block">
                  {pythonVariables.operacao}
                </span>
              </div>

              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2.5">
                <span className="text-slate-500 block text-[10px]">num2 (float)</span>
                <span className="text-cyan-300 font-bold text-sm truncate block">
                  {pythonVariables.num2}
                </span>
              </div>

              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2.5">
                <span className="text-slate-500 block text-[10px]">resultado</span>
                <span className="text-emerald-400 font-bold text-sm truncate block">
                  {pythonVariables.resultado}
                </span>
              </div>
            </div>
          </div>

          {/* Python Function Executed Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg">
            <div className="border-b border-slate-800/80 bg-slate-900/80 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-mono text-slate-200 font-semibold">
                  2. Código Python Acionado por Este Botão
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                def {operator ? pyFunctionName(operator) : 'operacao'}()
              </span>
            </div>

            <div className="p-4 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto whitespace-pre leading-relaxed bg-slate-950">
              <span className="text-amber-300/90">{lastExecutedFunction}</span>
            </div>
          </div>

          {/* Realtime Event Stream */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 font-medium flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                Log de Eventos (Toques do Usuário):
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Teclado físico também funciona (0-9, +, -, *, /, Enter)
              </span>
            </div>

            <div className="space-y-1 font-mono text-[11px] max-h-28 overflow-y-auto">
              {actionHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${
                    idx === 0 ? 'text-amber-300 font-medium' : 'text-slate-500'
                  }`}
                >
                  <ArrowRight className="h-3 w-3 shrink-0 mt-0.5 opacity-60" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link to source code */}
          {onGoToCode && (
            <div className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs">
              <span className="text-slate-300">
                Quer ver como construir esta mesma calculadora com janela gráfica no seu computador usando o <code className="text-amber-400 font-mono">tkinter</code> do Python?
              </span>
              <button
                onClick={onGoToCode}
                className="text-amber-400 font-bold hover:underline shrink-0 ml-4 flex items-center gap-1"
              >
                <span>Ver Código Python GUI</span>
                <span>&rarr;</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
