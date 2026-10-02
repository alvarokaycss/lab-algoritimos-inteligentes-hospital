import { useEffect, useRef, useState, useCallback } from 'react';
import { renderHospitalBlueprint } from '../utils/canvasDrawing.js';

/**
 * Componente CanvasMap - Renderizador 2D Blueprint da Planta Baixa Hospitalar.
 * 
 * Task 6 (Passos 6.1, 6.2, 6.3)
 * Responsável: Desenvolvedor 2
 * 
 * Renderiza a 60 FPS com fundo `#00233d`, malha quadriculada técnica com offset de 2500px,
 * salas com efeito de giz de prancheta, hachuras a 45° (Isolamento RDC 50 e Congestionamento),
 * nós explorados e traçados de rotas (A* em ciano elétrico e Gulosa em amarelo nanquim).
 */
export default function CanvasMap({
  scenario,
  exploredNodes = [],
  exploredAlgorithm = 'astar',
  routes = {},
  activeAlgorithm = 'both',
  zoom: externalZoom,
  pan: externalPan,
  onZoomChange,
  onPanChange,
  onCellClick
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Estados locais de Zoom e Pan caso não sejam fornecidos externamente (preparando Task 7)
  const [internalZoom, setInternalZoom] = useState(1.0);
  const [internalPan, setInternalPan] = useState({ x: 0, y: 0 });

  const currentZoom = externalZoom !== undefined ? externalZoom : internalZoom;
  const currentPan = externalPan !== undefined ? externalPan : internalPan;

  // Tamanho base de cada célula da grade na escala 1:1
  const baseCellSize = 36;

  // Função pura de desenho do frame
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scenario) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    // Normaliza escala de pixels de alta densidade (Retina/High-DPI)
    ctx.scale(dpr, dpr);

    // Limpa a tela com o fundo clássico de cianotipia arquitetônica
    ctx.fillStyle = '#00233d';
    ctx.fillRect(0, 0, width, height);

    // Calcula centralização inicial da planta na tela
    const cols = scenario.grid ? scenario.grid.colunas : (scenario.cols || 24);
    const rows = scenario.grid ? scenario.grid.linhas : (scenario.rows || 16);
    const mapPixelWidth = cols * baseCellSize;
    const mapPixelHeight = rows * baseCellSize;

    const defaultOffsetX = (width - mapPixelWidth * currentZoom) / 2;
    const defaultOffsetY = (height - mapPixelHeight * currentZoom) / 2;

    // Aplica matriz de transformação 2D (Pan & Zoom centralizados)
    ctx.save();
    ctx.translate(defaultOffsetX + currentPan.x, defaultOffsetY + currentPan.y);
    ctx.scale(currentZoom, currentZoom);

    // Renderiza a planta baixa através do utilitário técnico
    renderHospitalBlueprint(ctx, scenario, {
      cellSize: baseCellSize,
      exploredNodes,
      exploredAlgorithm,
      routes,
      activeAlgorithm
    });

    ctx.restore();
    ctx.restore();
  }, [scenario, exploredNodes, exploredAlgorithm, routes, activeAlgorithm, currentZoom, currentPan]);

  // Redesenha com requestAnimationFrame para garantir fluidez a 60 FPS
  useEffect(() => {
    let animId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  // ResizeObserver para manter o Canvas responsivo ao layout flex/push
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(drawFrame);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [drawFrame]);

  // Click no canvas para interação futura de inspeção ou waypoints
  const handleCanvasClick = (e) => {
    if (!onCellClick || !scenario) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cols = scenario.grid ? scenario.grid.colunas : (scenario.cols || 24);
    const rows = scenario.grid ? scenario.grid.linhas : (scenario.rows || 16);
    const mapPixelWidth = cols * baseCellSize;
    const mapPixelHeight = rows * baseCellSize;

    const defaultOffsetX = (canvas.clientWidth - mapPixelWidth * currentZoom) / 2;
    const defaultOffsetY = (canvas.clientHeight - mapPixelHeight * currentZoom) / 2;

    const transformedX = (mouseX - defaultOffsetX - currentPan.x) / currentZoom;
    const transformedY = (mouseY - defaultOffsetY - currentPan.y) / currentZoom;

    const cellX = Math.floor(transformedX / baseCellSize);
    const cellY = Math.floor(transformedY / baseCellSize);

    if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
      onCellClick(cellX, cellY);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#00233d'
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: 'default'
        }}
      />
    </div>
  );
}
