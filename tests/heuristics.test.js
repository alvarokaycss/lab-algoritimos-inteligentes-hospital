import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distanciaEuclidiana } from '../src/core/heuristicas.js';

test('distanciaEuclidiana calcula hipotenusa do triangulo retangulo (3-4-5)', () => {
  const d = distanciaEuclidiana({ x: 0, y: 0 }, { x: 3, y: 4 });
  assert.equal(d, 5.0);
});

test('distanciaEuclidiana retorna zero quando origem e meta sao o mesmo ponto', () => {
  const d = distanciaEuclidiana({ x: 12, y: 25 }, { x: 12, y: 25 });
  assert.equal(d, 0.0);
});

test('distanciaEuclidiana calcula deslocamento estritamente horizontal ou vertical', () => {
  const horizontal = distanciaEuclidiana({ x: 5, y: 10 }, { x: 15, y: 10 });
  const vertical = distanciaEuclidiana({ x: 10, y: 2 }, { x: 10, y: 8 });

  assert.equal(horizontal, 10.0);
  assert.equal(vertical, 6.0);
});

test('distanciaEuclidiana lida corretamente com coordenadas negativas', () => {
  const d = distanciaEuclidiana({ x: -2, y: -3 }, { x: 1, y: 1 });
  assert.equal(d, 5.0);
});
