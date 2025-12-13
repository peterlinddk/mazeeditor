import Grid from "./grid.js";

let grid = null;

export function initializeMaze() {
    grid = new Grid(10, 14);

    window.grid = grid;

    for (let row = 0; row < grid.rows(); row++) {
        for (let col = 0; col < grid.cols(); col++) {
            // create completely walled in cells
            const cell = {
                row,
                col,
                north: true,
                south: true,
                east: true,
                west: true,
            }

            grid.set({ row, col }, cell);
        }
    }
}

export function rows() {
    return grid.rows();
}

export function cols() {
    return grid.cols();
}

export function cell(row, col) {
    return grid.get({ row, col });
}

export function cellAtIndex(index) {
    return grid.get(grid.rowColFor(index));
}

/* toggles a wall in the selected cell at the given position
   - only toggles if there is a neighbour in that direction,
     and makes sure that that neighbour's wall will match,
     so there aren't any "half" walls
*/
export function toggleWall(cell, position) {
    switch (position) {
        case "north":
            const north = grid.north(cell);
            if (north) {
                cell.north = !cell.north;
                grid.get(north).south = cell.north;
            }
            break;
        case "south":
            const south = grid.south(cell);
            if (south) {
                cell.south = !cell.south;
                grid.get(south).north = cell.south;
            }
            break;
        case "west":
            const west = grid.west(cell);
            if (west) {
                cell.west = !cell.west;
                grid.get(west).east = cell.west;
            }
            break;
        case "east":
            const east = grid.east(cell);
            if (east) {
                cell.east = !cell.east;
                grid.get(east).west = cell.east;
            }
            break;
    }
}

export function allWalls() {
    for (let row = 0; row < grid.rows(); row++) {
        for (let col = 0; col < grid.cols(); col++) {
            // create completely walled in cells
            const cell = grid.get({ row, col });
            cell.north = true;
            cell.south = true;
            cell.east = true;
            cell.west = true;
        }
    }
}

export function noWalls() {
    for (let row = 0; row < grid.rows(); row++) {
        for (let col = 0; col < grid.cols(); col++) {
            // create completely open grid
            const cell = grid.get({ row, col });
            if (grid.north({ row, col })) cell.north = false;
            if (grid.south({ row, col })) cell.south = false;
            if (grid.west({ row, col })) cell.west = false;
            if (grid.east({ row, col })) cell.east = false;
        }
    }
}

export function randomWalls() {
    for (let row = 0; row < grid.rows(); row++) {
        for (let col = 0; col < grid.cols(); col++) {
            const cell = grid.get({ row, col });
            // toggle all four walls randomly - with a 20% chance for each
            if (Math.random() < .2) toggleWall(cell, "north");
            if (Math.random() < .2) toggleWall(cell, "east");
            if (Math.random() < .2) toggleWall(cell, "south");
            if (Math.random() < .2) toggleWall(cell, "west");
        }
    }
}

export function randomizedDFS() {
    allWalls();
    // begin at cell 0, 0
    let currentCell = grid.get({ row: 0, col: 0 });
    dfs_visit(currentCell);
    // clear all cells of visited
    for (let row = 0; row < grid.rows(); row++) {
        for (let col = 0; col < grid.cols(); col++) {
            const cell = grid.get({ row, col });
            delete cell.visited;
        }
    }
}

function dfs_visit(currentCell) {
    currentCell.visited = true;
    // get unvisited neighbours
    let neighbours = grid.neighbours(currentCell).filter(cell => !cell.visited);
    while (neighbours.length > 0) {
        // select a neighbour at random
        let index = Math.floor(Math.random() * neighbours.length);
        let neighbour = neighbours.splice(index, 1).shift();
        // connect to this neighbour
        if (neighbour.row > currentCell.row) {
            currentCell.south = false;
            neighbour.north = false;
        } else if (neighbour.row < currentCell.row) {
            currentCell.north = false;
            neighbour.south = false;
        } else if (neighbour.col > currentCell.col) {
            currentCell.east = false;
            neighbour.west = false;
        } else if (neighbour.col < currentCell.col) {
            currentCell.west = false;
            neighbour.east = false;
        }

        // and then visit it
        dfs_visit(neighbour);

        neighbours = neighbours.filter(cell => !cell.visited);
    }
}