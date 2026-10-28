export interface CodeSection {
  id: string;
  title: string;
  startLine: number;
  endLine: number;
  concept: string;
  summary: string;
  details: string;
  example: string;
  tip: string;
}

export const BASIC_CALCULATOR_CODE = `# ========================================================
# CALCULADORA SIMPLES EM PYTHON (4 OPERAÇÕES BÁSICAS)
# ========================================================

# PASSO 1: Criando as funções matemáticas
def somar(a, b):
    return a + b

def subtrair(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    # Verificação de segurança: não podemos dividir por zero!
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b

# PASSO 2: Exibindo o menu para o usuário
print("--- CALCULADORA SIMPLES ---")
print("Escolha a operação:")
print("1 - Soma (+)")
print("2 - Subtração (-)")
print("3 - Multiplicação (*)")
print("4 - Divisão (/)")

# PASSO 3: Recebendo a escolha da operação
opcao = input("Digite o número da operação desejada (1/2/3/4): ")

# PASSO 4: Recebendo os dois números do usuário
# Usamos float() para aceitar números inteiros ou decimais (ex: 5 ou 4.5)
num1 = float(input("Digite o primeiro número: "))
num2 = float(input("Digite o segundo número: "))

# PASSO 5: Decidindo qual função chamar e exibindo o resultado
if opcao == "1":
    resultado = somar(num1, num2)
    print(f"Resultado: {num1} + {num2} = {resultado}")

elif opcao == "2":
    resultado = subtrair(num1, num2)
    print(f"Resultado: {num1} - {num2} = {resultado}")

elif opcao == "3":
    resultado = multiplicar(num1, num2)
    print(f"Resultado: {num1} * {num2} = {resultado}")

elif opcao == "4":
    resultado = dividir(num1, num2)
    print(f"Resultado: {num1} / {num2} = {resultado}")

else:
    print("Opção inválida! Escolha entre 1, 2, 3 ou 4.")
`;

export const LOOP_CALCULATOR_CODE = `# ========================================================
# CALCULADORA COMPLETA EM PYTHON COM LOOP (while)
# ========================================================

def somar(a, b):
    """Retorna a soma de dois números."""
    return a + b

def subtrair(a, b):
    """Retorna a diferença entre dois números."""
    return a - b

def multiplicar(a, b):
    """Retorna o produto de dois números."""
    return a * b

def dividir(a, b):
    """Retorna a divisão. Trata divisão por zero."""
    if b == 0:
        return "Erro: divisão por zero não permitida!"
    return a / b

def calculadora():
    print("====================================")
    print("   BEM-VINDO À CALCULADORA PYTHON   ")
    print("====================================")

    # O laço while True mantém a calculadora rodando até você escolher sair
    while True:
        print("\\nOperações disponíveis:")
        print("1 (+) Soma")
        print("2 (-) Subtração")
        print("3 (*) Multiplicação")
        print("4 (/) Divisão")
        print("0 (S) Sair da calculadora")

        opcao = input("\\nQual operação deseja realizar? ").strip().lower()

        # Verifica se o usuário quer encerrar o programa
        if opcao in ["0", "s", "sair"]:
            print("\\nObrigado por usar a calculadora! Bons estudos em Python! 🐍")
            break

        # Validação da opção
        if opcao not in ["1", "2", "3", "4", "+", "-", "*", "/"]:
            print("⚠️ Opção inválida! Por favor, escolha 1, 2, 3, 4 ou 0 para sair.")
            continue

        # Tratamento de erro na digitação dos números (try / except)
        try:
            num1 = float(input("Digite o 1º número: "))
            num2 = float(input("Digite o 2º número: "))
        except ValueError:
            print("⚠️ Entrada inválida! Digite apenas números válidos (ex: 10 ou 7.5).")
            continue

        # Execução da operação selecionada
        if opcao in ["1", "+"]:
            res = somar(num1, num2)
            simbolo = "+"
        elif opcao in ["2", "-"]:
            res = subtrair(num1, num2)
            simbolo = "-"
        elif opcao in ["3", "*"]:
            res = multiplicar(num1, num2)
            simbolo = "*"
        elif opcao in ["4", "/"]:
            res = dividir(num1, num2)
            simbolo = "/"

        print(f"\\n✅ Resultado: {num1} {simbolo} {num2} = {res}")

# Executa a função principal
if __name__ == "__main__":
    calculadora()
`;

export const TKINTER_CALCULATOR_CODE = `# ========================================================
# CALCULADORA GRÁFICA ESTILO SMARTPHONE (iOS / Android)
# Usando a biblioteca padrão tkinter (já inclusa no Python!)
# ========================================================

import tkinter as tk

# Funções das 4 operações matemáticas básicas
def somar(a, b):
    return a + b

def subtrair(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    if b == 0:
        return "Erro"
    return a / b

# Variáveis globais para controlar a conta
num1 = None
operacao = None
novo_numero = True

def clicar_numero(digito):
    global novo_numero
    valor_atual = visor.get()
    
    if novo_numero or valor_atual == "0" or valor_atual == "Erro":
        visor.delete(0, tk.END)
        visor.insert(0, str(digito))
        novo_numero = False
    else:
        if digito == "." and "." in valor_atual:
            return # Evita colocar dois pontos decimais
        visor.insert(tk.END, str(digito))

def clicar_operacao(op):
    global num1, operacao, novo_numero
    try:
        num1 = float(visor.get())
        operacao = op
        novo_numero = True
        label_historico.config(text=f"{num1:g} {op}")
    except ValueError:
        visor.delete(0, tk.END)
        visor.insert(0, "Erro")

def clicar_igual():
    global num1, operacao, novo_numero
    if num1 is None or operacao is None:
        return
    try:
        num2 = float(visor.get())
        if operacao == "+":
            res = somar(num1, num2)
        elif operacao == "-":
            res = subtrair(num1, num2)
        elif operacao == "*":
            res = multiplicar(num1, num2)
        elif operacao == "/":
            res = dividir(num1, num2)

        label_historico.config(text=f"{num1:g} {operacao} {num2:g} =")
        visor.delete(0, tk.END)
        
        # Formata resultado amigável (ex: 5 em vez de 5.0)
        if isinstance(res, (int, float)):
            visor.insert(0, f"{res:g}")
        else:
            visor.insert(0, str(res))

        num1 = None
        operacao = None
        novo_numero = True
    except ValueError:
        visor.delete(0, tk.END)
        visor.insert(0, "Erro")

def limpar():
    global num1, operacao, novo_numero
    num1 = None
    operacao = None
    novo_numero = True
    label_historico.config(text="")
    visor.delete(0, tk.END)
    visor.insert(0, "0")

# Cria a janela gráfica da calculadora
janela = tk.Tk()
janela.title("Calculadora Python")
janela.geometry("320x460")
janela.configure(bg="#1c1c1e") # Fundo escuro estilo smartphone
janela.resizable(False, False)

# Rótulo de Histórico e Visor Principal
label_historico = tk.Label(janela, text="", font=("Arial", 12), fg="#8e8e93", bg="#1c1c1e", anchor="e")
label_historico.pack(fill="x", padx=20, pady=(15, 0))

visor = tk.Entry(janela, font=("Arial", 36, "bold"), fg="#ffffff", bg="#1c1c1e", bd=0, justify="right")
visor.insert(0, "0")
visor.pack(fill="x", padx=20, pady=(0, 15))

# Grade de Botões
frame_botoes = tk.Frame(janela, bg="#1c1c1e")
frame_botoes.pack(fill="both", expand=True, padx=12, pady=12)

botoes = [
    ('AC', '#505050', limpar), ('+/-', '#505050', None), ('%', '#505050', None), ('/', '#ff9f0a', lambda: clicar_operacao('/')),
    ('7', '#333333', lambda: clicar_numero(7)), ('8', '#333333', lambda: clicar_numero(8)), ('9', '#333333', lambda: clicar_numero(9)), ('*', '#ff9f0a', lambda: clicar_operacao('*')),
    ('4', '#333333', lambda: clicar_numero(4)), ('5', '#333333', lambda: clicar_numero(5)), ('6', '#333333', lambda: clicar_numero(6)), ('-', '#ff9f0a', lambda: clicar_operacao('-')),
    ('1', '#333333', lambda: clicar_numero(1)), ('2', '#333333', lambda: clicar_numero(2)), ('3', '#333333', lambda: clicar_numero(3)), ('+', '#ff9f0a', lambda: clicar_operacao('+')),
    ('0', '#333333', lambda: clicar_numero(0)), ('.', '#333333', lambda: clicar_numero('.')), ('=', '#ff9f0a', clicar_igual)
]

r = 0
c = 0
for texto, cor, acao in botoes:
    if texto == '0':
        btn = tk.Button(frame_botoes, text=texto, font=("Arial", 16, "bold"), bg=cor, fg="#ffffff", bd=0, command=acao)
        btn.grid(row=r, column=c, columnspan=2, sticky="nsew", padx=4, pady=4)
        c += 2
    else:
        btn = tk.Button(frame_botoes, text=texto, font=("Arial", 16, "bold"), bg=cor, fg="#ffffff", bd=0, command=acao)
        btn.grid(row=r, column=c, sticky="nsew", padx=4, pady=4)
        c += 1
    if c >= 4:
        c = 0
        r += 1

for i in range(5):
    frame_botoes.rowconfigure(i, weight=1)
for j in range(4):
    frame_botoes.columnconfigure(j, weight=1)

janela.mainloop()
`;


export const CODE_EXPLANATION_SECTIONS: CodeSection[] = [
  {
    id: "funcoes",
    title: "1. Funções com 'def' e 'return'",
    startLine: 6,
    endLine: 18,
    concept: "Modularização e Reutilização",
    summary: "Criamos uma função separada para cada operação matemática fundamental.",
    details: "A palavra-chave 'def' avisa ao Python que estamos definindo uma função. Entre os parênteses, colocamos os parâmetros ('a' e 'b') que são os números que a função recebe para calcular. A palavra-chave 'return' devolve a resposta final para quem chamou a função.",
    example: "def somar(a, b):\n    return a + b\n\n# Chamando a função:\ntotal = somar(10, 5) # total agora vale 15",
    tip: "Em Python, o código que pertence à função precisa estar indentado (com 4 espaços para a direita). É assim que o Python sabe onde a função começa e termina."
  },
  {
    id: "divisao-zero",
    title: "2. Verificação de Segurança (Divisão por Zero)",
    startLine: 15,
    endLine: 18,
    concept: "Prevenção de Falhas (Edge Cases)",
    summary: "Na matemática não existe divisão por zero. Em computação, tentar dividir por zero travaria o programa com 'ZeroDivisionError'.",
    details: "Dentro da função 'dividir(a, b)', usamos 'if b == 0:' para checar se o divisor é zero antes de fazer o cálculo. Se for zero, retornamos uma mensagem amigável em vez de deixar o programa quebrar.",
    example: "def dividir(a, b):\n    if b == 0:\n        return 'Erro: Não é possível dividir por zero!'\n    return a / b",
    tip: "Programadores experientes sempre pensam nas entradas inesperadas que o usuário pode fornecer. Proteger seu código contra divisões por zero é a primeira boa prática!"
  },
  {
    id: "menu-input",
    title: "3. Entrada de Dados com 'input()'",
    startLine: 28,
    endLine: 29,
    concept: "Interação com o Usuário",
    summary: "A função input() pausa o programa e espera o usuário digitar algo no teclado e apertar ENTER.",
    details: "Tudo o que a função 'input()' recebe chega como texto (string). Mesmo que o usuário digite '1', o Python entende como a letra '1' ('\"1\"'). Por isso, guardamos a opção em texto para comparar no if.",
    example: "opcao = input('Digite a operação: ')\n# Se digitou 1, opcao conterá '1'",
    tip: "O texto dentro dos parênteses do input('mensagem: ') é exibido no terminal como instrução para quem está usando o programa."
  },
  {
    id: "conversao-float",
    title: "4. Conversão de Tipos com 'float()'",
    startLine: 31,
    endLine: 34,
    concept: "Casting e Manipulação Numérica",
    summary: "Se você tentar somar dois inputs diretamente sem converter, '5' + '5' vira '55' (concatenação de texto) em vez de 10!",
    details: "Envolvemos o input com 'float()', que converte o texto digitado em um número com casas decimais. Usamos 'float' em vez de 'int' para que a calculadora aceite tanto números inteiros (como 4 ou 10) quanto quebrados (como 3.5 ou 0.25).",
    example: "num1 = float(input('Digite o número: '))\n# Se digitar '7.5', num1 vira o valor numérico 7.5",
    tip: "Se usássemos int(), o usuário não conseguiria calcular 2.5 + 1.2 porque daria erro de formato. float() é muito mais flexível para calculadoras!"
  },
  {
    id: "condicionais",
    title: "5. Estruturas Condicionais ('if', 'elif', 'else')",
    startLine: 36,
    endLine: 54,
    concept: "Controle de Fluxo e Decisão",
    summary: "O Python avalia a opção digitada e executa apenas o bloco de código correspondente.",
    details: "1. 'if opcao == \"1\":' testa se o usuário quer somar.\n2. 'elif' (abreviação de 'else if', ou 'senão se') testa as opções seguintes caso a anterior não tenha sido atendida.\n3. 'else:' é a proteção final: se o usuário digitou qualquer coisa diferente de 1, 2, 3 ou 4, mostramos 'Opção inválida!'.",
    example: "if opcao == '1':\n    resultado = somar(num1, num2)\nelif opcao == '2':\n    resultado = subtrair(num1, num2)\nelse:\n    print('Opção inválida!')",
    tip: "Em Python, o sinal de igual duplo '==' é usado para comparar se dois valores são iguais. O sinal de igual simples '=' serve para guardar valores em variáveis!"
  },
  {
    id: "f-strings",
    title: "6. Exibição Formatada com F-Strings ('f\"...\"')",
    startLine: 38,
    endLine: 50,
    concept: "Interpolação de Variáveis",
    summary: "Colocar um 'f' antes das aspas permite injetar variáveis diretamente no texto entre chaves {}.",
    details: "Antes do Python 3.6, era necessário fazer conversões complexas ou usar concatenação de strings com '+'. Com f-strings (f'Texto {variavel}'), o código fica muito mais legível e elegante.",
    example: "nome = 'Python'\nversao = 3.12\nprint(f'Aprendendo {nome} versão {versao}!')",
    tip: "Você pode fazer até contas diretamente dentro das chaves, como f'O dobro é {numero * 2}'!"
  }
];

export const PYTHON_TIPS = [
  {
    title: "Atenção com a Indentação",
    description: "Em Python não usamos chaves { } para abrir blocos como no JavaScript ou C. O alinhamento dos espaços (4 espaços) define quem está dentro de funções ou 'if's."
  },
  {
    title: "Divisão exata vs Divisão inteira",
    description: "A barra única '/' faz divisão decimal comum (ex: 7 / 2 = 3.5). Se quiser apenas a parte inteira, use barra dupla '//' (ex: 7 // 2 = 3)."
  },
  {
    title: "Nomes de variáveis descritivos",
    description: "Prefira nomes claros como 'num1', 'opcao', 'resultado' em vez de letras soltas como 'x', 'y', 'z'. Isso ajuda você e outros a entenderem o código."
  },
  {
    title: "Como testar sem instalar nada",
    description: "Você pode abrir o site Google Colab ou replit.com, colar esse mesmo código e rodar na nuvem instantaneamente pelo navegador!"
  }
];
