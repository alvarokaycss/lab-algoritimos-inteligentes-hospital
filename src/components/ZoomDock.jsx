/**
 * Dock vertical de controles de Zoom flutuante no canto superior esquerdo (40px).
 * Posicionado diretamente abaixo do botão de configurações.
 * Ordem dos botões: [+] aproximar, [-] afastar, [1:1] resetar visualização.
 */
export default function ZoomDock({ onZoomIn, onZoomOut, onResetView }) {
  return (
    <aside className="zoom-dock" aria-label="Controles de Zoom da Prancheta">
      <button
        type="button"
        className="zoom-btn"
        onClick={onZoomIn}
        aria-label="Aproximar mapa (+)"
        title="Aproximar mapa (+)"
      >
        <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <div className="zoom-divider" />

      <button
        type="button"
        className="zoom-btn"
        onClick={onZoomOut}
        aria-label="Afastar mapa (-)"
        title="Afastar mapa (-)"
      >
        <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <div className="zoom-divider" />

      <button
        type="button"
        className="zoom-btn"
        onClick={onResetView}
        aria-label="Restaurar zoom original (1:1)"
        title="Restaurar zoom original (100%)"
      >
        <span className="zoom-btn__text">1:1</span>
      </button>
    </aside>
  );
}
