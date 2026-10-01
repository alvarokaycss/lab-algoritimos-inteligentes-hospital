export const TIPOS_CELULA = Object.freeze({
    LIVRE: 0,
    PAREDE: 1,
    ISOLAMENTO: 2,
    CONGESTIONADO: 3
});

// Custo infinito para células que não podem ser atravessadas, como paredes e 
// isolamento. Custo maior para células congestionadas, e custo padrão para
// células livres.
export const CUSTOS_CELULA = Object.freeze({
    [TIPOS_CELULA.LIVRE]: 1.0,
    [TIPOS_CELULA.PAREDE]: Infinity,
    [TIPOS_CELULA.ISOLAMENTO]: Infinity,
    [TIPOS_CELULA.CONGESTIONADO]: 5.0
});


export class GradeHospitalar {

    constructor(colunas, linhas) { 
        this.colunas = colunas;
        this.linhas = linhas;

        this.celulas = []
        for (let y = 0; y < linhas; y++) {
            const linha = []
            for (let x = 0; x < colunas; x++) {
                linha.push(TIPOS_CELULA.LIVRE);
            }
            this.celulas.push(linha);
        }
    }

    estaDentroDosLimites(x, y) {
        return x >= 0 && x < this.colunas && y >= 0 && y < this.linhas;
    }

    ehTransitavel(x, y) {
        const status = this.estaDentroDosLimites(x, y) &&
            this.celulas[y][x] !== TIPOS_CELULA.PAREDE &&
            this.celulas[y][x] !== TIPOS_CELULA.ISOLAMENTO;
        return status
    }

    obterCusto(x, y) {
        if (!this.estaDentroDosLimites(x, y)) {
            return Infinity;
        }

        return CUSTOS_CELULA[this.celulas[y][x]];
    }

    obterVizinhos(x, y) { 
        const vizinhos = [];
        const direcoes = [
            { dx: 0, dy: -1 }, // cima
            { dx: 1, dy: 0 },  // direita
            { dx: 0, dy: 1 },  // baixo
            { dx: -1, dy: 0 }  // esquerda
        ];

        for (const { dx, dy } of direcoes) {
            const nx = x + dx;
            const ny = y + dy;
            if (this.ehTransitavel(nx, ny)) {
                vizinhos.push({ x: nx, y: ny });
            }
        }

        return vizinhos;
    }

    definirCelula(x, y, tipo) {
        if (this.estaDentroDosLimites(x, y)) {
            this.celulas[y][x] = tipo;
        }
    }

    obterTipoCelula(x, y) {
        if (this.estaDentroDosLimites(x, y)) {
            return this.celulas[y][x];
        }
    }
}
