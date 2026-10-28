import React, { useState } from 'react';
import { Award, ChevronDown, ChevronUp, Check, Lightbulb, Code } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  level: string;
  description: string;
  hint: string;
  solutionCode: string;
  explanation: string;
}

export const CodingChallenges: React.FC = () => {
  const [openChallengeId, setOpenChallengeId] = useState<string | null>('desafio-1');

  const challenges: Challenge[] = [
    {
      id: 'desafio-1',
      title: 'Desafio 1: Adicionar Exponenciação (Potência)',
      level: 'Fácil',
      description: 'Como você adicionaria a operação de elevar um número ao outro (ex: 2³ = 8) como opção número 5?',
      hint: 'Em Python, o operador de exponenciação não é o acento circunflexo (^), mas sim dois asteriscos juntos (**).',
      solutionCode: `# 1. Crie a função de potência:
def potencia(a, b):
    return a ** b

# 2. No menu, adicione:
# print("5 - Potência (**)")

# 3. Na condicional, adicione o elif:
elif opcao == "5":
    resultado = potencia(num1, num2)
    print(f"Resultado: {num1} ** {num2} = {resultado}")`,
      explanation: 'O operador ** realiza a exponenciação direta em Python (a ** b). O acento circunflexo ^ em Python realiza uma operação lógica binária (XOR), então não deve ser usado para potências!'
    },
    {
      id: 'desafio-2',
      title: 'Desafio 2: Adicionar Resto da Divisão (Módulo)',
      level: 'Fácil',
      description: 'Como calcular o resto que sobra de uma divisão inteira (ex: 10 dividido por 3 dá 3 e sobra 1)?',
      hint: 'O operador de resto da divisão em Python é o símbolo de porcentagem (%).',
      solutionCode: `# Função de resto da divisão:
def resto_divisao(a, b):
    if b == 0:
        return "Erro: Não é possível calcular resto com divisor zero!"
    return a % b

elif opcao == "6":
    resultado = resto_divisao(num1, num2)
    print(f"Resto de {num1} % {num2} = {resultado}")`,
      explanation: 'O operador de módulo % é muito utilizado em programação para verificar se um número é par (numero % 2 == 0) ou ímpar.'
    },
    {
      id: 'desafio-3',
      title: 'Desafio 3: Arredondar Resultados Longos com round()',
      level: 'Intermediário',
      description: 'Ao dividir 10 por 3, o Python exibe 3.3333333333333335. Como limitar para apenas 2 casas decimais?',
      hint: 'Use a função nativa round(valor, casas_decimais).',
      solutionCode: `# Usando a função round():
resultado = dividir(num1, num2)

# Se o resultado for um número, arredonda para 2 casas:
if isinstance(resultado, (int, float)):
    resultado = round(resultado, 2)

print(f"Resultado formatado: {resultado}")

# Alternativa elegante usando f-string:
# print(f"Resultado: {resultado:.2f}")`,
      explanation: 'A sintaxe :.2f dentro da f-string f"{resultado:.2f}" formata automaticamente com duas casas decimais sem precisar alterar o valor original!'
    },
    {
      id: 'desafio-4',
      title: 'Desafio 4: Proteção contra Letras (try / except)',
      level: 'Avançado',
      description: 'Se o usuário digitar "abc" no lugar do número, o programa trava com ValueError. Como capturar esse erro amigavelmente?',
      hint: 'Use o bloco try / except ValueError.',
      solutionCode: `try:
    num1 = float(input("Digite o 1º número: "))
    num2 = float(input("Digite o 2º número: "))
except ValueError:
    print("❌ Entrada inválida! Você precisa digitar números válidos, não letras.")
    # Aqui você pode encerrar ou pedir novamente com um loop`,
      explanation: 'O bloco try testa o código sensível. Se ocorrer uma exceção do tipo ValueError, o fluxo pula diretamente para o except sem quebrar o programa.'
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-400" />
            Desafios Práticos para Exercitar seu Aprendizado
          </h3>
          <p className="text-xs text-slate-400">
            A melhor forma de fixar programação é alterando o código você mesmo! Tente resolver mentalmente antes de abrir a resposta.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {challenges.map((ch) => {
          const isOpen = openChallengeId === ch.id;
          return (
            <div
              key={ch.id}
              className={`rounded-xl border transition overflow-hidden ${
                isOpen
                  ? 'border-amber-500/50 bg-slate-950 shadow-md'
                  : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setOpenChallengeId(isOpen ? null : ch.id)}
                className="w-full text-left p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono">
                    {ch.level}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">
                    {ch.title}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 pt-0 border-t border-slate-800/80 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2.5 text-xs text-amber-300">
                    <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                    <span><strong>Dica:</strong> {ch.hint}</span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Code className="h-3.5 w-3.5 text-amber-400" />
                      Solução Proposta em Python:
                    </span>
                    <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre">
                      {ch.solutionCode}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    💡 <strong>Por que funciona:</strong> {ch.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
