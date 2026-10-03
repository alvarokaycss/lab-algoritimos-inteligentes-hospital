import test from 'node:test';
import assert from 'node:assert/strict';
import { getScenario } from '../src/data/scenariosData.js';
import { prepareHospitalSearch } from '../src/hooks/useHospitalSearch.js';

test('prepareHospitalSearch executa ambos os algoritmos no Cenário 1 (UBS Porte I)', () => {
  const scenario = getScenario('ubs_porte_1');
  const search = prepareHospitalSearch(scenario, 'both');

  assert.ok(search.astarResult, 'A* deve produzir resultado');
  assert.ok(search.greedyResult, 'Busca Gulosa deve produzir resultado');
  assert.ok(search.finalRoutes.astar.length > 0, 'A* deve encontrar caminho');
  assert.ok(search.finalRoutes.greedy.length > 0, 'Gulosa deve encontrar caminho');

  // No Cenário 1 (corredor livre linear), ambos os caminhos devem ter mesmo número de passos
  assert.equal(
    search.finalRoutes.astar.length,
    search.finalRoutes.greedy.length,
    'Caminho no corredor linear deve ter o mesmo comprimento'
  );

  // Validação das métricas formatadas para DrawerMetrics
  assert.ok(search.metrics.astar.timeMs !== undefined);
  assert.ok(search.metrics.greedy.timeMs !== undefined);
  assert.equal(search.metrics.astar.pathCost, search.metrics.greedy.pathCost);
});

test('prepareHospitalSearch comprova que A* contorna a barreira em U (UPA 24h) com rota de menor custo', () => {
  const scenario = getScenario('upa_24h');
  const search = prepareHospitalSearch(scenario, 'both');

  assert.ok(search.finalRoutes.astar.length > 0);
  assert.ok(search.finalRoutes.greedy.length > 0);

  // A* deve encontrar rota ótima menor ou igual à Gulosa
  assert.ok(
    search.metrics.astar.pathCost <= search.metrics.greedy.pathCost,
    'Custo do A* deve ser menor ou igual ao da Gulosa na barreira em U'
  );
});

test('prepareHospitalSearch respeita seleção de algoritmo único', () => {
  const scenario = getScenario('ubs_porte_1');

  const onlyAstar = prepareHospitalSearch(scenario, 'astar');
  assert.ok(onlyAstar.astarResult);
  assert.equal(onlyAstar.greedyResult, null);
  assert.ok(onlyAstar.finalRoutes.astar);
  assert.ok(!onlyAstar.finalRoutes.greedy);

  const onlyGreedy = prepareHospitalSearch(scenario, 'greedy');
  assert.equal(onlyGreedy.astarResult, null);
  assert.ok(onlyGreedy.greedyResult);
  assert.ok(!onlyGreedy.finalRoutes.astar);
  assert.ok(onlyGreedy.finalRoutes.greedy);
});

test('prepareHospitalSearch comprova que A* adota o bypass no Cenário 3 (Hospital Geral)', () => {
  const scenario = getScenario('hospital_geral');
  const search = prepareHospitalSearch(scenario, 'both');

  assert.ok(search.finalRoutes.astar.length > 0);
  assert.ok(search.finalRoutes.greedy.length > 0);

  // O custo do A* deve ser estritamente menor do que o da Gulosa
  assert.ok(
    search.metrics.astar.pathCost < search.metrics.greedy.pathCost,
    `A* (${search.metrics.astar.pathCost}) deve ter custo estritamente menor que Gulosa (${search.metrics.greedy.pathCost})`
  );
});
