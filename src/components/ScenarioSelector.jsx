import { SCENARIO_LIST } from '../data/scenariosData.js';

/**
 * Seletor de cenários clínicos SUS pré-configurados.
 * Exibido como grupo flutuante vertical de cards no canto superior direito.
 */
export default function ScenarioSelector({ selectedScenarioId, onSelectScenario }) {
  return (
    <div className="scenarios-group" role="radiogroup" aria-label="Cenários Clínicos SUS">
      {SCENARIO_LIST.map((sc) => {
        const isSelected = selectedScenarioId === sc.id;
        return (
          <button
            key={sc.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelectScenario(sc.id)}
            className={`scenario-card ${isSelected ? 'active' : ''}`}
            title={`${sc.name} — ${sc.badge}`}
          >
            <span className="scenario-indicator" />
            <span className="scenario-card-text">{sc.name} ({sc.badge})</span>
          </button>
        );
      })}
    </div>
  );
}
