import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GradeHospitalar, TIPOS_CELULA } from '../src/core/grid.js';
import { executarAStar } from '../src/core/astar.js';

test('A* encontra caminho ótimo em linha reta desimpedida', () => {
  const grade = new GradeHospitalar(10, 5);
  const inicio = { x: 0, y: 2 };
  const destino = { x: 8, y: 2 };

  const resultado = executarAStar(grade, inicio, destino);

  assert.ok(resultado.caminho.length > 0, 'Deveria encontrar um caminho');
  assert.deepEqual(resultado.caminho[0], inicio);
  assert.deepEqual(resultado.caminho[resultado.caminho.length - 1], destino);
  assert.equal(resultado.metricas.passos, 8);
  assert.equal(resultado.metricas.custoTotal, 8.0);
});

test('A* retorna caminho vazio quando o destino é inacessível', () => {
  const grade = new GradeHospitalar(5, 5);
  const inicio = { x: 0, y: 0 };
  const destino = { x: 4, y: 4 };

  // Bloqueio completo ao redor do destino
  grade.definirCelula(3, 4, TIPOS_CELULA.PAREDE);
  grade.definirCelula(4, 3, TIPOS_CELULA.PAREDE);

  const resultado = executarAStar(grade, inicio, destino);

  assert.equal(resultado.caminho.length, 0);
  assert.equal(resultado.metricas.passos, 0);
  assert.equal(resultado.metricas.custoTotal, 0);
});

test('A* contorna paredes e encontra a rota de menor custo', () => {
  const grade = new GradeHospitalar(7, 5);
  const inicio = { x: 1, y: 2 };
  const destino = { x: 5, y: 2 };

  // Parede vertical
  grade.definirCelula(3, 1, TIPOS_CELULA.PAREDE);
  grade.definirCelula(3, 2, TIPOS_CELULA.PAREDE);
  grade.definirCelula(3, 3, TIPOS_CELULA.PAREDE);

  const resultado = executarAStar(grade, inicio, destino);

  assert.ok(resultado.caminho.length > 0);
  assert.deepEqual(resultado.caminho[0], inicio);
  assert.deepEqual(resultado.caminho[resultado.caminho.length - 1], destino);
  assert.ok(resultado.nosExplorados.length > 0);
});
