/**
 * Dock flutuante vertical de controles de Zoom da planta baixa.
 * Permite ampliação (+), redução (-) e retorno à escala 1:1.
 */
export default function ZoomDock({ zoom, onZoomIn, onZoomOut, onResetView }) {
  const formattedZoom = zoom === 1.0 ? '1:1' : `${zoom.toFixed(1)}x`;

  return (
    <aside className="zoom-dock" aria-label="Controles de Zoom">
      <button
        type="button"
        className="zoom-dock__btn"
        onClick={onZoomIn}
        aria-label="Aumentar zoom"
        title="Aumentar zoom (+)"
      >
        +
      </button>

      <div className="zoom-dock__divider" />

      <button
        type="button"
        className="zoom-dock__label"
        onClick={onResetView}
        aria-label="Resetar visualização para escala original 1:1"
        title="Resetar escala e posição (1:1)"
      >
        {formattedZoom}
      </button>

      <div className="zoom-dock__divider" />

      <button
        type="button"
        className="zoom-dock__btn"
        onClick={onZoomOut}
        aria-label="Diminuir zoom"
        title="Diminuir zoom (−)"
      >
        −
      </button>
    </aside>
  );
}
