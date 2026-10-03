import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GradeHospitalar, TIPOS_CELULA } from '../src/core/grid.js';
import { executarBuscaGulosa } from '../src/core/buscaGulosa.js';
import { executarAStar } from '../src/core/astar.js';

test('Cenário 1 (UBS Porte I - Linear): Ambos os algoritmos produzem caminho idêntico em corredor livre', () => {
  const grade = new GradeHospitalar(12, 5);
  const inicio = { x: 1, y: 2 };
  const destino = { x: 10, y: 2 };

  const gulosa = executarBuscaGulosa(grade, inicio, destino);
  const astar = executarAStar(grade, inicio, destino);

  assert.equal(gulosa.metricas.passos, astar.metricas.passos);
  assert.equal(gulosa.metricas.custoTotal, astar.metricas.custoTotal);
  assert.deepEqual(gulosa.caminho, astar.caminho);
});

test('Cenário 2 (UPA 24h - Barreira em "U"): Busca Gulosa entra no beco sem saída e A* contorna com rota ótima', () => {
  const grade = new GradeHospitalar(15, 9);
  const inicio = { x: 2, y: 4 };
  const destino = { x: 13, y: 4 };

  // Construção da barreira de isolamento côncava em "U" com abertura para a esquerda
  // Fundo do "U" (parede vertical em x = 8)
  for (let y = 2; y <= 6; y++) {
    grade.definirCelula(8, y, TIPOS_CELULA.ISOLAMENTO);
  }
  // Paredes superior e inferior do "U"
  for (let x = 4; x <= 8; x++) {
    grade.definirCelula(x, 2, TIPOS_CELULA.ISOLAMENTO);
    grade.definirCelula(x, 6, TIPOS_CELULA.ISOLAMENTO);
  }

  const gulosa = executarBuscaGulosa(grade, inicio, destino);
  const astar = executarAStar(grade, inicio, destino);

  // Ambos chegam ao destino
  assert.deepEqual(gulosa.caminho[gulosa.caminho.length - 1], destino);
  assert.deepEqual(astar.caminho[astar.caminho.length - 1], destino);

  // A Gulosa cai na armadilha: ela entra até o fundo do "U" (x = 7, y = 4)
  const gulosaVisitouFundoDoU = gulosa.nosExplorados.some(n => n.x === 7 && n.y === 4);
  assert.equal(gulosaVisitouFundoDoU, true, 'A Busca Gulosa deve ser atraída para o fundo do "U"');

  // O A* tem custo total menor ou igual ao da Gulosa
  assert.ok(astar.metricas.custoTotal <= gulosa.metricas.custoTotal);
});

test('Cenário 3 (Hospital Geral - Congestionamento): A* desvia pelo bypass limpo enquanto a Gulosa insiste no tráfego lento', () => {
  const grade = new GradeHospitalar(12, 5);
  const inicio = { x: 0, y: 2 };
  const destino = { x: 10, y: 2 };

  // Corredor central (linha y = 2) de tráfego intenso (macas com custo 5.0)
  for (let x = 2; x <= 8; x++) {
    grade.definirCelula(x, 2, TIPOS_CELULA.CONGESTIONADO);
  }

  const gulosa = executarBuscaGulosa(grade, inicio, destino);
  const astar = executarAStar(grade, inicio, destino);

  // A Busca Gulosa só olha h (linha reta), então ela atravessa o tráfego pesado
  const gulosaPassouPeloCongestionamento = gulosa.caminho.some(p => p.y === 2 && p.x >= 2 && p.x <= 8);
  assert.equal(gulosaPassouPeloCongestionamento, true, 'Gulosa deve insistir na linha reta congestionada');

  // O A* avalia f = g + h, detecta o custo acumulado alto e faz o desvio pela rota desimpedida (y = 1 ou y = 0)
  const astarDesviouDoCongestionamento = astar.caminho.some(p => p.y !== 2);
  assert.equal(astarDesviouDoCongestionamento, true, 'A* deve fazer bypass pelo corredor limpo');

  // O custo total do A* deve ser rigorosamente menor que o da Gulosa
  assert.ok(
    astar.metricas.custoTotal < gulosa.metricas.custoTotal,
    `Custo do A* (${astar.metricas.custoTotal}) deve ser menor que o da Gulosa (${gulosa.metricas.custoTotal})`
  );
});
