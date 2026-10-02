import './App.css';

export default function App() {
  return (
    <div className="app-layout">
      {/* ── Header 42px ── */}
      <header className="app-header">
        <div className="app-header__logo">
          <span className="app-header__logo-dot" />
          Logística Intra-Hospitalar IA
        </div>
        <div className="app-header__controls">
          {/* Futuro: ScenarioSelector (Task 8) */}
        </div>
      </header>

      {/* ── Área de trabalho: gaveta | canvas | zoom ── */}
      <div className="app-workspace">

        {/* Gaveta lateral de métricas (Task 8) */}
        {/* <aside className="app-drawer"> ... </aside> */}

        {/* Container do mapa Blueprint */}
        <main className="map-container">
          {/* Frame da cianotipia — fundo #00233d (Passo 2.3) */}
          <div className="blueprint-frame">
            {/* Canvas 2D inserido aqui pela Task 6: CanvasMap.jsx */}
          </div>

          {/* Overlay enquanto nenhum cenário está carregado */}
          <div className="map-overlay">
            <span className="app-header__logo-dot shadow-glow" />
            <p className="map-overlay__title">Logística Hospitalar</p>
            <p className="map-overlay__subtitle">Selecione um cenário SUS para iniciar</p>
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
            <button className="zoom-dock__btn" aria-label="Zoom in">+</button>
            <div className="zoom-dock__divider" />
            <span className="zoom-dock__label">1:1</span>
            <div className="zoom-dock__divider" />
            <button className="zoom-dock__btn" aria-label="Zoom out">−</button>
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

