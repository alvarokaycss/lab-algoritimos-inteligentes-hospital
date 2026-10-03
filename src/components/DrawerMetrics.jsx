/**
 * Painel lateral retrátil (push layout) de telemetria e análise comparativa.
 * Fidelidade total com prototipo_interface.html.
 */
export default function DrawerMetrics({
  isOpen,
  onClose,
  scenario,
  metrics = {},
  speedMs = 20,
  onSpeedChange
}) {
  const greedy = metrics.greedy || {};
  const astar = metrics.astar || {};

  const formatVal = (v, unit = '') => {
    if (v === null || v === undefined) return '—';
    return `${typeof v === 'number' ? v.toLocaleString('pt-BR') : v}${unit}`;
  };

  // Comparadores para indicar a melhor métrica
  const isAstarFaster = astar.timeMs != null && greedy.timeMs != null && astar.timeMs < greedy.timeMs;
  const isGreedyFaster = astar.timeMs != null && greedy.timeMs != null && greedy.timeMs < astar.timeMs;

  const isAstarFewerNodes = astar.nodesVisited != null && greedy.nodesVisited != null && astar.nodesVisited < greedy.nodesVisited;
  const isGreedyFewerNodes = astar.nodesVisited != null && greedy.nodesVisited != null && greedy.nodesVisited < astar.nodesVisited;

  const isAstarLowerCost = astar.pathCost != null && greedy.pathCost != null && astar.pathCost < greedy.pathCost;
  const isGreedyLowerCost = astar.pathCost != null && greedy.pathCost != null && greedy.pathCost < astar.pathCost;

  const isAstarFewerSteps = astar.pathLength != null && greedy.pathLength != null && astar.pathLength < greedy.pathLength;
  const isGreedyFewerSteps = astar.pathLength != null && greedy.pathLength != null && greedy.pathLength < astar.pathLength;

  return (
    <aside
      className={`drawer ${isOpen ? 'open' : ''}`}
      id="drawer"
      aria-hidden={!isOpen}
      aria-label="Painel de telemetria e parâmetros"
    >
      <div className="drawer-content">
        {/* Cabeçalho do Drawer */}
        <div className="drawer-header-row">
          <span className="drawer-title-label">Configurações & Métricas</span>
          <button
            type="button"
            className="drawer-close-btn"
            id="btnCloseDrawer"
            onClick={onClose}
            aria-label="Fechar painel lateral"
            title="Fechar"
          >
            <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cenário Clínico Ativo */}
        {scenario && (
          <div>
            <div className="drawer-heading">Cenário Clínico</div>
            <div className="form-group">
              <div className="form-label">
                <span style={{ fontWeight: 600 }}>{scenario.name}</span>
                <span className="form-value">{scenario.badge}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: '2px 0 0 0' }}>
                {scenario.description}
              </p>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Dimensões: {scenario.cols} × {scenario.rows} células (36px/célula)
              </div>
            </div>
          </div>
        )}

        {/* Parâmetros da Busca */}
        <div>
          <div className="drawer-heading">Parâmetros da Busca</div>

          <div className="form-group">
            <div className="form-label">
              <span>Intervalo por passo</span>
              <span className="form-value" id="valSpeed">{speedMs} ms</span>
            </div>
            <input
              type="range"
              className="range-input"
              id="inputSpeed"
              min="5"
              max="100"
              value={speedMs}
              onChange={(e) => onSpeedChange && onSpeedChange(Number(e.target.value))}
              aria-label="Velocidade da busca em milissegundos"
            />
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Função Heurística</span>
              <span className="form-value">Distância Euclidiana</span>
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Norma Arquitetônica</span>
              <span className="form-value">ANVISA RDC 50 / SUS</span>
            </div>
          </div>
        </div>

        {/* Métricas Comparativas */}
        <div>
          <div className="drawer-heading">Métricas Comparativas</div>
          <div className="table-container">
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Gulosa</th>
                  <th>A*</th>
                </tr>
              </thead>
              <tbody id="metricsBody">
                <tr>
                  <td>Tempo de CPU</td>
                  <td className="col-greedy">
                    {formatVal(greedy.timeMs, ' ms')}
                    {isGreedyFaster && <span className="best-indicator" title="Menor tempo" />}
                  </td>
                  <td className="col-astar">
                    {formatVal(astar.timeMs, ' ms')}
                    {isAstarFaster && <span className="best-indicator" title="Menor tempo" />}
                  </td>
                </tr>
                <tr>
                  <td>Nós Visitados</td>
                  <td className="col-greedy">
                    {formatVal(greedy.nodesVisited)}
                    {isGreedyFewerNodes && <span className="best-indicator" title="Menor expansão" />}
                  </td>
                  <td className="col-astar">
                    {formatVal(astar.nodesVisited)}
                    {isAstarFewerNodes && <span className="best-indicator" title="Menor expansão" />}
                  </td>
                </tr>
                <tr>
                  <td>Custo Total (g)</td>
                  <td className="col-greedy">
                    {formatVal(greedy.pathCost)}
                    {isGreedyLowerCost && <span className="best-indicator" title="Menor custo" />}
                  </td>
                  <td className="col-astar">
                    {formatVal(astar.pathCost)}
                    {isAstarLowerCost && <span className="best-indicator" title="Rota ótima" />}
                  </td>
                </tr>
                <tr>
                  <td>Passos da Rota</td>
                  <td className="col-greedy">
                    {formatVal(greedy.pathLength)}
                    {isGreedyFewerSteps && <span className="best-indicator" title="Menos passos" />}
                  </td>
                  <td className="col-astar">
                    {formatVal(astar.pathLength)}
                    {isAstarFewerSteps && <span className="best-indicator" title="Menor caminho" />}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </aside>
  );
}
