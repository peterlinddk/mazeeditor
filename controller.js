import * as model from "./model.js";
import * as view from "./view.js";

// import algorithms
import RandomizedDFS from "./algorithms/randomdfs.js";
import Kruskal from "./algorithms/kruskal.js";

let currentAlgorithm = null;

export function initialize() {
    model.initializeMaze();
    view.buildGrid(model);
    view.initializeClicks();
    view.disablePlayButtons();
    draw();
}

export function reInitialize(rows, cols) {
    model.initializeMaze(rows,cols);
    view.buildGrid(model);
    draw();
}

function draw() {
    view.displayGrid(model);
}

export function clickCell(cell, position) {
    if (position != "center") {
        model.toggleWall(cell, position);
        draw();
    }
}

export function createMaze(name) {
    switch (name) {
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
            setAlgorithm(new RandomizedDFS());
            break;
        case "kruskal":
            setAlgorithm(new Kruskal());
            break;
    }
    draw();
}

function setAlgorithm(algorithm) {
    currentAlgorithm = algorithm;
    currentAlgorithm.initialize();
    initializeControls();

}

function initializeControls() {
    // Enable and disable play/pause/step correctly
    view.enablePlayButtons();
}

let autoRun = false;
let autoSpeed = 250;

export function setSpeed(speed) {
    autoSpeed = 501 - speed;
}

export function run() {
    autoRun = true;
    view.disableRunButton();
    step();
}

export function pause() {
    autoRun = false;
    view.enableRunButton();
}

export function step() {
    if (currentAlgorithm) {
        if (!currentAlgorithm.done) {
            currentAlgorithm.step();
            view.displayGrid(model);
            if (autoRun) {
                setTimeout(step, autoSpeed);
            }
        } else {
            view.disablePlayButtons();
            autoRun = false;
        }
    }
}