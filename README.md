# Calculadora de Quilometragem

> Meça a quilometragem de você sabe o quê. Ferramenta de cálculo com verificação de acesso para maiores de 18 anos.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Estilo | Tailwind CSS v4 |
| Linguagem | TypeScript 6 |

---

## Funcionalidades

- **Verificação de idade** — tela de acesso com 3 checkboxes de aceite obrigatório
- **Captcha matemático** — desafio gerado via canvas com ruído visual, regenerável
- **Calculadora** — fórmula `Kf = M × S × T × 19.2 ÷ 1000` com slider animado
- **Resultado detalhado** — exibe km, parâmetros usados e fórmula aplicada
- **Copiar resultado** — copia os dados para a área de transferência
- **Toasts** — notificações de sucesso e erro com animação slide-in
- **Design system** — dark theme inspirado em Linear/Vercel, glassmorphism, grid de fundo

---

## Instalação e uso

```bash
# instalar dependências
npm install

# rodar em desenvolvimento
npm run dev

# build de produção
npm run build

# preview do build
npm run preview
```

---

## Estrutura do projeto

```
src/
├── components/
│   ├── AgeGate.tsx        # tela de verificação de idade + captcha
│   ├── Calculator.tsx     # formulário principal e lógica de cálculo
│   ├── Header.tsx         # barra de navegação superior
│   ├── LoadingOverlay.tsx # overlay de carregamento
│   ├── ResultBox.tsx      # exibição do resultado
│   ├── Toast.tsx          # sistema de notificações
│   └── Tooltip.tsx        # tooltip hover nos labels
├── App.tsx                # roteamento entre AgeGate e app principal
├── main.tsx               # entry point
└── index.css              # design tokens, animações e utilitários globais
```

---

## Fórmula

```
Kf  = M × S × T × 19.2      (resultado em metros)
km  = Kf ÷ 1000

M  →  tempo em meses
S  →  média semanal de atividade
T  →  fator de tamanho (1–20)
```

---

## Licença

Projeto pessoal de caráter humorístico. Sem licença de uso comercial.  
Conteúdo destinado exclusivamente ao público adulto (+18).
