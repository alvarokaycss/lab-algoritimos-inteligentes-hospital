import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GradeHospitalar, TIPOS_CELULA } from '../src/core/grid.js';

test('GradeHospitalar inicializa com dimensoes corretas e celulas livres', () => {
  const grade = new GradeHospitalar(10, 8);
  assert.equal(grade.colunas, 10);
  assert.equal(grade.linhas, 8);
  assert.equal(grade.obterTipoCelula(0, 0), TIPOS_CELULA.LIVRE);
  assert.equal(grade.obterCusto(0, 0), 1.0);
  assert.equal(grade.ehTransitavel(0, 0), true);
});

test('GradeHospitalar valida limites do tabuleiro corretamente', () => {
  const grade = new GradeHospitalar(5, 5);
  assert.equal(grade.estaDentroDosLimites(0, 0), true);
  assert.equal(grade.estaDentroDosLimites(4, 4), true);
  assert.equal(grade.estaDentroDosLimites(-1, 2), false);
  assert.equal(grade.estaDentroDosLimites(2, -1), false);
  assert.equal(grade.estaDentroDosLimites(5, 2), false);
  assert.equal(grade.estaDentroDosLimites(2, 5), false);
  assert.equal(grade.obterCusto(-1, 0), Infinity);
});

test('GradeHospitalar define e consulta celulas de parede e isolamento (custo infinito e intransitavel)', () => {
  const grade = new GradeHospitalar(5, 5);

  grade.definirCelula(2, 1, TIPOS_CELULA.PAREDE);
  grade.definirCelula(2, 2, TIPOS_CELULA.ISOLAMENTO);

  assert.equal(grade.ehTransitavel(2, 1), false);
  assert.equal(grade.obterCusto(2, 1), Infinity);

  assert.equal(grade.ehTransitavel(2, 2), false);
  assert.equal(grade.obterCusto(2, 2), Infinity);
});

test('GradeHospitalar define celula congestionada (custo 5.0 e transitavel)', () => {
  const grade = new GradeHospitalar(5, 5);

  grade.definirCelula(3, 3, TIPOS_CELULA.CONGESTIONADO);

  assert.equal(grade.ehTransitavel(3, 3), true);
  assert.equal(grade.obterCusto(3, 3), 5.0);
});

test('GradeHospitalar retorna 4 vizinhos no centro do mapa quando tudo esta livre', () => {
  const grade = new GradeHospitalar(5, 5);
  const vizinhos = grade.obterVizinhos(2, 2);

  assert.equal(vizinhos.length, 4);
  assert.deepEqual(vizinhos, [
    { x: 2, y: 1 }, // cima
    { x: 3, y: 2 }, // direita
    { x: 2, y: 3 }, // baixo
    { x: 1, y: 2 }  // esquerda
  ]);
});

test('GradeHospitalar respeita bordas e cantos do mapa (apenas 2 vizinhos no canto 0,0)', () => {
  const grade = new GradeHospitalar(5, 5);
  const vizinhos = grade.obterVizinhos(0, 0);

  assert.equal(vizinhos.length, 2);
  assert.deepEqual(vizinhos, [
    { x: 1, y: 0 }, // direita
    { x: 0, y: 1 }  // baixo
  ]);
});

test('GradeHospitalar filtra vizinhos que sao paredes ou isolamento', () => {
  const grade = new GradeHospitalar(5, 5);

  // Bloqueia a direita com parede e baixo com isolamento
  grade.definirCelula(3, 2, TIPOS_CELULA.PAREDE);
  grade.definirCelula(2, 3, TIPOS_CELULA.ISOLAMENTO);

  const vizinhos = grade.obterVizinhos(2, 2);

  // Restam apenas cima (2, 1) e esquerda (1, 2)
  assert.equal(vizinhos.length, 2);
  assert.deepEqual(vizinhos, [
    { x: 2, y: 1 }, // cima
    { x: 1, y: 2 }  // esquerda
  ]);
});
