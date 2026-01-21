import * as controller from "./controller.js";

let _model = null;

export function buildGrid(model) {
    _model = model;

    const visualMaze = document.querySelector("#maze");
    // clear everything, just in case
    visualMaze.innerHTML = "";

    for (let row = 0; row < model.rows(); row++) {
        for (let col = 0; col < model.cols(); col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            visualMaze.append(cell);
        }
    }

    visualMaze.style.setProperty("--COLS", model.cols());
}

export function displayGrid(model) {
    const visualCells = document.querySelectorAll("#maze .cell");

    for (let row = 0; row < model.rows(); row++) {
        for (let col = 0; col < model.cols(); col++) {
            const visualCell = visualCells[row * model.cols() + col];

            const cell = model.cell(row, col);

            visualCell.classList.remove("wall-north", "wall-south", "wall-east", "wall-west");
            if (cell.north) visualCell.classList.add("wall-north");
            if (cell.south) visualCell.classList.add("wall-south");
            if (cell.west) visualCell.classList.add("wall-west");
            if (cell.east) visualCell.classList.add("wall-east");

            visualCell.classList.remove("visited", "current", "instack");
            if (cell.visited) visualCell.classList.add("visited");
            if (cell.current) visualCell.classList.add("current");
            if (cell.inStack) visualCell.classList.add("instack");
        }
    }
}

export function initializeClicks() {
    // Make sure we don't accidentally post the form
    document.querySelector("form").addEventListener("submit", (event) => event.preventDefault());
    // add click-listener for form
    document.querySelector("form").addEventListener("click", (event) => event.target.id.startsWith("btn_") ? clickButton(event.target.id) : "");

    // and change-listener for speed
    document.querySelector("#speed_input").addEventListener("input", (event) => controller.setSpeed(event.target.value));

    // and for every single cell in the maze
    document.querySelector("#maze").addEventListener("click", clickMaze);
}

export function enablePlayButtons() {
    setPlayButtons(false, true, false);
}

export function disablePlayButtons() {
    setPlayButtons(true, true, true);
}

export function disableRunButton() {
    setPlayButtons(true, false, true);
}

export function enableRunButton() {
    setPlayButtons(false, true, false);
}

function setPlayButtons(run, pause, step) {
    document.querySelector("#btn_run").disabled = run;
    document.querySelector("#btn_pause").disabled = pause;
    document.querySelector("#btn_step").disabled = step;
}


function clickButton(buttonId) {
    //    console.log("Click button " + buttonId);
    switch (buttonId) {
        case "btn_creategrid": clickCreateGrid(); break;
        case "btn_createmaze": clickCreateMaze(); break;
        case "btn_run": controller.run(); break;
        case "btn_pause": controller.pause(); break;
        case "btn_step": controller.step(); break;
        default:
            console.error("No handler for button: " + buttonId);
    }
}

function clickCreateGrid() {
    // Re-create grid from sizes given ...
    const rows = document.querySelector("#rows_input").value;
    const cols = document.querySelector("#cols_input").value;

    if( rows > 2 && cols > 2) {
        controller.reInitialize(rows, cols);
    } else {
        // TODO: Display error
    }
}

function clickCreateMaze() {
    const algorithm = document.forms[0].algo_input.value;
    controller.createMaze(algorithm);
}

function clickMaze(event) {
    const visualCell = event.target;

    const visualCells = Array.from(document.querySelectorAll("#maze .cell"));

    // find matching cell in model
    const index = visualCells.indexOf(visualCell);
    const cell = _model.cellAtIndex(index);

    // find click-position in cell (n-s-e-w)
    const x = event.offsetX / visualCell.offsetWidth - .5;
    const y = event.offsetY / visualCell.offsetHeight - .5;

    let position = "center";
    // treat the middle two-thirds as center - and the remaining as edges
    if (Math.abs(x) > 0.3 || Math.abs(y) > 0.3) {
        if (Math.abs(x) > Math.abs(y)) {
            // x is dominant
            position = x < 0 ? "west" : "east";
        } else {
            // y is dominant
            position = y < 0 ? "north" : "south";
        }
    }
    controller.clickCell(cell, position);
}