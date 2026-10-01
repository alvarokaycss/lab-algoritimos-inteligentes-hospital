/**
* Calcula a distância Euclidiana em linha reta
* h(n) = sqrt((x2 - x1)^2 + (y2 - y1)^2)
* 
* @param {{x: number, y: number}} ponto1 - Ponto de origem
* @param {{x: number, y: number}} ponto2 - Ponto de destino
* @returns {number} - Distância contínua em linha reta
*/
export function distanciaEuclidiana(ponto1, ponto2) {
    return Math.hypot(ponto1.x - ponto2.x, ponto1.y - ponto2.y);
}
