import ScenarioSelector from './ScenarioSelector.jsx';

/**
 * Cabeçalho principal da aplicação.
 * Exibe a identidade do sistema de logística intra-hospitalar e abriga o seletor de cenários SUS.
 */
export default function FloatingHeader({ selectedScenarioId, onSelectScenario }) {
  return (
    <header className="app-header">
      <div className="app-header__logo">
        <span className="app-header__logo-dot" />
        <span className="app-header__title">Logística Intra-Hospitalar IA</span>
      </div>

      <div className="app-header__controls">
        <ScenarioSelector
          selectedScenarioId={selectedScenarioId}
          onSelectScenario={onSelectScenario}
        />
      </div>
    </header>
  );
}
