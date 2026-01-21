import * as model from "../model.js";

export default class Algorithm {
    constructor(controller) {
        this.controller = controller;
        
    }

    initialize() {
        model.allWalls();
        model.clearProperties();
        this.done = false;
    }

    step() {

    }
}