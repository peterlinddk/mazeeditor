export default class Grid {

    arr = [];
    #rows = 0;
    #cols = 0;

    constructor(rows, cols) {
        this.arr = new Array(rows * cols);
        this.#rows = rows;
        this.#cols = cols;
    }

    isValidCoordinate({ row, col }) {
        return 0 <= row && row < this.#rows &&
            0 <= col && col < this.#cols;
    }

    // - sætter value på den angivne plads.
    set({ row, col }, value) {
        this.arr[row * this.#cols + col] = value;
    }

    // - returnerer `value` på den angivne plads
    get({ row, col }) {
        if (this.isValidCoordinate({ row, col }))
            return this.arr[row * this.#cols + col];
        else
            return undefined;
    }

    getRandomCell() {
        const row = Math.floor(Math.random()*this.#rows);
        const col = Math.floor(Math.random()*this.#cols);
        return this.get({row,col});
    }

    // - returnerer index (nummeret) på cellen i denne række+kolonne
    indexFor({ row, col }) {
        if (this.isValidCoordinate({ row, col }))
            return row * this.#cols + col;
        else
            return undefined;
    }

    // - returnerer et `{row, col}` objekt for cellen med dette index (nummer)
    rowColFor(index) {
        if (0 <= index && index < this.arr.length) {
            return {
                row: Math.floor(index / this.#cols),
                col: index % this.#cols
            }
        } else {
            return undefined;
        }
    }

    // - returnerer en liste over alle naboceller til denne (i form af `{row, col}` objekter
    neighbourCoords({ row, col }) {
        const neighbours = [];
        // north
        if (row > 0) neighbours.push({ row: row - 1, col });
        // south
        if (row < this.#rows - 1) neighbours.push({ row: row + 1, col })
        // west
        if (col > 0) neighbours.push({ row, col: col - 1 });
        // east    
        if (col < this.#cols - 1) neighbours.push({ row, col: col + 1 });

        return neighbours;
    }

    // - returnerer en liste over alle nabocellers values.
    neighbours({ row, col }) {
        return this.neighbourCoords({ row, col }).map(cell => this.get(cell));
    }

    //Når der skal returneres en celle, er det kun value der returneres

    // - returnerer cellen til højre efter denne, eller undefined hvis der ikke er flere i den **row**
    nextInRow({ row, col }) {
        return this.east({ row, col });
    }
    // - returnerer cellen under denne, eller undefined hvis der ikke er flere i den **col**
    nextInCol({ row, col }) {
        return this.south({ row, col })
    }

    // - returnerer cellen over denne, eller undefined, hvis der ikke er nogen
    north({ row, col }) {
        if (row > 0) {
            return this.get({ row: row - 1, col });
        } else {
            return undefined;
        }
    }
    // - returnerer cellen under denne, eller undefined, hvis der ikke er nogen
    south({ row, col }) {
        if (row < this.#rows - 1) {
            return this.get({ row: row + 1, col });
        } else {
            return undefined;
        }
    }
    //- returnerer cellen til venstre for denne, eller undefined, hvis der ikke er nogen
    west({ row, col }) {
        if (col > 0) {
            return this.get({ row, col: col - 1 });
        } else {
            return undefined;
        }
    }
    // - returnerer cellen til højre for denne, eller undefined, hvis der ikke er nogen
    east({ row, col }) {
        if (col < this.#cols - 1) {
            return this.get({ row, col: col + 1 });
        } else {
            return undefined;
        }
    }



    //- returnerer antallet af rækker
    rows() {
        return this.#rows;
    }
    // - returnerer antallet af kolonner
    cols() {
        return this.#cols;
    }

    // - returnerer det samlede antal celler
    size() {
        return this.#rows * this.#cols;
    }



    // - skriver den angivne value ind i alle celler
    fill(value) {
        for (let row = 0; row < this.#rows; row++) {
            for (let col = 0; col < this.#cols; col++) {
                this.arr[row * this.#cols + col] = value;
            }
        }
    }

}