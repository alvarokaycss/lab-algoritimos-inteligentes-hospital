import { FilaPrioridade } from './filaPrioridade.js';
import { distanciaEuclidiana } from './heuristicas.js';

/**
 * Executa o Algoritmo A* (A-Star Search) sobre a Grade Hospitalar.
 * Função de avaliação: f(n) = g(n) + h(n)
 * 
 * - g(n): Custo real acumulado desde o nó inicial até o nó n.
 * - h(n): Estimativa heurística admissível (distância euclidiana) de n até o destino.
 * 
 * @param {import('./grid.js').GradeHospitalar} grade - Grade hospitalar modelada
 * @param {{ x: number, y: number }} inicio - Ponto de partida (ex: Doca de Ambulâncias)
 * @param {{ x: number, y: number }} destino - Ponto de chegada (ex: Sala Vermelha / UTI)
 * @returns {{ caminho: Array<{x: number, y: number}>, nosExplorados: Array<{x: number, y: number}>, metricas: { tempoCpuMs: number, nosVisitados: number, custoTotal: number, passos: number } }}
 */
export function executarAStar(grade, inicio, destino) {
  const tempoInicio = performance.now();

  const fronteira = new FilaPrioridade();
  const visitados = new Set();
  const veioDe = new Map();
  const gScore = new Map();
  const nosExplorados = [];

  const chave = (p) => `${p.x},${p.y}`;

  // 1. Inicializa o nó de partida: g(início) = 0, f(início) = 0 + h(início)
  gScore.set(chave(inicio), 0);
  const hInicio = distanciaEuclidiana(inicio, destino);
  fronteira.enfileirar({ x: inicio.x, y: inicio.y }, hInicio);
  veioDe.set(chave(inicio), null);

  let encontrou = false;
  let noAtual = null;

  // 2. Laço principal de busca orientada pelo menor f = g + h
  while (!fronteira.estaVazia()) {
    noAtual = fronteira.desenfileirar();
    const chaveAtual = chave(noAtual);

    if (visitados.has(chaveAtual)) continue;

    visitados.add(chaveAtual);
    nosExplorados.push({ x: noAtual.x, y: noAtual.y });

    // Chegou ao objetivo?
    if (noAtual.x === destino.x && noAtual.y === destino.y) {
      encontrou = true;
      break;
    }

    const gAtual = gScore.get(chaveAtual) ?? Infinity;
    const vizinhos = grade.obterVizinhos(noAtual.x, noAtual.y);

    for (const vizinho of vizinhos) {
      const chaveVizinho = chave(vizinho);
      if (visitados.has(chaveVizinho)) continue;

      // Custo acumulado g = g anterior + custo da célula vizinha (1.0 livre, 5.0 congestionado)
      const custoPasso = grade.obterCusto(vizinho.x, vizinho.y);
      const gTentativo = gAtual + custoPasso;
      const gVizinhoAtual = gScore.get(chaveVizinho) ?? Infinity;

      // Encontrou um caminho melhor até esse vizinho?
      if (gTentativo < gVizinhoAtual) {
        veioDe.set(chaveVizinho, noAtual);
        gScore.set(chaveVizinho, gTentativo);

        const h = distanciaEuclidiana(vizinho, destino);
        const f = gTentativo + h;
        fronteira.enfileirar(vizinho, f);
      }
    }
  }

  // 3. Reconstrução da rota ótima por retrocesso
  const caminho = [];
  let custoTotal = 0;

  if (encontrou) {
    let passo = { x: destino.x, y: destino.y };
    while (passo !== null) {
      caminho.unshift(passo);
      if (passo.x !== inicio.x || passo.y !== inicio.y) {
        custoTotal += grade.obterCusto(passo.x, passo.y);
      }
      passo = veioDe.get(chave(passo));
    }
  }

  const tempoFim = performance.now();

  return {
    caminho,
    nosExplorados,
    metricas: {
      tempoCpuMs: +(tempoFim - tempoInicio).toFixed(2),
      nosVisitados: nosExplorados.length,
      custoTotal,
      passos: caminho.length > 0 ? caminho.length - 1 : 0
    }
  };
}
