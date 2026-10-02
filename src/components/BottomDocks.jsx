/**
 * Barra inferior composta por dois docks desacoplados:
 * 1. Legenda técnica de convenções gráficas (esquerda)
 * 2. Player de controle de execução e alternância algorítmica (direita)
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
    <footer className="bottom-docks">
      {/* Dock de Legenda Técnica */}
      <div className="dock-legend" aria-label="Legenda técnica do mapa">
        <div className="dock-legend__item" title="Célula desimpedida (custo = 1.0)">
          <span className="swatch swatch--free" />
          <span className="dock-legend__label">Livre</span>
        </div>

        <div className="dock-legend__item" title="Área de tráfego denso de macas (custo = 5.0)">
          <span className="swatch swatch--congested" />
          <span className="dock-legend__label">Congestionado</span>
        </div>

        <div className="dock-legend__item" title="Ala com risco infeccioso ANVISA RDC 50 (intransitável, custo = ∞)">
          <span className="swatch swatch--isolation" />
          <span className="dock-legend__label">Isolamento</span>
        </div>

        <div className="dock-legend__item" title="Alvenaria e divisórias físicas estruturais (intransitável)">
          <span className="swatch swatch--wall" />
          <span className="dock-legend__label">Parede</span>
        </div>

        <div className="dock-legend__item" title="Caminho ótimo calculado por f(n) = g(n) + h(n)">
          <span className="swatch swatch--path-astar" />
          <span className="dock-legend__label">Rota A*</span>
        </div>

        <div className="dock-legend__item" title="Caminho calculado por f(n) = h(n)">
          <span className="swatch swatch--path-greedy" />
          <span className="dock-legend__label">Rota Gulosa</span>
        </div>

        <div className="dock-legend__item" title="Conjunto de estados avaliados pelo algoritmo">
          <span className="swatch swatch--explored" />
          <span className="dock-legend__label">Explorado</span>
        </div>
      </div>

      <div className="dock-separator" />

      {/* Dock do Player de Execução */}
      <div className="dock-player" aria-label="Controles de execução">
        {/* Alternador de Modo Algorítmico */}
        <div className="mode-toggle" role="group" aria-label="Algoritmo ativo">
          <button
            type="button"
            className={`mode-btn ${activeAlgorithm === 'both' ? 'mode-btn--active' : ''}`}
            onClick={() => onSelectAlgorithm && onSelectAlgorithm('both')}
            title="Comparar ambos os algoritmos em paralelo"
          >
            Ambos
          </button>
          <button
            type="button"
            className={`mode-btn ${activeAlgorithm === 'astar' ? 'mode-btn--active' : ''}`}
            onClick={() => onSelectAlgorithm && onSelectAlgorithm('astar')}
            title="Executar apenas Algoritmo A* (f = g + h)"
          >
            A*
          </button>
          <button
            type="button"
            className={`mode-btn ${activeAlgorithm === 'greedy' ? 'mode-btn--active' : ''}`}
            onClick={() => onSelectAlgorithm && onSelectAlgorithm('greedy')}
            title="Executar apenas Busca Gulosa (f = h)"
          >
            Gulosa
          </button>
        </div>

        {/* Botão de Ação Primária (Play / Pause) */}
        {!isRunning || isPaused ? (
          <button
            type="button"
            className="dock-player__btn dock-player__btn--primary"
            onClick={onPlay}
            aria-label="Iniciar execução dos algoritmos"
            title="Executar busca de rota"
          >
            ▶ Executar
          </button>
        ) : (
          <button
            type="button"
            className="dock-player__btn dock-player__btn--warning"
            onClick={onPause}
            aria-label="Pausar execução"
            title="Pausar animação"
          >
            ⏸ Pausar
          </button>
        )}

        {/* Botão de Reset */}
        <button
          type="button"
          className="dock-player__btn"
          onClick={onReset}
          aria-label="Resetar busca e limpar rotas"
          title="Limpar rotas e reiniciar estado inicial"
        >
          ↺ Reset
        </button>
      </div>
    </footer>
  );
}
