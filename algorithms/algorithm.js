import * as model from "../model.js";

export default class Algorithm {
    constructor(controller) {
        this.controller = controller;    
    }

    visit(cell) {
        cell.visited = true;
    }

    last = null;

    setCurrent(cell) {
        if(this.last) {
            this.last.current = false;
        }
        if(cell) {
            cell.current = true;
        }
        this.last = cell;
    }

    initialize() {
        model.allWalls();
        model.clearProperties();
        this.done = false;
    }

    step() {

    }
}