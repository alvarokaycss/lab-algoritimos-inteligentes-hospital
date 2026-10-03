/**
 * Barra inferior composta por dois docks desacoplados e flutuantes:
 * 1. Legenda técnica de convenções gráficas (extrema esquerda)
 * 2. Player de controle de execução e alternância algorítmica (extrema direita)
 */
export default function BottomDocks({
  activeAlgorithm = 'both',
  onSelectAlgorithm,
  isRunning = false,
  isPaused = false,
  onPlay,
  onPause,
  onReset
}) {
  return (
    <div className="bottom-bar" aria-label="Painel de Controle e Legenda da Prancheta">
      {/* LEGENDA NA EXTREMA ESQUERDA INFERIOR */}
      <aside className="legend-dock" aria-label="Legenda técnica">
        <div className="legend-item" title="Ponto de partida / doca de triagem">
          <div className="swatch" style={{ background: '#38bdf8' }} />
          <span>Início (Doca)</span>
        </div>

        <div className="legend-item" title="Destino de urgência / emergência clínica">
          <div className="swatch" style={{ background: '#10b981' }} />
          <span>Destino (Emergência)</span>
        </div>

        <div className="legend-item" title="Ala de isolamento infeccioso intransitável conforme ANVISA RDC 50">
          <div className="swatch-dashed-box" />
          <span>Isolamento (RDC 50)</span>
        </div>

        <div className="legend-item" title="Caminho ótimo com menor custo acumulado (f = g + h)">
          <div className="swatch-line-astar" />
          <span>Rota A*</span>
        </div>

        <div className="legend-item" title="Caminho por estimativa pura em linha reta (f = h)">
          <div className="swatch-line-greedy" />
          <span>Rota Gulosa</span>
        </div>
      </aside>

      {/* CONTROLE DE EXECUÇÃO NA EXTREMA DIREITA INFERIOR */}
      <section className="player-dock" aria-label="Controle de execução dos algoritmos">
        <div className="segmented-control" role="group" aria-label="Seleção de Algoritmo">
          <button
            type="button"
            className={`segment-btn ${activeAlgorithm === 'greedy' ? 'active' : ''}`}
            onClick={() => onSelectAlgorithm && onSelectAlgorithm('greedy')}
            title="Executar apenas Busca Gulosa (f = h)"
          >
            Busca Gulosa
          </button>
          <button
            type="button"
            className={`segment-btn ${activeAlgorithm === 'astar' ? 'active' : ''}`}
            onClick={() => onSelectAlgorithm && onSelectAlgorithm('astar')}
            title="Executar apenas Algoritmo A* (f = g + h)"
          >
            Algoritmo A*
          </button>
          <button
            type="button"
            className={`segment-btn ${activeAlgorithm === 'both' ? 'active' : ''}`}
            onClick={() => onSelectAlgorithm && onSelectAlgorithm('both')}
            title="Confronto paralelo de ambos os algoritmos"
          >
            Confronto Ambos
          </button>
        </div>

        <div className="dock-divider" />

        {/* Botão de Ação Primária (Executar / Pausar) */}
        {!isRunning || isPaused ? (
          <button
            type="button"
            className="btn-action"
            onClick={onPlay}
            aria-label="Iniciar execução dos algoritmos"
            title="Executar busca de rotas"
          >
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Executar</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn-action btn-action--pause"
            onClick={onPause}
            aria-label="Pausar execução"
            title="Pausar animação da busca"
          >
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
            <span>Pausar</span>
          </button>
        )}

        {/* Botão de Reset Secundário (28x28px com ícone) */}
        <button
          type="button"
          className="btn-secondary"
          onClick={onReset}
          aria-label="Limpar rotas e reiniciar estado"
          title="Limpar rotas"
        >
          <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
      </section>
    </div>
  );
}
