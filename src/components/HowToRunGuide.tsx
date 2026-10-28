import React, { useState } from 'react';
import {
  Terminal,
  Monitor,
  Cloud,
  AlertOctagon,
  Copy,
  Check,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const HowToRunGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const commonErrors = [
    {
      title: "1. IndentationError: unexpected indent",
      cause: "Espaços em branco desalinhados no início da linha.",
      solution: "O Python usa a indentação para saber o que está dentro de funções ou 'if's. Use sempre 4 espaços (ou a tecla TAB com consistência). Nunca misture tabs com espaços!",
      example: "# Errado:\ndef somar(a, b):\nreturn a + b\n\n# Correto (4 espaços):\ndef somar(a, b):\n    return a + b"
    },
    {
      title: "2. SyntaxError: expected ':'",
      cause: "Esquecer os dois pontos ':' no final da linha.",
      solution: "Toda linha que define uma função (def), uma condição (if, elif, else) ou um laço (while, for) PRECISA terminar obrigatoriamente com dois pontos (:).",
      example: "# Errado:\nif opcao == '1'\n\n# Correto:\nif opcao == '1':"
    },
    {
      title: "3. ValueError: could not convert string to float",
      cause: "O usuário digitou texto/letras quando o programa pediu um número.",
      solution: "A função float('abc') falha se a pessoa digitar 'oi' ou 'dez' por extenso. Em programas profissionais, usamos o bloco 'try / except ValueError' para proteger o código.",
      example: "try:\n    num = float(input('Digite um número: '))\nexcept ValueError:\n    print('Digite apenas algarismos numéricos!')"
    },
    {
      title: "4. ZeroDivisionError: division by zero",
      cause: "Tentar dividir qualquer número por 0.",
      solution: "Matematicamente a divisão por zero é indefinida. Sempre faça 'if b == 0:' antes de realizar a operação 'a / b'.",
      example: "if b == 0:\n    return 'Erro: divisor não pode ser zero'\nreturn a / b"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-400" />
          Como Executar este Código no seu Computador
        </h2>
        <p className="text-xs text-slate-400">
          Escolha o método mais confortável para o seu nível de experiência. O Google Colab é o mais rápido caso ainda não tenha o Python instalado.
        </p>
      </div>

      {/* 3 Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Method 1: VS Code */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Monitor className="h-4 w-4" />
              <span>Opção 1: No VS Code</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              O editor favorito dos desenvolvedores profissionais.
            </p>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Instale o Python do site oficial (<strong className="text-slate-200">python.org</strong>). Ao instalar, marque a caixinha <em className="text-amber-300">Add python.exe to PATH</em>.</li>
              <li>Abra o VS Code e instale a extensão oficial &quot;Python&quot;.</li>
              <li>Crie um arquivo chamado <code className="text-amber-400 font-mono">calculadora.py</code>.</li>
              <li>Cole o código e clique no botão de Play ▶ no topo direito.</li>
            </ol>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 font-mono">
            Ambiente completo para projetos futuros
          </div>
        </div>

        {/* Method 2: Terminal */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Terminal className="h-4 w-4" />
              <span>Opção 2: Pelo Terminal / CMD</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Direto pelo prompt de comando do Windows, Mac ou Linux.
            </p>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Salve o arquivo <code className="text-amber-400 font-mono">calculadora.py</code> em uma pasta (ex: Documentos).</li>
              <li>Abra o Prompt de Comando (CMD) ou Terminal.</li>
              <li>Navegue até a pasta ou digite o comando abaixo:</li>
            </ol>
            <div className="rounded-lg bg-slate-950 p-2.5 font-mono text-xs text-amber-300 border border-slate-800 flex items-center justify-between">
              <span>python calculadora.py</span>
              <button
                onClick={() => copyToClipboard('python calculadora.py', 1)}
                className="text-slate-400 hover:text-slate-200"
                title="Copiar comando"
              >
                {copiedIndex === 1 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 font-mono">
            No Linux/Mac pode ser: python3 calculadora.py
          </div>
        </div>

        {/* Method 3: Google Colab */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Cloud className="h-4 w-4" />
              <span>Opção 3: Google Colab (Online)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Não precisa instalar nada no seu computador!
            </p>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Acesse <strong className="text-slate-200">colab.research.google.com</strong> com sua conta Google.</li>
              <li>Clique em &quot;Novo notebook&quot;.</li>
              <li>Cole o código na primeira célula de código.</li>
              <li>Aperte <kbd className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded text-[11px]">Shift + Enter</kbd> ou clique no botão de Play na célula!</li>
            </ol>
          </div>
          <div className="pt-2 text-[11px] text-emerald-400/80 font-mono">
            Recomendado para testar em 30 segundos
          </div>
        </div>
      </div>

      {/* Common Beginner Errors Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-rose-400" />
            Erros Comuns de Quem Está Aprendendo Python e Como Resolver
          </h3>
          <p className="text-xs text-slate-400">
            Todo programador já passou por estes erros. Entenda a mensagem para não perder tempo travado!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonErrors.map((err, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2.5"
            >
              <h4 className="text-xs font-mono font-bold text-rose-400">
                {err.title}
              </h4>
              <p className="text-xs text-slate-300">
                <strong className="text-slate-200">O que causa:</strong> {err.cause}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Como corrigir:</strong> {err.solution}
              </p>
              <div className="rounded-lg bg-slate-950 p-2.5 font-mono text-[11px] text-amber-300/90 whitespace-pre border border-slate-800/80 overflow-x-auto">
                {err.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
