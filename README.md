# Logística Intra-Hospitalar e Roteamento de Emergência (IA)

> Simulação interativa em Canvas 2D Blueprint comparando Busca Gulosa e Algoritmo A* no transporte crítico de pacientes sob normas de biossegurança do SUS (ANVISA RDC 50) e embasamento teórico em Liu (2023).

![React](https://img.shields.io/badge/React-18%2F19-61dafb?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646cff?logo=vite&logoColor=white)
![Canvas](https://img.shields.io/badge/Render-HTML5%20Canvas%202D-e34f26)
![Node Test](https://img.shields.io/badge/Tests-node%20--test-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Início Rápido (Quick Start)

Clone o repositório, instale as dependências e inicie o servidor local em menos de 30 segundos:

```bash
git clone https://github.com/alvarokaycss/lab-algoritimos-inteligentes-hospital.git
cd lab-algoritimos-inteligentes-hospital
npm install
npm run dev
```

Para rodar a suíte de testes unitários dos algoritmos:

```bash
npm test
```

---

## O Problema Clínico e Normativo

Em situações de emergência médica (AVC, parada cardiorrespiratória ou politrauma), o transporte de macas entre a triagem e o suporte intensivo precisa equilibrar velocidade e segurança sanitária.

A aplicação modela a planta física sob a ótica da **ANVISA RDC 50**:
* **Alas de Isolamento Infeccioso (Custo $\infty$):** Ambientes com controle de pressão e patógenos multirresistentes; macas com pacientes imunossuprimidos jamais podem atravessá-las.
* **Corredores Congestionados (Custo $g=5.0$):** Rotas com acúmulo de equipamentos e tráfego intenso que elevam o tempo de resposta.
* **Corredores Livres (Custo $g=1.0$):** Vias desimpedidas de fluxo rápido.

---

## Comparativo Algorítmico

Ambos os algoritmos operam sobre malha 2D ortogonal utilizando a **Distância Euclidiana** ($h(n) = \sqrt{\Delta x^2 + \Delta y^2}$) como função heurística admissível e consistente.

| Algoritmo | Função de Avaliação | Comportamento no Hospital |
|---|---|---|
| **Busca Gulosa (*Greedy Best-First*)** | $f(n) = h(n)$ | Prioriza exclusivamente a proximidade visual do destino. Diante de barreiras côncavas em "U", entra no beco sem saída e colide com o fundo, sofrendo retrocessos e alta expansão de nós. |
| **Algoritmo A\*** | $f(n) = g(n) + h(n)$ | Pondera o custo acumulado ($g$) e a estimativa restante ($h$). Identifica a armadilha do "U" preventivamente e contorna por rotas perimetrais livres com garantia de otimalidade. |

---

## Cenários Avaliados (SUS)

| Cenário | Configuração da Planta | Fenômeno Investigado |
|---|---|---|
| **1. UBS Porte I** | Corredor central desimpedido ligando Recepção a Procedimentos. | Convergência rápida e linear onde ambos os algoritmos produzem caminhos quase idênticos. |
| **2. UPA 24h** | Ala de isolamento infeccioso em formato de "U" entre Doca e Sala Vermelha. | Armadilha de mínimo local: a Gulosa fica presa na antecâmara enquanto o A* contorna com rota ótima. |
| **3. Hospital Geral** | Corredor central com tráfego intenso ($g=5.0$) vs. corredor perimetral norte livre. | Avaliação de custo acumulado: a Gulosa insiste no corredor lento por ser linha reta; o A* adota o bypass. |

---

## Funcionalidades da Interface

| Recurso | Detalhes |
|---|---|
| **Planta Cianotipia 2D** | Renderização em Canvas a 60 FPS com estética arquitetônica Blueprint (`#00233d`). |
| **Navegação Interativa** | Zoom contínuo (0.5x a 2.5x via botões `+`, `-`, `1:1` e roda do mouse) e Pan por arraste (`drag & drop`). |
| **Controles Flutuantes** | Header esmeralda (`#059669`), seletor de cenários e dock de execução sem sobreposição visual. |
| **Painel de Telemetria** | Gaveta lateral retrátil com métricas de tempo de CPU (ms), nós visitados, custo ($g$) e passos. |
| **Velocidade Ajustável** | Controle de delay passo a passo de 5 ms a 100 ms para fins didáticos. |

---

## Arquitetura do Repositório

```text
├── src/
│   ├── core/              # Lógica algorítmica desacoplada (A*, Gulosa, Heap, Heurística)
│   ├── components/        # Componentes visuais em React (CanvasMap, Docks, Drawer)
│   ├── data/              # Definições estáticas dos cenários SUS
│   ├── hooks/             # Custom hook useHospitalSearch para animação fluida
│   └── styles/            # Estilização modular em Vanilla CSS (sem Tailwind)
├── tests/                 # Suíte nativa de testes unitários (node --test)
├── .gitignore             # Ignora /docs e artefatos de build
└── package.json           # Scripts e dependências mínimas
```

---

## Fundamentação Científica

* **Liu, G. (2023).** *Research on the optimum path — Taking the hospital delivery robot as an example*. Applied and Computational Engineering, 16, 86–91. [DOI: 10.54254/2755-2721/16/20230871](https://doi.org/10.54254/2755-2721/16/20230871).
* **Yin, C. et al. (2024).** *An Improved A-Star Path Planning Algorithm Based on Mobile Robots in Medical Testing Laboratories*. Sensors (MDPI), 24(6), 1784. [DOI: 10.3390/s24061784](https://doi.org/10.3390/s24061784).
* **ANVISA.** *Resolução RDC nº 50/2002: Regulamento Técnico para planejamento e projetos físicos de estabelecimentos assistenciais de saúde*.

---

## Autores e Contexto Acadêmico

Projeto prático desenvolvido para a disciplina de **Sistemas Inteligentes** do curso de Análise e Desenvolvimento de Sistemas — **Instituto Federal de Pernambuco (IFPE)**.
