import * as model from "./model.js";
import * as view from "./view.js";


export function initialize() {
    model.initializeMaze();
    view.buildGrid(model);
    view.initializeClicks();

    draw();
}

function draw() {
    view.displayGrid(model);
}

export function clickCell( cell, position ) {
    if(position != "center") {
        model.toggleWall(cell, position);
        draw();
    }
}

export function createMaze(algorithm) {
    switch(algorithm) {
        case "walls":
            model.allWalls();
            break;
        case "open":
            model.noWalls();
            break;
        case "random":
            model.randomWalls();
            break;
        case "dfs":
            model.randomizedDFS();
            break;
    }
    draw();
}