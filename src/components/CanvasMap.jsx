import { useEffect, useRef, useState, useCallback } from 'react';
import { renderHospitalBlueprint } from '../utils/canvasDrawing.js';

// Limites e constantes de navegação 
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const DEFAULT_ZOOM = 1.0;
const BASE_CELL_SIZE = 36;

/**
 * Componente CanvasMap - Renderizador 2D Blueprint com Sistema de Navegação Interativo.
 * Características:
 * - Zoom contínuo (0.5x a 2.5x) via roda do mouse (Wheel) centrado no cursor
 * - Pan por arraste contínuo (Click & Drag) com cursor grab / grabbing
 * - Transformações matriciais centralizadas em Canvas 2D (save/translate/scale/restore)
 * - Suporte a controle externo (Zoom Dock) ou gerenciamento autônomo
 * - Renderização contínua a 60 FPS com cancelamento automático de frames
 */
export default function CanvasMap({
  scenario,
  exploredNodes = [],
  exploredAlgorithm = 'astar',
  routes = {},
  activeAlgorithm = 'both',
  zoom: controlledZoom,
  pan: controlledPan,
  onZoomChange,
  onPanChange,
  onCellClick
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Estados de câmera e projeção
  const [internalZoom, setInternalZoom] = useState(DEFAULT_ZOOM);
  const [internalPan, setInternalPan] = useState({ x: 0, y: 0 });

  const zoom = controlledZoom !== undefined ? controlledZoom : internalZoom;
  const pan = controlledPan !== undefined ? controlledPan : internalPan;

  // Estado de controle do arraste (Pan) e cursor
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  // Notifica mudanças para componentes pais (ex: ZoomDock)
  const updateZoom = useCallback((newZoomOrFn) => {
    if (typeof newZoomOrFn === 'function') {
      const computed = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoomOrFn(zoom)));
      if (onZoomChange) onZoomChange(computed);
      else setInternalZoom(computed);
    } else {
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoomOrFn));
      if (onZoomChange) onZoomChange(clamped);
      else setInternalZoom(clamped);
    }
  }, [zoom, onZoomChange]);

  const updatePan = useCallback((newPanOrFn) => {
    if (typeof newPanOrFn === 'function') {
      const computed = newPanOrFn(pan);
      if (onPanChange) onPanChange(computed);
      else setInternalPan(computed);
    } else {
      if (onPanChange) onPanChange(newPanOrFn);
      else setInternalPan(newPanOrFn);
    }
  }, [pan, onPanChange]);

  // Transformações matemáticas de projeção no contexto Canvas 2D
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scenario) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Ajusta resolução do canvas com base no devicePixelRatio para manter alta nitidez
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Fundo base de cianotipia arquitetônica (#00233d)
    ctx.fillStyle = '#00233d';
    ctx.fillRect(0, 0, width, height);

    // Dimensões do mapa em pixels
    const cols = scenario.grid ? scenario.grid.colunas : (scenario.cols || 24);
    const rows = scenario.grid ? scenario.grid.linhas : (scenario.rows || 16);
    const mapPixelWidth = cols * BASE_CELL_SIZE;
    const mapPixelHeight = rows * BASE_CELL_SIZE;

    // Posição central padrão do mapa na viewport
    const defaultOffsetX = (width - mapPixelWidth * zoom) / 2;
    const defaultOffsetY = (height - mapPixelHeight * zoom) / 2;

    // Aplicação da matriz afim no contexto
    ctx.save();
    ctx.translate(defaultOffsetX + pan.x, defaultOffsetY + pan.y);
    ctx.scale(zoom, zoom);

    // Renderiza todas as camadas blueprint (malha expandida 2500px, salas, zonas, rotas)
    renderHospitalBlueprint(ctx, scenario, {
      cellSize: BASE_CELL_SIZE,
      exploredNodes,
      exploredAlgorithm,
      routes,
      activeAlgorithm
    });

    ctx.restore();
    ctx.restore();
  }, [scenario, exploredNodes, exploredAlgorithm, routes, activeAlgorithm, zoom, pan]);

  // Laço de renderização a 60 FPS
  useEffect(() => {
    let animId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  // ResizeObserver para manter fluidez durante redimensionamentos de tela
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(drawFrame);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [drawFrame]);

  // Escala contínua centrada no cursor via roda do mouse
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      e.preventDefault(); // Evita scroll vertical da página

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Fator de escala suave (exponencial para resposta natural)
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      const targetZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * zoomFactor));

      if (Math.abs(targetZoom - zoom) < 0.001) return;

      const cols = scenario?.grid ? scenario.grid.colunas : (scenario?.cols || 24);
      const rows = scenario?.grid ? scenario.grid.linhas : (scenario?.rows || 16);
      const mapPixelWidth = cols * BASE_CELL_SIZE;
      const mapPixelHeight = rows * BASE_CELL_SIZE;

      // Posição central anterior
      const oldDefaultOffsetX = (canvas.clientWidth - mapPixelWidth * zoom) / 2;
      const oldDefaultOffsetY = (canvas.clientHeight - mapPixelHeight * zoom) / 2;

      // Posição no espaço do mundo (planta) antes do zoom
      const worldX = (mouseX - oldDefaultOffsetX - pan.x) / zoom;
      const worldY = (mouseY - oldDefaultOffsetY - pan.y) / zoom;

      // Nova posição central com o novo zoom
      const newDefaultOffsetX = (canvas.clientWidth - mapPixelWidth * targetZoom) / 2;
      const newDefaultOffsetY = (canvas.clientHeight - mapPixelHeight * targetZoom) / 2;

      // Ajusta o pan para que o ponto sob o cursor permaneça exatamente na mesma posição
      const newPanX = mouseX - newDefaultOffsetX - worldX * targetZoom;
      const newPanY = mouseY - newDefaultOffsetY - worldY * targetZoom;

      updateZoom(targetZoom);
      updatePan({ x: newPanX, y: newPanY });
    };

    // Necessário { passive: false } para e.preventDefault() funcionar no wheel
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [zoom, pan, scenario, updateZoom, updatePan]);

  // Eventos de arraste contínuo (Pan)
  const handleMouseDown = (e) => {
    // Permite Pan apenas com o botão primário do mouse (esquerdo)
    if (e.button !== 0) return;

    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { x: pan.x, y: pan.y };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      updatePan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy
      });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      // Registra no window para garantir continuidade mesmo se o cursor sair do canvas
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, updatePan]);

  // Clique em células do mapa para futuras inspeções ou definição de pontos
  const handleCanvasClick = (e) => {
    // Se estava arrastando significativamente, não dispara clique de célula
    const dist = Math.hypot(
      e.clientX - dragStartRef.current.x,
      e.clientY - dragStartRef.current.y
    );
    if (dist > 5) return;

    if (!onCellClick || !scenario) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const cols = scenario.grid ? scenario.grid.colunas : (scenario.cols || 24);
    const rows = scenario.grid ? scenario.grid.linhas : (scenario.rows || 16);
    const mapPixelWidth = cols * BASE_CELL_SIZE;
    const mapPixelHeight = rows * BASE_CELL_SIZE;

    const defaultOffsetX = (canvas.clientWidth - mapPixelWidth * zoom) / 2;
    const defaultOffsetY = (canvas.clientHeight - mapPixelHeight * zoom) / 2;

    const transformedX = (mouseX - defaultOffsetX - pan.x) / zoom;
    const transformedY = (mouseY - defaultOffsetY - pan.y) / zoom;

    const cellX = Math.floor(transformedX / BASE_CELL_SIZE);
    const cellY = Math.floor(transformedY / BASE_CELL_SIZE);

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
        backgroundColor: '#00233d',
        userSelect: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onClick={handleCanvasClick}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
      />
    </div>
  );
}
