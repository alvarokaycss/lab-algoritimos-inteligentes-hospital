import { useState, useMemo } from 'react';
import './App.css';
import CanvasMap from './components/CanvasMap.jsx';
import FloatingHeader from './components/FloatingHeader.jsx';
import ZoomDock from './components/ZoomDock.jsx';
import DrawerMetrics from './components/DrawerMetrics.jsx';
import BottomDocks from './components/BottomDocks.jsx';
import { getScenario } from './data/scenariosData.js';

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

  // Parâmetros de execução da busca
  const [speedMs, setSpeedMs] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Dados de telemetria e rotas calculadas
  const [metrics, setMetrics] = useState({});
  const [routes, setRoutes] = useState({});
  const [exploredNodes, setExploredNodes] = useState([]);

  // Instanciação memoizada do cenário selecionado
  const currentScenario = useMemo(() => {
    return getScenario(selectedScenarioId);
  }, [selectedScenarioId]);

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
    setExploredNodes([]);
    setRoutes({});
    setMetrics({});
    setIsRunning(false);
    setIsPaused(false);
  };

  // Controle do reprodutor de busca
  const handlePlay = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setExploredNodes([]);
    setRoutes({});
  };

  return (
    <div className="app-layout">
      {/* Barra de cabeçalho com identificação do sistema e seletor de cenários SUS */}
      <FloatingHeader
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={handleSelectScenario}
      />

      {/* Área de trabalho: gaveta retrátil push layout + viewport do mapa Blueprint */}
      <div className="app-workspace">
        {/* Painel lateral retrátil de telemetria comparativa */}
        <DrawerMetrics
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          scenario={currentScenario}
          metrics={metrics}
          speedMs={speedMs}
          onSpeedChange={setSpeedMs}
        />

        {/* Viewport do mapa Canvas 2D */}
        <main className="map-container">
          <div className="blueprint-frame">
            <CanvasMap
              scenario={currentScenario}
              activeAlgorithm={activeAlgorithm}
              exploredNodes={exploredNodes}
              routes={routes}
              zoom={zoom}
              pan={pan}
              onZoomChange={setZoom}
              onPanChange={setPan}
            />
          </div>

          {/* Botão flutuante de configurações e telemetria (40x40px) */}
          <button
            type="button"
            className="config-btn"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            aria-label="Abrir painel de telemetria e configurações"
            title="Telemetria & Configurações"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
                       a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
                       A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
                       l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
                       A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
                       l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
                       a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
                       l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
                       a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {/* Dock vertical de Zoom flutuante à direita */}
          <ZoomDock
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
          />
        </main>
      </div>

      {/* Docks inferiores desacoplados: Legenda técnica à esquerda e Player à direita */}
      <BottomDocks
        activeAlgorithm={activeAlgorithm}
        onSelectAlgorithm={setActiveAlgorithm}
        isRunning={isRunning}
        isPaused={isPaused}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
      />
    </div>
  );
}
