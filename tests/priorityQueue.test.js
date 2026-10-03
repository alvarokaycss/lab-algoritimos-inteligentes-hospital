import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FilaPrioridade } from '../src/core/filaPrioridade.js';

test('FilaPrioridade inicializa vazia', () => {
  const fila = new FilaPrioridade();
  assert.equal(fila.estaVazia(), true);
  assert.equal(fila.tamanho, 0);
  assert.equal(fila.espiar(), null);
  assert.equal(fila.desenfileirar(), null);
});

test('FilaPrioridade insere e extrai elemento unico', () => {
  const fila = new FilaPrioridade();
  fila.enfileirar('paciente_grave', 1);

  assert.equal(fila.estaVazia(), false);
  assert.equal(fila.tamanho, 1);
  assert.equal(fila.espiar(), 'paciente_grave');
  assert.equal(fila.desenfileirar(), 'paciente_grave');
  assert.equal(fila.estaVazia(), true);
});

test('FilaPrioridade extrai sempre o menor elemento (ordem estrita de Min-Heap)', () => {
  const fila = new FilaPrioridade();

  // Inserção em ordem totalmente embaralhada
  fila.enfileirar('D', 40);
  fila.enfileirar('A', 10);
  fila.enfileirar('C', 30);
  fila.enfileirar('E', 50);
  fila.enfileirar('B', 20);

  assert.equal(fila.tamanho, 5);
  assert.equal(fila.espiar(), 'A');

  // Devem sair em ordem estritamente crescente de prioridade
  assert.equal(fila.desenfileirar(), 'A'); // 10
  assert.equal(fila.desenfileirar(), 'B'); // 20
  assert.equal(fila.desenfileirar(), 'C'); // 30
  assert.equal(fila.desenfileirar(), 'D'); // 40
  assert.equal(fila.desenfileirar(), 'E'); // 50
  assert.equal(fila.estaVazia(), true);
});

test('FilaPrioridade lida com prioridades float e coordenadas de nos', () => {
  const fila = new FilaPrioridade();

  const no1 = { x: 0, y: 1 };
  const no2 = { x: 3, y: 4 };
  const no3 = { x: 1, y: 1 };

  fila.enfileirar(no1, 14.14);
  fila.enfileirar(no2, 5.0);
  fila.enfileirar(no3, 7.82);

  assert.deepEqual(fila.desenfileirar(), no2); // 5.0
  assert.deepEqual(fila.desenfileirar(), no3); // 7.82
  assert.deepEqual(fila.desenfileirar(), no1); // 14.14
  assert.equal(fila.estaVazia(), true);
});
