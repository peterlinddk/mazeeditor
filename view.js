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

export function initializeClicks() {
    document.querySelector("#maze").addEventListener("click", clickMaze);

    const visualCells = Array.from(document.querySelectorAll("#maze .cell"));

    function clickMaze(event) {
        const visualCell = event.target;

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
        }
    }
}