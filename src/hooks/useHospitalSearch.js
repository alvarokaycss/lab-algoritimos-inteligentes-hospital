import { useState, useRef, useEffect, useCallback } from 'react';
import { executarAStar } from '../core/astar.js';
import { executarBuscaGulosa } from '../core/buscaGulosa.js';

/**
 * Prepara e executa o cálculo dos algoritmos para o cenário fornecido.
 * Mapeia métricas para a estrutura esperada pela DrawerMetrics.
 * 
 * @param {object} scenario - Objeto do cenário retornado por getScenario
 * @param {'both' | 'astar' | 'greedy'} activeAlgorithm - Algoritmo(s) ativos
 * @returns {object} Dados computados de busca, rotas e telemetria
 */
export function prepareHospitalSearch(scenario, activeAlgorithm = 'both') {
  if (!scenario || !scenario.grid) {
    return {
      astarResult: null,
      greedyResult: null,
      finalRoutes: {},
      metrics: {},
      maxSteps: 0
    };
  }

  const start = scenario.start;
  const target = scenario.target || scenario.goal;

  let astarResult = null;
  let greedyResult = null;

  if (activeAlgorithm === 'both' || activeAlgorithm === 'astar') {
    astarResult = executarAStar(scenario.grid, start, target);
  }

  if (activeAlgorithm === 'both' || activeAlgorithm === 'greedy') {
    greedyResult = executarBuscaGulosa(scenario.grid, start, target);
  }

  const finalRoutes = {};
  if (astarResult && astarResult.caminho && astarResult.caminho.length > 0) {
    finalRoutes.astar = astarResult.caminho;
  }
  if (greedyResult && greedyResult.caminho && greedyResult.caminho.length > 0) {
    finalRoutes.greedy = greedyResult.caminho;
  }

  const metrics = {};
  if (astarResult && astarResult.metricas) {
    metrics.astar = {
      timeMs: Number(astarResult.metricas.tempoCpuMs),
      nodesVisited: astarResult.metricas.nosVisitados,
      pathCost: astarResult.metricas.custoTotal,
      pathLength: astarResult.metricas.passos
    };
  }
  if (greedyResult && greedyResult.metricas) {
    metrics.greedy = {
      timeMs: Number(greedyResult.metricas.tempoCpuMs),
      nodesVisited: greedyResult.metricas.nosVisitados,
      pathCost: greedyResult.metricas.custoTotal,
      pathLength: greedyResult.metricas.passos
    };
  }

  const astarExploredCount = astarResult ? astarResult.nosExplorados.length : 0;
  const greedyExploredCount = greedyResult ? greedyResult.nosExplorados.length : 0;
  const maxSteps = Math.max(astarExploredCount, greedyExploredCount);

  return {
    astarResult,
    greedyResult,
    finalRoutes,
    metrics,
    maxSteps
  };
}

/**
 * Custom hook para orquestrar a execução, reprodução e animação passo a passo
 * das buscas algorítmicas sobre o Canvas 2D da planta hospitalar.
 */
export function useHospitalSearch({ scenario, activeAlgorithm = 'both', speedMs = 20 }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Estados emitidos para o Canvas e Drawer
  const [exploredNodes, setExploredNodes] = useState([]);
  const [routes, setRoutes] = useState({});
  const [metrics, setMetrics] = useState({});

  // Armazenamento em ref para persistir cálculo e progresso de animação
  const searchDataRef = useRef(null);
  const currentStepRef = useRef(0);
  const timerRef = useRef(null);

  // Limpa timer ativo
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Reset completo
  const reset = useCallback(() => {
    clearTimer();
    searchDataRef.current = null;
    currentStepRef.current = 0;
    setIsRunning(false);
    setIsPaused(false);
    setExploredNodes(activeAlgorithm === 'both' ? { astar: [], greedy: [] } : []);
    setRoutes({});
    setMetrics({});
  }, [clearTimer, activeAlgorithm]);

  // Pausa a animação mantendo o estado atual
  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setIsPaused(true);
  }, [clearTimer]);

  // Inicia ou retoma a reprodução da busca
  const play = useCallback(() => {
    if (!scenario) return;

    // Se não estiver pausado ou se não houver busca preparada, calcula do início
    if (!searchDataRef.current || currentStepRef.current === 0) {
      searchDataRef.current = prepareHospitalSearch(scenario, activeAlgorithm);
      currentStepRef.current = 0;
      setRoutes({});
      setMetrics({});
    }

    const searchData = searchDataRef.current;
    if (!searchData || searchData.maxSteps === 0) return;

    setIsRunning(true);
    setIsPaused(false);

    clearTimer();

    timerRef.current = setInterval(() => {
      currentStepRef.current += 1;
      const step = currentStepRef.current;

      const astarExplored = searchData.astarResult
        ? searchData.astarResult.nosExplorados.slice(0, step)
        : [];

      const greedyExplored = searchData.greedyResult
        ? searchData.greedyResult.nosExplorados.slice(0, step)
        : [];

      if (activeAlgorithm === 'both') {
        setExploredNodes({ astar: astarExplored, greedy: greedyExplored });
      } else if (activeAlgorithm === 'astar') {
        setExploredNodes(astarExplored);
      } else {
        setExploredNodes(greedyExplored);
      }

      // Ao alcançar a quantidade total de passos, finaliza e exibe as rotas e métricas
      if (step >= searchData.maxSteps) {
        clearTimer();
        setIsRunning(false);
        setIsPaused(false);
        setRoutes(searchData.finalRoutes);
        setMetrics(searchData.metrics);
      }
    }, Math.max(5, speedMs));
  }, [scenario, activeAlgorithm, speedMs, clearTimer]);

  // Se trocar de cenário ou algoritmo, reseta suavemente
  useEffect(() => {
    reset();
  }, [scenario?.id, activeAlgorithm, reset]);

  // Limpeza de recursos no unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    isRunning,
    isPaused,
    exploredNodes,
    exploredAlgorithm: activeAlgorithm,
    routes,
    metrics,
    play,
    pause,
    reset
  };
}

export default useHospitalSearch;
