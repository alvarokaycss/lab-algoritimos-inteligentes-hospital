import { FilaPrioridade } from './filaPrioridade.js';
import  { distanciaEuclidiana } from './heuristicas.js';


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
