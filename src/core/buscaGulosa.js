import { FilaPrioridade } from './filaPrioridade.js';
import { distanciaEuclidiana } from './heuristicas.js';

/**
 * Executa a Busca Gulosa Pela Melhor Escolha (Greedy Best-First Search) sobre a Grade Hospitalar.
 * Função de avaliação: f(n) = h(n)
 * 
 * - h(n): Estimativa heurística admissível (distância euclidiana) de n até o destino.
 * - Desconsidera o custo acumulado g(n), orientando a expansão estritamente pela proximidade visual da meta.
 * 
 * @param {import('./grid.js').GradeHospitalar} grade - Grade hospitalar modelada
 * @param {{ x: number, y: number }} inicio - Ponto de partida (ex: Doca de Ambulâncias)
 * @param {{ x: number, y: number }} destino - Ponto de chegada (ex: Sala Vermelha / UTI)
 * @returns {{ caminho: Array<{x: number, y: number}>, nosExplorados: Array<{x: number, y: number}>, metricas: { tempoCpuMs: number, nosVisitados: number, custoTotal: number, passos: number } }}
 */
export function executarBuscaGulosa(grade, inicio, destino) {
    const tempoInicio = performance.now();

    const fronteira = new FilaPrioridade();
    const visitados = new Set();
    const veioDe = new Map();
    const nosExplorados = [];

    const chave = (p) => `${p.x},${p.y}`;

    // Doca de macas no inicio da fila com prioridade h(inicio)
    const hInicio = distanciaEuclidiana(inicio, destino);
    fronteira.enfileirar({x: inicio.x, y: inicio.y}, hInicio);
    veioDe.set(chave(inicio), null);

    let encontrou = false;
    let noAtual = null;

    while (!fronteira.estaVazia()) {
        noAtual = fronteira.desenfileirar();
        const chaveAtual = chave(noAtual);

        if (visitados.has(chaveAtual)) continue;

        visitados.add(chaveAtual);
        nosExplorados.push({x: noAtual.x, y: noAtual.y});
        
        if (noAtual.x === destino.x && noAtual.y === destino.y) {
            encontrou = true;
            break;
        }

        const vizinhos = grade.obterVizinhos(noAtual.x, noAtual.y);
        for (const vizinho of vizinhos) {
            const chaveVizinho = chave(vizinho);

            if (!visitados.has(chaveVizinho)) {
                veioDe.set(chaveVizinho, noAtual);

                const h = distanciaEuclidiana(vizinho, destino);
                fronteira.enfileirar(vizinho, h);
            }
        }
    }

    // Reconstruir o caminho
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
            tempoCpuMs: (tempoFim - tempoInicio).toFixed(2),
            nosVisitados: nosExplorados.length,
            custoTotal,
            passos: caminho.length > 0 ? caminho.length - 1 : 0
        }
    };
}
