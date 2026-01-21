import * as model from "../model.js";
import Algorithm from "./algorithm.js"

export default class RandomizedDFS extends Algorithm {

    stack = [];

    constructor(controller) {
        super(controller);
    }

    initialize() {
        super.initialize();

        // clear stack
        this.stack = [];

        // Choose initial cell, visit is, and push it to the stack
        // begin at cell 0, 0
        const currentCell = model.cell(0,0); //{ row: 0, col: 0 });

        this.visit(currentCell);
        this.stack.push(currentCell);

        window.stack = this.stack;
    }


    step() {
        // As long as the stack isn't empty
        if (!this.done && this.stack.length > 0) {
            // pop a cell , and make it the current cell
            const currentCell = this.stack.pop();
            this.setCurrent(currentCell);
            currentCell.inStack = false;
            
            // if the current cell has any neighbours which have not been visited:
            let neighbours = grid.neighbours(currentCell).filter(cell => !cell.visited);
            if (neighbours.length > 0) {
                // push the current cell to the stack
                // - but only if there are more neighbours!
                if (neighbours.length > 1) {
                    currentCell.inStack = true;
                    this.stack.push(currentCell);
                }

                // choose one of the unvisited neighbours at random
                let index = Math.floor(Math.random() * neighbours.length);
                let chosen = neighbours.splice(index, 1).shift();

                // remove the wall between current and chosen
                model.removeWallBetween(currentCell, chosen);

                // mark chosen as visited, and push it to the stack
                this.visit(chosen);
                this.stack.push(chosen);
                this.setCurrent(chosen);
            }
        } else {
            this.done = true;
        }
    }
}