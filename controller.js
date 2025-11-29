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


