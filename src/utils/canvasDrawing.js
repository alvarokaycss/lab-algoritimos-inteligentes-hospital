/**
 * Utilitários de desenho gráfico para renderização em Canvas 2D.
 * Padrão estético de cianotipia arquitetônica (Blueprint Técnico #00233d).
 */

export const BLUEPRINT_THEME = Object.freeze({
  bg: '#00233d',
  bgDeep: '#00192e',
  gridMinor: 'rgba(56, 189, 248, 0.08)',
  gridMajor: 'rgba(56, 189, 248, 0.22)',
  chalkWhite: 'rgba(255, 255, 255, 0.88)',
  chalkDim: 'rgba(224, 242, 254, 0.65)',
  roomFill: 'rgba(7, 39, 66, 0.55)',
  isolationHatch: 'rgba(239, 68, 68, 0.75)',
  isolationBorder: '#ef4444',
  isolationFill: 'rgba(239, 68, 68, 0.12)',
  congestionHatch: 'rgba(245, 158, 11, 0.7)',
  congestionBorder: '#f59e0b',
  congestionFill: 'rgba(245, 158, 11, 0.12)',
  routeAstar: '#38bdf8',
  routeGreedy: '#f59e0b',
  exploredAstar: 'rgba(56, 189, 248, 0.22)',
  exploredGreedy: 'rgba(245, 158, 11, 0.25)',
  startPoint: '#10b981',
  targetPoint: '#f43f5e'
});

/**
 * Desenha a malha quadriculada com margem estendida para suportar operações de Pan e Zoom.
 */
export function drawExpandedGrid(ctx, cols, rows, cellSize, offset = 2500) {
  const mapWidth = cols * cellSize;
  const mapHeight = rows * cellSize;

  const startX = -offset;
  const startY = -offset;
  const endX = mapWidth + offset;
  const endY = mapHeight + offset;

  // Fundo contínuo da prancheta
  ctx.fillStyle = BLUEPRINT_THEME.bg;
  ctx.fillRect(startX, startY, endX - startX, endY - startY);

  // Linhas verticais da grade
  const firstCol = Math.floor(startX / cellSize);
  const lastCol = Math.ceil(endX / cellSize);

  for (let c = firstCol; c <= lastCol; c++) {
    const x = Math.round(c * cellSize);
    const isMajor = c % 5 === 0;

    ctx.beginPath();
    ctx.lineWidth = isMajor ? 1.2 : 0.6;
    ctx.strokeStyle = isMajor ? BLUEPRINT_THEME.gridMajor : BLUEPRINT_THEME.gridMinor;
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
    ctx.stroke();
  }

  // Linhas horizontais da grade
  const firstRow = Math.floor(startY / cellSize);
  const lastRow = Math.ceil(endY / cellSize);

  for (let r = firstRow; r <= lastRow; r++) {
    const y = Math.round(r * cellSize);
    const isMajor = r % 5 === 0;

    ctx.beginPath();
    ctx.lineWidth = isMajor ? 1.2 : 0.6;
    ctx.strokeStyle = isMajor ? BLUEPRINT_THEME.gridMajor : BLUEPRINT_THEME.gridMinor;
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();
  }

  drawMapBoundary(ctx, mapWidth, mapHeight);
}

/**
 * Desenha os limites externos da planta hospitalar com cantoneiras técnicas de desenho.
 */
function drawMapBoundary(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);

  const cornerLen = 14;
  ctx.strokeStyle = BLUEPRINT_THEME.chalkWhite;
  ctx.lineWidth = 2.5;

  // Canto superior-esquerdo
  ctx.beginPath();
  ctx.moveTo(-5, cornerLen); ctx.lineTo(-5, -5); ctx.lineTo(cornerLen, -5);
  ctx.stroke();

  // Canto superior-direito
  ctx.beginPath();
  ctx.moveTo(width + 5 - cornerLen, -5); ctx.lineTo(width + 5, -5); ctx.lineTo(width + 5, cornerLen);
  ctx.stroke();

  // Canto inferior-esquerdo
  ctx.beginPath();
  ctx.moveTo(-5, height + 5 - cornerLen); ctx.lineTo(-5, height + 5); ctx.lineTo(cornerLen, height + 5);
  ctx.stroke();

  // Canto inferior-direito
  ctx.beginPath();
  ctx.moveTo(width + 5 - cornerLen, height + 5); ctx.lineTo(width + 5, height + 5); ctx.lineTo(width + 5, height + 5 - cornerLen);
  ctx.stroke();

  ctx.restore();
}

/**
 * Desenha uma sala técnica com contornos em giz de prancheta, cantoneiras e rótulo centralizado.
 */
export function drawRoom(ctx, room, cellSize) {
  const rx = room.x * cellSize;
  const ry = room.y * cellSize;
  const rw = room.width * cellSize;
  const rh = room.height * cellSize;

  ctx.save();

  // Preenchimento volumétrico translúcido
  ctx.fillStyle = room.fillColor || BLUEPRINT_THEME.roomFill;
  ctx.fillRect(rx, ry, rw, rh);

  // Contorno estrutural
  ctx.strokeStyle = room.borderColor || BLUEPRINT_THEME.chalkWhite;
  ctx.lineWidth = 2;
  ctx.strokeRect(rx, ry, rw, rh);

  // Interseções estendidas nas esquinas (detalhe de traço arquitetônico)
  const ext = 4;
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';

  ctx.beginPath();
  ctx.moveTo(rx - ext, ry); ctx.lineTo(rx + ext, ry);
  ctx.moveTo(rx, ry - ext); ctx.lineTo(rx, ry + ext);

  ctx.moveTo(rx + rw - ext, ry); ctx.lineTo(rx + rw + ext, ry);
  ctx.moveTo(rx + rw, ry - ext); ctx.lineTo(rx + rw, ry + ext);

  ctx.moveTo(rx - ext, ry + rh); ctx.lineTo(rx + ext, ry + rh);
  ctx.moveTo(rx, ry + rh - ext); ctx.lineTo(rx, ry + rh + ext);

  ctx.moveTo(rx + rw - ext, ry + rh); ctx.lineTo(rx + rw + ext, ry + rh);
  ctx.moveTo(rx + rw, ry + rh - ext); ctx.lineTo(rx + rw, ry + rh + ext);
  ctx.stroke();

  if (Array.isArray(room.doors)) {
    for (const door of room.doors) {
      drawDoor(ctx, door, cellSize);
    }
  }

  // Rótulo tipográfico da sala
  if (room.name) {
    const cx = rx + rw / 2;
    const cy = ry + rh / 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const fontSize = Math.max(9, Math.min(13, Math.floor(cellSize * 0.45)));
    ctx.font = `600 ${fontSize}px 'Outfit', 'Inter', -apple-system, sans-serif`;
    ctx.fillStyle = BLUEPRINT_THEME.chalkWhite;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 4;

    if (room.sublabel) {
      ctx.fillText(room.name.toUpperCase(), cx, cy - (fontSize * 0.65));
      ctx.font = `400 ${Math.max(8, fontSize - 2.5)}px 'Outfit', 'Inter', monospace`;
      ctx.fillStyle = BLUEPRINT_THEME.chalkDim;
      ctx.fillText(room.sublabel, cx, cy + (fontSize * 0.75));
    } else {
      ctx.fillText(room.name.toUpperCase(), cx, cy);
    }
  }

  ctx.restore();
}

/**
 * Desenha abertura de porta com arco de rotação arquitetônico.
 */
function drawDoor(ctx, door, cellSize) {
  const dx = door.x * cellSize;
  const dy = door.y * cellSize;
  const size = cellSize;

  ctx.save();
  ctx.strokeStyle = BLUEPRINT_THEME.chalkWhite;
  ctx.fillStyle = BLUEPRINT_THEME.bg;
  ctx.lineWidth = 2;

  if (door.dir === 'south' || door.dir === 'north') {
    ctx.fillRect(dx + 2, dy - 2, size - 4, 4);
    ctx.beginPath();
    ctx.arc(dx, dy, size * 0.9, 0, Math.PI / 2, false);
    ctx.stroke();
  } else {
    ctx.fillRect(dx - 2, dy + 2, 4, size - 4);
    ctx.beginPath();
    ctx.arc(dx, dy, size * 0.9, 0, Math.PI / 2, false);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Desenha a ala de isolamento biológico com hachura diagonal a 45° (ANVISA RDC 50, custo infinito).
 */
export function drawIsolationCore(ctx, area, cellSize) {
  const x = area.x * cellSize;
  const y = area.y * cellSize;
  const w = area.width * cellSize;
  const h = area.height * cellSize;

  ctx.save();

  // Fundo de advertência
  ctx.fillStyle = BLUEPRINT_THEME.isolationFill;
  ctx.fillRect(x, y, w, h);

  // Hachura angular a 45 graus delimitada pela área
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.strokeStyle = BLUEPRINT_THEME.isolationHatch;
  ctx.lineWidth = 2;

  const step = 10;
  const total = w + h;
  for (let i = -total; i <= total; i += step) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i + h, y + h);
    ctx.stroke();
  }
  ctx.restore();

  // Moldura externa de contenção
  ctx.strokeStyle = BLUEPRINT_THEME.isolationBorder;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x, y, w, h);

  // Rótulo técnico de biossegurança
  const label = area.label || 'ISOLAMENTO (RDC 50)';
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.font = `700 ${Math.max(9, Math.floor(cellSize * 0.4))}px monospace`;
  const textMetrics = ctx.measureText(label);
  const padX = 6;
  const padY = 3;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(
    cx - textMetrics.width / 2 - padX,
    cy - 7 - padY,
    textMetrics.width + padX * 2,
    14 + padY * 2
  );
  ctx.strokeStyle = BLUEPRINT_THEME.isolationBorder;
  ctx.lineWidth = 1;
  ctx.strokeRect(
    cx - textMetrics.width / 2 - padX,
    cy - 7 - padY,
    textMetrics.width + padX * 2,
    14 + padY * 2
  );

  ctx.fillStyle = '#fca5a5';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy);

  ctx.restore();
}

/**
 * Desenha zona de tráfego denso com hachura diagonal a 45° âmbar (custo = 5.0).
 */
export function drawCongestionZone(ctx, area, cellSize) {
  const x = area.x * cellSize;
  const y = area.y * cellSize;
  const w = area.width * cellSize;
  const h = area.height * cellSize;

  ctx.save();

  ctx.fillStyle = BLUEPRINT_THEME.congestionFill;
  ctx.fillRect(x, y, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  ctx.strokeStyle = BLUEPRINT_THEME.congestionHatch;
  ctx.lineWidth = 1.8;

  const step = 12;
  const total = w + h;
  for (let i = -total; i <= total; i += step) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i + h, y + h);
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = BLUEPRINT_THEME.congestionBorder;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);

  if (area.label !== false) {
    const label = area.label || 'CONGESTIONADO (g=5.0)';
    const cx = x + w / 2;
    const cy = y + h / 2;

    ctx.font = `600 ${Math.max(8, Math.floor(cellSize * 0.36))}px monospace`;
    const textMetrics = ctx.measureText(label);
    const padX = 6;
    const padY = 3;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(
      cx - textMetrics.width / 2 - padX,
      cy - 6 - padY,
      textMetrics.width + padX * 2,
      12 + padY * 2
    );
    ctx.strokeStyle = BLUEPRINT_THEME.congestionBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(
      cx - textMetrics.width / 2 - padX,
      cy - 6 - padY,
      textMetrics.width + padX * 2,
      12 + padY * 2
    );

    ctx.fillStyle = '#fde68a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, cx, cy);
  }

  ctx.restore();
}

/**
 * Desenha marcos técnicos de Origem e Destino com pulso luminoso e indicador gráfico.
 */
export function drawWaypoint(ctx, x, y, type, label, cellSize) {
  const cx = (x + 0.5) * cellSize;
  const cy = (y + 0.5) * cellSize;
  const radius = cellSize * 0.42;

  ctx.save();

  const isStart = type === 'start';
  const mainColor = isStart ? BLUEPRINT_THEME.startPoint : BLUEPRINT_THEME.targetPoint;
  const glowColor = isStart ? 'rgba(16, 185, 129, 0.5)' : 'rgba(244, 63, 94, 0.5)';

  // Halo luminoso radial
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = glowColor;
  ctx.fill();

  // Círculo central com contorno em giz
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = mainColor;
  ctx.fill();
  ctx.strokeStyle = BLUEPRINT_THEME.chalkWhite;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Glifo interno
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  if (isStart) {
    const iconSize = radius * 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - iconSize * 0.5, cy - iconSize);
    ctx.lineTo(cx + iconSize, cy);
    ctx.lineTo(cx - iconSize * 0.5, cy + iconSize);
    ctx.closePath();
    ctx.fill();
  } else {
    const crossArm = radius * 0.6;
    ctx.beginPath();
    ctx.moveTo(cx - crossArm, cy); ctx.lineTo(cx + crossArm, cy);
    ctx.moveTo(cx, cy - crossArm); ctx.lineTo(cx, cy + crossArm);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.7, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (label) {
    ctx.font = `700 ${Math.max(9, Math.floor(cellSize * 0.38))}px 'Outfit', 'Inter', monospace`;
    const metrics = ctx.measureText(label.toUpperCase());
    const tagW = metrics.width + 10;
    const tagH = 18;
    const tagY = cy - radius - 16;

    ctx.fillStyle = 'rgba(0, 25, 46, 0.92)';
    ctx.fillRect(cx - tagW / 2, tagY, tagW, tagH);

    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - tagW / 2, tagY, tagW, tagH);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label.toUpperCase(), cx, tagY + tagH / 2);
  }

  ctx.restore();
}

/**
 * Renderiza alvenarias a partir dos tipos discretos da matriz do grid.
 */
export function drawWalls(ctx, grid, cellSize) {
  if (!grid || !grid.celulas) return;

  const cols = grid.colunas;
  const rows = grid.linhas;

  ctx.save();
  ctx.fillStyle = BLUEPRINT_THEME.bgDeep;
  ctx.strokeStyle = BLUEPRINT_THEME.chalkWhite;
  ctx.lineWidth = 1.2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid.celulas[y][x] === 1) {
        const px = x * cellSize;
        const py = y * cellSize;

        ctx.fillRect(px, py, cellSize, cellSize);
        ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + cellSize, py + cellSize);
        ctx.stroke();
        ctx.strokeStyle = BLUEPRINT_THEME.chalkWhite;
      }
    }
  }

  ctx.restore();
}

/**
 * Renderiza véu translúcido dos estados explorados na busca em malha ortogonal.
 */
export function drawExploredNodes(ctx, exploredNodes, cellSize, algorithm = 'astar') {
  if (!Array.isArray(exploredNodes) || exploredNodes.length === 0) return;

  ctx.save();
  const fillColor = algorithm === 'greedy' 
    ? BLUEPRINT_THEME.exploredGreedy 
    : BLUEPRINT_THEME.exploredAstar;
  
  const borderColor = algorithm === 'greedy'
    ? 'rgba(245, 158, 11, 0.5)'
    : 'rgba(56, 189, 248, 0.5)';

  ctx.fillStyle = fillColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 0.8;

  for (const node of exploredNodes) {
    const px = node.x * cellSize;
    const py = node.y * cellSize;

    ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
    ctx.strokeRect(px + 1.5, py + 1.5, cellSize - 3, cellSize - 3);
  }

  ctx.restore();
}

/**
 * Traça vetores de rota calculados:
 * - A*: linha contínua em ciano elétrico (#38bdf8) com dispersão luminosa.
 * - Gulosa: linha tracejada em amarelo nanquim (#f59e0b).
 */
export function drawRoute(ctx, path, cellSize, type = 'astar') {
  if (!Array.isArray(path) || path.length < 2) return;

  ctx.save();
  const isAstar = type === 'astar';
  const color = isAstar ? BLUEPRINT_THEME.routeAstar : BLUEPRINT_THEME.routeGreedy;

  ctx.strokeStyle = color;
  ctx.lineWidth = isAstar ? 3.5 : 3.0;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (!isAstar) {
    ctx.setLineDash([7, 5]);
  } else {
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
  }

  ctx.beginPath();
  for (let i = 0; i < path.length; i++) {
    const cx = (path[i].x + 0.5) * cellSize;
    const cy = (path[i].y + 0.5) * cellSize;

    if (i === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  }
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;

  for (let i = 0; i < path.length; i += 2) {
    const cx = (path[i].x + 0.5) * cellSize;
    const cy = (path[i].y + 0.5) * cellSize;

    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Orquestrador principal das camadas de renderização da planta baixa hospitalar.
 */
export function renderHospitalBlueprint(ctx, scenario, options = {}) {
  if (!ctx || !scenario) return;

  const {
    cellSize = 32,
    exploredNodes = [],
    exploredAlgorithm = 'astar',
    routes = {},
    activeAlgorithm = 'both'
  } = options;

  const cols = scenario.grid ? scenario.grid.colunas : (scenario.cols || 24);
  const rows = scenario.grid ? scenario.grid.linhas : (scenario.rows || 16);

  // 1. Grade milimetrada de fundo
  drawExpandedGrid(ctx, cols, rows, cellSize, 2500);

  // 2. Paredes e alvenarias
  if (scenario.grid) {
    drawWalls(ctx, scenario.grid, cellSize);
  }

  // 3. Zonas de Congestionamento (g = 5.0)
  if (Array.isArray(scenario.congestionZones)) {
    for (const zone of scenario.congestionZones) {
      drawCongestionZone(ctx, zone, cellSize);
    }
  }

  // 4. Alas de Isolamento Biológico (ANVISA RDC 50)
  if (Array.isArray(scenario.isolationZones)) {
    for (const zone of scenario.isolationZones) {
      drawIsolationCore(ctx, zone, cellSize);
    }
  }

  // 5. Compartimentos e salas
  if (Array.isArray(scenario.rooms)) {
    for (const room of scenario.rooms) {
      drawRoom(ctx, room, cellSize);
    }
  }

  // 6. Estados visitados na expansão
  if (exploredNodes && exploredNodes.length > 0) {
    drawExploredNodes(ctx, exploredNodes, cellSize, exploredAlgorithm);
  }

  // 7. Trajetórias das rotas
  if ((activeAlgorithm === 'both' || activeAlgorithm === 'greedy') && routes.greedy) {
    drawRoute(ctx, routes.greedy, cellSize, 'greedy');
  }

  if ((activeAlgorithm === 'both' || activeAlgorithm === 'astar') && routes.astar) {
    drawRoute(ctx, routes.astar, cellSize, 'astar');
  }

  // 8. Marcos técnicos de Origem e Destino
  if (scenario.start) {
    drawWaypoint(
      ctx,
      scenario.start.x,
      scenario.start.y,
      'start',
      scenario.start.label || 'Origem',
      cellSize
    );
  }

  if (scenario.target) {
    drawWaypoint(
      ctx,
      scenario.target.x,
      scenario.target.y,
      'target',
      scenario.target.label || 'Destino',
      cellSize
    );
  }
}
