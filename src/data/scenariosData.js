/**
 * Definições dos 3 Cenários Reais do SUS conforme especificação:
 * 1. UBS Porte I (Fluxo Linear)
 * 2. UPA 24h (Armadilha em U - Isolamento RDC 50)
 * 3. Hospital Geral (Corredor Congestionado vs. Bypass Perimetral)
 * 
 * Integração direta com GradeHospitalar e TIPOS_CELULA do core.
 */

import { GradeHospitalar, TIPOS_CELULA } from '../core/grid.js';

/**
 * Cenário 1: UBS Porte I
 * - Corredor central desimpedido ligando a Recepção à Sala de Procedimentos.
 * - Teste de convergência direta: ambos os algoritmos convergem de forma linear e ótima.
 */
function createUbsPorte1Scenario() {
  const cols = 24;
  const rows = 14;
  const grid = new GradeHospitalar(cols, rows);

  // Paredes externas de contorno
  for (let x = 0; x < cols; x++) {
    grid.definirCelula(x, 0, TIPOS_CELULA.PAREDE);
    grid.definirCelula(x, rows - 1, TIPOS_CELULA.PAREDE);
  }
  for (let y = 0; y < rows; y++) {
    grid.definirCelula(0, y, TIPOS_CELULA.PAREDE);
    grid.definirCelula(cols - 1, y, TIPOS_CELULA.PAREDE);
  }

  // Divisórias das salas do norte (y=1 a 4)
  // Corredor livre central passa em y=5, 6, 7, 8
  // Divisórias das salas do sul (y=9 a 12)
  for (let x = 1; x < cols - 1; x++) {
    grid.definirCelula(x, 5, TIPOS_CELULA.PAREDE);
    grid.definirCelula(x, 9, TIPOS_CELULA.PAREDE);
  }

  // Paredes verticais separando consultórios superiores
  [5, 10, 15, 19].forEach((wx) => {
    for (let y = 1; y < 5; y++) grid.definirCelula(wx, y, TIPOS_CELULA.PAREDE);
  });

  // Paredes verticais separando salas inferiores
  [6, 12, 18].forEach((wx) => {
    for (let y = 10; y < rows - 1; y++) grid.definirCelula(wx, y, TIPOS_CELULA.PAREDE);
  });

  // Portas de acesso ao corredor central (tornando as células transitáveis)
  // Portas superiores (y=5)
  [3, 8, 13, 17, 21].forEach((dx) => {
    grid.definirCelula(dx, 5, TIPOS_CELULA.LIVRE);
  });

  // Portas inferiores (y=9)
  [3, 9, 15, 21].forEach((dx) => {
    grid.definirCelula(dx, 9, TIPOS_CELULA.LIVRE);
  });

  const rooms = [
    { id: 'rec', name: 'Recepção / Triagem', sublabel: 'Acolhimento SUS', x: 1, y: 1, width: 4, height: 4 },
    { id: 'c1', name: 'Consultório 1', sublabel: 'Clínica Geral', x: 6, y: 1, width: 4, height: 4 },
    { id: 'c2', name: 'Consultório 2', sublabel: 'Pediatria', x: 11, y: 1, width: 4, height: 4 },
    { id: 'vac', name: 'Sala de Vacinas', sublabel: 'PNI / Frios', x: 16, y: 1, width: 3, height: 4 },
    { id: 'alm', name: 'Almoxarifado', sublabel: 'Insumos', x: 20, y: 1, width: 3, height: 4 },

    { id: 'esp', name: 'Espera Principal', sublabel: 'Assentos Macas', x: 1, y: 10, width: 5, height: 3 },
    { id: 'odo', name: 'Odontologia', sublabel: 'CEO', x: 7, y: 10, width: 5, height: 3 },
    { id: 'far', name: 'Farmácia Básica', sublabel: 'Dispensação', x: 13, y: 10, width: 5, height: 3 },
    { id: 'proc', name: 'Procedimentos', sublabel: 'Curativos e Suturas', x: 19, y: 10, width: 4, height: 3 }
  ];

  return {
    id: 'ubs_porte_1',
    name: '1. UBS Porte I',
    badge: 'Fluxo Linear',
    subtitle: 'Corredor Central Desimpedido • Convergência Direta',
    description: 'Unidade Básica de Saúde com tráfego desimpedido ao longo do corredor central. Demonstra como ambos os algoritmos (Gulosa e A*) convergem rapidamente sem armadilhas de mínimo local.',
    cols,
    rows,
    grid,
    start: { x: 2, y: 7, label: 'Triagem Macas' },
    target: { x: 21, y: 7, label: 'Sala Procedimentos' },
    reference: 'Manual de Estrutura Física das UBS (Ministério da Saúde / SUS)',
    rooms,
    isolationZones: [],
    congestionZones: []
  };
}

/**
 * Cenário 2: UPA 24h
 * - Barreira côncava em formato de "U" de Isolamento Infeccioso (ANVISA RDC 50)
 *   colocada estrategicamente entre a Doca de Macas e a Sala Vermelha.
 * - Teste de mínimo local: a Busca Gulosa entra na antecâmara atraída pela proximidade
 *   em linha reta da parede de fundo, bate no fundo cego e gasta dezenas de nós retrocedendo.
 * - O A* pondera o custo g e contorna antecipadamente pela rota perimetral ótima.
 */
function createUpa24hScenario() {
  const cols = 28;
  const rows = 16;
  const grid = new GradeHospitalar(cols, rows);

  // Paredes externas de contorno
  for (let x = 0; x < cols; x++) {
    grid.definirCelula(x, 0, TIPOS_CELULA.PAREDE);
    grid.definirCelula(x, rows - 1, TIPOS_CELULA.PAREDE);
  }
  for (let y = 0; y < rows; y++) {
    grid.definirCelula(0, y, TIPOS_CELULA.PAREDE);
    grid.definirCelula(cols - 1, y, TIPOS_CELULA.PAREDE);
  }

  // Salas laterais esquerdas (Doca e Manchester)
  for (let y = 1; y < 6; y++) grid.definirCelula(6, y, TIPOS_CELULA.PAREDE);
  for (let y = 10; y < rows - 1; y++) grid.definirCelula(6, y, TIPOS_CELULA.PAREDE);

  // Salas da direita (Observação, Posto e Sala Vermelha)
  for (let y = 1; y < 6; y++) grid.definirCelula(21, y, TIPOS_CELULA.PAREDE);
  for (let y = 10; y < rows - 1; y++) grid.definirCelula(21, y, TIPOS_CELULA.PAREDE);

  // BARREIRA EM "U" DE ISOLAMENTO INFECCIOSO (ANVISA RDC 50)
  // Ala Norte do U: x=11..17, y=5..6
  for (let x = 11; x <= 17; x++) {
    grid.definirCelula(x, 5, TIPOS_CELULA.ISOLAMENTO);
    grid.definirCelula(x, 6, TIPOS_CELULA.ISOLAMENTO);
  }

  // Ala Sul do U: x=11..17, y=10..11
  for (let x = 11; x <= 17; x++) {
    grid.definirCelula(x, 10, TIPOS_CELULA.ISOLAMENTO);
    grid.definirCelula(x, 11, TIPOS_CELULA.ISOLAMENTO);
  }

  // Fundo cego do U (Ala Leste): x=16..17, y=7..9
  for (let y = 7; y <= 9; y++) {
    grid.definirCelula(16, y, TIPOS_CELULA.ISOLAMENTO);
    grid.definirCelula(17, y, TIPOS_CELULA.ISOLAMENTO);
  }

  // O interior do U (x=11..15, y=7..9) é transitável (células livres), formando uma
  // antecâmara sem saída onde a parede de fundo (x=16,17) fica alinhada com o alvo (x=25, y=8).

  const isolationZones = [
    {
      x: 11,
      y: 5,
      width: 7,
      height: 2,
      label: 'ISOLAMENTO RDC 50 (ALA NORTE)'
    },
    {
      x: 11,
      y: 10,
      width: 7,
      height: 2,
      label: 'ISOLAMENTO RDC 50 (ALA SUL)'
    },
    {
      x: 16,
      y: 7,
      width: 2,
      height: 3,
      label: 'PAREDE FUNDO'
    }
  ];

  const rooms = [
    { id: 'doca', name: 'Doca de Macas', sublabel: 'SAMU 192 / Resgate', x: 1, y: 1, width: 5, height: 5 },
    { id: 'manch', name: 'Triagem Manchester', sublabel: 'Classificação de Risco', x: 1, y: 10, width: 5, height: 5 },
    { id: 'rx', name: 'Sala de Raio-X', sublabel: 'Imagem Digital', x: 8, y: 1, width: 5, height: 3 },
    { id: 'lab', name: 'Laboratório Rápido', sublabel: 'Gasometria', x: 15, y: 1, width: 5, height: 3 },
    { id: 'posto', name: 'Posto Enfermagem', sublabel: 'Central Clínica', x: 22, y: 1, width: 5, height: 5 },
    { id: 'obs', name: 'Sala Amarela', sublabel: 'Observação 24h', x: 22, y: 10, width: 5, height: 5 },
    { id: 'vermelha', name: 'Sala Vermelha', sublabel: 'Ressuscitação / Parada', x: 22, y: 6, width: 5, height: 4, fillColor: 'rgba(239, 68, 68, 0.25)', borderColor: '#f87171' }
  ];

  return {
    id: 'upa_24h',
    name: '2. UPA 24h',
    badge: 'Mínimo Local (Armadilha em U)',
    subtitle: 'Ala de Isolamento RDC 50 • Barreira Côncava',
    description: 'Apresenta a Ala de Isolamento de Risco Infeccioso (ANVISA RDC 50) em formato côncavo ("U"). A Busca Gulosa cai na armadilha por miopia da bússola em linha reta, enquanto o A* contorna antecipadamente pela rota ótima.',
    cols,
    rows,
    grid,
    start: { x: 2, y: 8, label: 'Doca Macas' },
    target: { x: 25, y: 8, label: 'Sala Vermelha' },
    reference: 'Manual Instrutivo UPA 24h (Portaria GM/MS nº 10/2017) / ANVISA RDC 50',
    rooms,
    isolationZones,
    congestionZones: []
  };
}

/**
 * Cenário 3: Hospital Geral de Alta Complexidade
 * - Corredor central com congestionamento severo (g = 5.0) por circulação de macas e equipes.
 * - Corredor perimetral norte com tráfego desimpedido (g = 1.0), porém mais longo geometricamente.
 * - Teste de ponderação g: A Busca Gulosa teima na linha reta lenta; o A* adota o desvio norte (bypass).
 */
function createHospitalGeralScenario() {
  const cols = 30;
  const rows = 18;
  const grid = new GradeHospitalar(cols, rows);

  // Paredes externas de contorno
  for (let x = 0; x < cols; x++) {
    grid.definirCelula(x, 0, TIPOS_CELULA.PAREDE);
    grid.definirCelula(x, rows - 1, TIPOS_CELULA.PAREDE);
  }
  for (let y = 0; y < rows; y++) {
    grid.definirCelula(0, y, TIPOS_CELULA.PAREDE);
    grid.definirCelula(cols - 1, y, TIPOS_CELULA.PAREDE);
  }

  // Paredes centrais separando o corredor norte do corredor principal
  // Linha de alvenaria em y=5 com passagens de acesso
  for (let x = 6; x <= 23; x++) {
    grid.definirCelula(x, 5, TIPOS_CELULA.PAREDE);
  }
  // Aberturas para o Bypass Norte nas extremidades
  grid.definirCelula(6, 5, TIPOS_CELULA.LIVRE);
  grid.definirCelula(23, 5, TIPOS_CELULA.LIVRE);

  // Paredes inferiores delimitando alas de internação
  for (let x = 6; x <= 23; x++) {
    grid.definirCelula(x, 12, TIPOS_CELULA.PAREDE);
  }
  grid.definirCelula(10, 12, TIPOS_CELULA.LIVRE);
  grid.definirCelula(19, 12, TIPOS_CELULA.LIVRE);

  // ZONA DE CONGESTIONAMENTO INTENSO NO CORREDOR CENTRAL (y=8, 9 de x=7 a 22)
  // Custo g = 5.0 (macas paradas, carrinhos de curativo, troca de turno)
  for (let x = 7; x <= 22; x++) {
    grid.definirCelula(x, 8, TIPOS_CELULA.CONGESTIONADO);
    grid.definirCelula(x, 9, TIPOS_CELULA.CONGESTIONADO);
  }

  const congestionZones = [
    {
      x: 7,
      y: 8,
      width: 16,
      height: 2,
      label: 'CORREDOR CENTRAL CONGESTIONADO (g=5.0)'
    }
  ];

  const rooms = [
    { id: 'adm', name: 'Admissão Geral', sublabel: 'Pronto-Socorro', x: 1, y: 7, width: 5, height: 4 },
    { id: 'uti1', name: 'UTI Geral 1', sublabel: 'Leitos Intensivos', x: 7, y: 1, width: 7, height: 4 },
    { id: 'uti2', name: 'UTI Geral 2', sublabel: 'Coronariana', x: 16, y: 1, width: 7, height: 4 },
    { id: 'byp', name: 'Bypass Perimetral Norte', sublabel: 'Corredor Rápido (g=1.0)', x: 7, y: 4, width: 16, height: 1, fillColor: 'rgba(56, 189, 248, 0.12)', borderColor: 'rgba(56, 189, 248, 0.4)' },
    { id: 'int', name: 'Ala de Internação', sublabel: 'Enfermarias', x: 7, y: 13, width: 16, height: 4 },
    { id: 'cir', name: 'Centro Cirúrgico', sublabel: 'Salas 1 a 4 / Bloco', x: 24, y: 7, width: 5, height: 4, fillColor: 'rgba(244, 63, 94, 0.25)', borderColor: '#fb7185' }
  ];

  return {
    id: 'hospital_geral',
    name: '3. Hospital Geral',
    badge: 'Corredor Congestionado vs. Bypass',
    subtitle: 'Corredor Central g=5.0 • Desvio Perimetral Ótimo',
    description: 'Modela o dilema entre a rota geometricamente curta com atrito severo (g=5.0) e a rota perimetral desimpedida (g=1.0). O algoritmo A* encontra a rota com menor custo total, enquanto a Gulosa insiste na linha reta.',
    cols,
    rows,
    grid,
    start: { x: 2, y: 8, label: 'Admissão' },
    target: { x: 26, y: 8, label: 'Centro Cirúrgico' },
    reference: 'ANVISA RDC 50 / Estudo de Caso Liu (2023)',
    rooms,
    isolationZones: [],
    congestionZones
  };
}

// Mapa dos cenários carregáveis por ID
export const SCENARIOS = Object.freeze({
  ubs_porte_1: createUbsPorte1Scenario,
  upa_24h: createUpa24hScenario,
  hospital_geral: createHospitalGeralScenario
});

export const SCENARIO_LIST = Object.freeze([
  { id: 'ubs_porte_1', name: '1. UBS Porte I', badge: 'Fluxo Linear' },
  { id: 'upa_24h', name: '2. UPA 24h', badge: 'Armadilha em U' },
  { id: 'hospital_geral', name: '3. Hospital Geral', badge: 'Congestionamento' }
]);

/**
 * Obtém uma nova instância do cenário pelo ID.
 * @param {string} id 
 */
export function getScenario(id = 'ubs_porte_1') {
  const factory = SCENARIOS[id] || SCENARIOS.ubs_porte_1;
  return factory();
}
