/**
 * Painel lateral retrátil (push layout) de telemetria e análise comparativa.
 * Exibe métricas de desempenho em formato tabular e controle de velocidade da busca.
 */
export default function DrawerMetrics({
  isOpen,
  onClose,
  scenario,
  metrics = {},
  speedMs = 30,
  onSpeedChange
}) {
  const greedyMetrics = metrics.greedy || {
    timeMs: null,
    nodesVisited: null,
    pathCost: null,
    pathLength: null
  };

  const astarMetrics = metrics.astar || {
    timeMs: null,
    nodesVisited: null,
    pathCost: null,
    pathLength: null
  };

  const formatValue = (val, unit = '') => {
    if (val === null || val === undefined) return '—';
    return `${typeof val === 'number' ? val.toLocaleString('pt-BR') : val}${unit}`;
  };

  return (
    <aside
      className={`app-drawer ${isOpen ? 'app-drawer--open' : 'app-drawer--collapsed'}`}
      aria-hidden={!isOpen}
    >
      <div className="drawer-container">
        {/* Cabeçalho da Gaveta */}
        <div className="drawer-header">
          <div className="drawer-header__title">
            <span className="drawer-header__dot" />
            <span>Telemetria & Métricas</span>
          </div>
          <button
            type="button"
            className="drawer-header__close"
            onClick={onClose}
            aria-label="Fechar painel lateral"
            title="Fechar painel"
          >
            ✕
          </button>
        </div>

        <div className="drawer-content">
          {/* Card do Cenário Ativo */}
          {scenario && (
            <section className="drawer-section">
              <h4 className="drawer-section__title">Cenário Clínico</h4>
              <div className="scenario-card">
                <div className="scenario-card__header">
                  <strong>{scenario.name}</strong>
                  <span className="scenario-card__badge">{scenario.badge}</span>
                </div>
                <p className="scenario-card__desc">{scenario.description}</p>
                <div className="scenario-card__meta">
                  <span>Grid: {scenario.cols} × {scenario.rows} células</span>
                  <span>Escala: 36px/célula</span>
                </div>
              </div>
            </section>
          )}

          {/* Tabela Comparativa de Métricas (Números Tabulares) */}
          <section className="drawer-section">
            <h4 className="drawer-section__title">Comparativo de Desempenho</h4>
            <div className="metrics-table-wrapper">
              <table className="metrics-table">
                <thead>
                  <tr>
                    <th>Métrica</th>
                    <th>Gulosa (f = h)</th>
                    <th>A* (f = g + h)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tempo de CPU</td>
                    <td className="tabular-num">{formatValue(greedyMetrics.timeMs, ' ms')}</td>
                    <td className="tabular-num">{formatValue(astarMetrics.timeMs, ' ms')}</td>
                  </tr>
                  <tr>
                    <td>Nós Visitados</td>
                    <td className="tabular-num">{formatValue(greedyMetrics.nodesVisited)}</td>
                    <td className="tabular-num">{formatValue(astarMetrics.nodesVisited)}</td>
                  </tr>
                  <tr>
                    <td>Custo da Rota (g)</td>
                    <td className="tabular-num">{formatValue(greedyMetrics.pathCost)}</td>
                    <td className="tabular-num">{formatValue(astarMetrics.pathCost)}</td>
                  </tr>
                  <tr>
                    <td>Passos da Rota</td>
                    <td className="tabular-num">{formatValue(greedyMetrics.pathLength)}</td>
                    <td className="tabular-num">{formatValue(astarMetrics.pathLength)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Controle de Velocidade da Animação */}
          <section className="drawer-section">
            <div className="speed-control__header">
              <h4 className="drawer-section__title">Velocidade da Execução</h4>
              <span className="tabular-num speed-badge">{speedMs} ms/passo</span>
            </div>
            <div className="speed-slider-wrapper">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={speedMs}
                onChange={(e) => onSpeedChange && onSpeedChange(Number(e.target.value))}
                className="speed-slider"
                aria-label="Velocidade da execução em milissegundos por passo"
              />
              <div className="speed-slider-labels">
                <span>Rápido (5ms)</span>
                <span>Normal (30ms)</span>
                <span>Didático (100ms)</span>
              </div>
            </div>
          </section>

          {/* Normas e Referência Técnica */}
          <section className="drawer-section drawer-section--footer">
            <div className="compliance-note">
              <strong>Conformidade Regulamentar:</strong>
              <p>Barreiras biológicas modeladas sob protocolo ANVISA RDC 50 (custo infinito). Heurística Euclidiana consistente fundamentada em Liu (2023).</p>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
}
