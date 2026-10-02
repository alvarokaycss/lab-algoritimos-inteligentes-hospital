import { SCENARIO_LIST } from '../data/scenariosData.js';

/**
 * Seletor de cenários SUS pré-configurados.
 * Permite alternar entre UBS Porte I, UPA 24h e Hospital Geral.
 */
export default function ScenarioSelector({ selectedScenarioId, onSelectScenario }) {
  return (
    <nav className="scenario-selector" aria-label="Cenários SUS">
      {SCENARIO_LIST.map((sc) => {
        const isSelected = selectedScenarioId === sc.id;
        return (
          <button
            key={sc.id}
            type="button"
            onClick={() => onSelectScenario(sc.id)}
            className={`scenario-btn ${isSelected ? 'scenario-btn--active' : ''}`}
            aria-pressed={isSelected}
            title={sc.badge}
          >
            <span className="scenario-btn__name">{sc.name}</span>
            <span className="scenario-btn__badge">{sc.badge}</span>
          </button>
        );
      })}
    </nav>
  );
}
