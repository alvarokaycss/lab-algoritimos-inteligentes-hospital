export class FilaPrioridade {
    constructor() {
        this.heap = [];
    }

    estaVazia() {
        return this.heap.length === 0;
    }

    get tamanho() {
        return this.heap.length;
    }

    espiar() {
        return this.estaVazia() ? null : this.heap[0].item;
    }

    enfileirar(item, prioridade) {
        this.heap.push({ item, prioridade });
        this._subir(this.heap.length - 1);
    }

    _subir(indice) {
        while (indice > 0) {
            const indicePai = Math.floor((indice - 1) / 2);

            // trocam de lugar se a prioridade do filho for menor que a do pai
            if (this.heap[indice].prioridade < this.heap[indicePai].prioridade) {
                [this.heap[indice], this.heap[indicePai]] = [this.heap[indicePai], this.heap[indice]];
                indice = indicePai; // continuar subindo
            } else {
                break; // heap está em ordem
            }
        }
    }

    desenfileirar() {
        if (this.estaVazia()) return null;

        const menorItem = this.heap[0].item;
        const ultimo = this.heap.pop();

        if (!this.estaVazia()) {
            this.heap[0] = ultimo;
            this._descer(0);
        }
        return menorItem;
    }

    _descer(indice) {
        const tamanho = this.heap.length;

        while (true) {
            const filhoEsquerdo = 2 * indice + 1;
            const filhoDireito = 2 * indice + 2;
            let menorIndice = indice;

            // compara prioridade do filho esquerdo
            if (filhoEsquerdo < tamanho && this.heap[filhoEsquerdo].prioridade < this.heap[menorIndice].prioridade) {
                menorIndice = filhoEsquerdo;
            }

            // compara prioridade do filho direito
            if (filhoDireito < tamanho && this.heap[filhoDireito].prioridade < this.heap[menorIndice].prioridade) {
                menorIndice = filhoDireito;
            }
            
            if (menorIndice !== indice) {
                [this.heap[indice], this.heap[menorIndice]] = [this.heap[menorIndice], this.heap[indice]];
                indice = menorIndice; // continuar descendo
            } else {
                break; // heap está em ordem
            }
        }    
    }
}
