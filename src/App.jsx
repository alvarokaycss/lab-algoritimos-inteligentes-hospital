import { useState, useMemo } from 'react';
import './App.css';
import CanvasMap from './components/CanvasMap.jsx';
import { getScenario, SCENARIO_LIST } from './data/scenariosData.js';

export default function App() {
  const [selectedScenarioId, setSelectedScenarioId] = useState('ubs_porte_1');
  const [activeAlgorithm, setActiveAlgorithm] = useState('both'); // 'both' | 'astar' | 'greedy'

  // Estados de navegação 2D (Task 7: Zoom 0.5 a 2.5 e Pan {x, y})
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Instancia o cenário selecionado (reseta pan ao trocar de cenário se desejar)
  const currentScenario = useMemo(() => {
    return getScenario(selectedScenarioId);
  }, [selectedScenarioId]);

  // Handlers do Dock de Zoom
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

  return (
    <div className="app-layout">
      {/* ── Header 42px ── */}
      <header className="app-header">
        <div className="app-header__logo">
          <span className="app-header__logo-dot" />
          Logística Intra-Hospitalar IA
        </div>
        <div className="app-header__controls">
          {/* Seletor dos 3 Cenários SUS (Task 6.3 & base da Task 8) */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {SCENARIO_LIST.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className="dock-player__btn"
                style={{
                  height: '28px',
                  padding: '0 10px',
                  fontSize: '11px',
                  fontWeight: selectedScenarioId === sc.id ? '600' : '400',
                  backgroundColor: selectedScenarioId === sc.id ? 'var(--color-blueprint)' : 'var(--color-surface)',
                  color: selectedScenarioId === sc.id ? '#ffffff' : 'var(--color-text-secondary)',
                  border: `1px solid ${selectedScenarioId === sc.id ? 'var(--color-cyan)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {sc.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Área de trabalho: gaveta | canvas | zoom ── */}
      <div className="app-workspace">

        {/* Gaveta lateral de métricas (Task 8) */}
        {/* <aside className="app-drawer"> ... </aside> */}

        {/* Container do mapa Blueprint */}
        <main className="map-container">
          {/* Frame da cianotipia — fundo #00233d (Passo 2.3 & Task 6) */}
          <div className="blueprint-frame">
            <CanvasMap
              scenario={currentScenario}
              activeAlgorithm={activeAlgorithm}
              zoom={zoom}
              pan={pan}
              onZoomChange={setZoom}
              onPanChange={setPan}
            />
          </div>

          {/* Botão flutuante de configurações 40×40px (Passo 8.1) */}
          <button className="config-btn" aria-label="Configurações">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
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

          {/* Dock de Zoom — direita, centralizado (Task 7) */}
          <div className="zoom-dock">
            <button
              className="zoom-dock__btn"
              onClick={handleZoomIn}
              aria-label="Aumentar zoom"
              title="Aumentar zoom (+)"
            >
              +
            </button>
            <div className="zoom-dock__divider" />
            <button
              className="zoom-dock__label"
              onClick={handleResetView}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: '4px'
              }}
              title="Clique para resetar visualização (1:1)"
            >
              {zoom === 1.0 ? '1:1' : `${zoom.toFixed(1)}x`}
            </button>
            <div className="zoom-dock__divider" />
            <button
              className="zoom-dock__btn"
              onClick={handleZoomOut}
              aria-label="Diminuir zoom"
              title="Diminuir zoom (−)"
            >
              −
            </button>
          </div>
        </main>
      </div>

      {/* ── Docks inferiores 42px ── */}
      <footer className="bottom-docks">
        {/* Legenda técnica */}
        <div className="dock-legend">
          <div className="dock-legend__item">
            <span className="swatch swatch--free" />
            <span className="dock-legend__label">Livre</span>
          </div>
          <div className="dock-legend__item">
            <span className="swatch swatch--congested" />
            <span className="dock-legend__label">Congestionado</span>
          </div>
          <div className="dock-legend__item">
            <span className="swatch swatch--isolation" />
            <span className="dock-legend__label">Isolamento</span>
          </div>
          <div className="dock-legend__item">
            <span className="swatch swatch--wall" />
            <span className="dock-legend__label">Parede</span>
          </div>
          <div className="dock-legend__item">
            <span className="swatch swatch--path" />
            <span className="dock-legend__label">Rota A*</span>
          </div>
          <div className="dock-legend__item">
            <span className="swatch swatch--explored" />
            <span className="dock-legend__label">Explorado</span>
          </div>
        </div>

        <div className="dock-separator" />

        {/* Player de execução */}
        <div className="dock-player">
          <button className="dock-player__btn dock-player__btn--primary" aria-label="Executar busca">
            ▶ Executar
          </button>
          <button className="dock-player__btn" aria-label="Pausar">
            ⏸
          </button>
          <button className="dock-player__btn" aria-label="Resetar">
            ↺ Reset
          </button>
        </div>
      </footer>
    </div>
  );
}

