import { useState, useMemo } from 'react';
import './App.css';
import CanvasMap from './components/CanvasMap.jsx';
import FloatingHeader from './components/FloatingHeader.jsx';
import ZoomDock from './components/ZoomDock.jsx';
import DrawerMetrics from './components/DrawerMetrics.jsx';
import BottomDocks from './components/BottomDocks.jsx';
import ScenarioSelector from './components/ScenarioSelector.jsx';
import { getScenario } from './data/scenariosData.js';
import { useHospitalSearch } from './hooks/useHospitalSearch.js';

export default function App() {
  // Cenário clínico ativo
  const [selectedScenarioId, setSelectedScenarioId] = useState('ubs_porte_1');

  // Modo de algoritmo selecionado: 'both' | 'astar' | 'greedy'
  const [activeAlgorithm, setActiveAlgorithm] = useState('both');

  // Estados de navegação 2D da câmera (escala e translação)
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Controle de visibilidade do painel lateral de métricas (push layout)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Parâmetros de execução da busca (slider na gaveta)
  const [speedMs, setSpeedMs] = useState(20);

  // Instanciação memoizada do cenário selecionado
  const currentScenario = useMemo(() => {
    return getScenario(selectedScenarioId);
  }, [selectedScenarioId]);

  // Hook de orquestração algorítmica, animação e telemetria
  const {
    isRunning,
    isPaused,
    exploredNodes,
    exploredAlgorithm,
    routes,
    metrics,
    play: handlePlay,
    pause: handlePause,
    reset: handleReset
  } = useHospitalSearch({
    scenario: currentScenario,
    activeAlgorithm,
    speedMs
  });

  // Manipuladores de escala de visualização
  const handleZoomIn = () => {
    setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));
  };

  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Alternância de cenário com recalibração de visualização
  const handleSelectScenario = (id) => {
    setSelectedScenarioId(id);
    handleReset();
  };

  return (
    <div className="app-main">
      {/* GAVETA LATERAL RETRÁTIL (PUSH LAYOUT) */}
      <DrawerMetrics
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        scenario={currentScenario}
        metrics={metrics}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
      />

      {/* ÁREA DO MAPA 2D (PRANCHETA BLUEPRINT E ELEMENTOS FLUTUANTES) */}
      <main className="map-container">
        <div className="blueprint-frame" id="canvasFrame">
          <CanvasMap
            scenario={currentScenario}
            activeAlgorithm={activeAlgorithm}
            exploredNodes={exploredNodes}
            exploredAlgorithm={exploredAlgorithm}
            routes={routes}
            zoom={zoom}
            pan={pan}
            onZoomChange={setZoom}
            onPanChange={setPan}
          />
        </div>

        {/* BOTÃO FLUTUANTE DE CONFIGURAÇÕES (SUPERIOR ESQUERDO - 40px) */}
        <button
          type="button"
          className="floating-menu-btn"
          id="btnToggleDrawer"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          aria-label="Abrir configurações e métricas"
          title="Configurações e Métricas"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {/* CONTROLES DE ZOOM FLUTUANTES (SUPERIOR ESQUERDO, ABAIXO DA CONFIG - 40px) */}
        <ZoomDock
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
        />

        {/* HEADER FLUTUANTE CENTRALIZADO (TOPO CENTRO - 42px) */}
        <FloatingHeader />

        {/* SELETOR DE CENÁRIOS (SUPERIOR DIREITO) */}
        <ScenarioSelector
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={handleSelectScenario}
        />

        {/* BARRA INFERIOR DE DOCAS FLUTUANTES (LEGENDA E PLAYER DESACOPLADOS) */}
        <BottomDocks
          activeAlgorithm={activeAlgorithm}
          onSelectAlgorithm={setActiveAlgorithm}
          isRunning={isRunning}
          isPaused={isPaused}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
        />
      </main>
    </div>
  );
}
