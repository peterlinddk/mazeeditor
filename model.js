import Grid from "./grid.js";

let grid = null;

export function initializeMaze(rows=10, cols=14) {
    grid = new Grid(rows, cols);

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

export function clearProperties() {
    for (let row = 0; row < grid.rows(); row++) {
        for (let col = 0; col < grid.cols(); col++) {
            // create completely open grid
            const cell = grid.get({ row, col });
            cell.visited = false;
            cell.current = false;
            cell.inStack = false;
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


export function removeWallBetween(first, second) {
    // TODO: Make sure first and second are neighbours
    if (second.row > first.row) {
        first.south = false;
        second.north = false;
    } else if (second.row < first.row) {
        first.north = false;
        second.south = false;
    } else if (second.col > first.col) {
        first.east = false;
        second.west = false;
    } else if (second.col < first.col) {
        first.west = false;
        second.east = false;
    }
}

// TODO: Move these algorithms to algorithms classes - they don't work here!

export function wilson() {
    allWalls();
    clearVisited();

    const allCells = [];

    for (let row = 0; row < grid.rows(); row++) {
        for (let col = 0; col < grid.cols(); col++) {
            // Create a set for each cell
            const cell = grid.get({ row, col });
            allCells.push(cell);
        }
    }

    const cellsInMaze = new Set();

    // select cell at random
    const aCell = allCells.splice(Math.floor(Math.random() * allCells.length),1)[0];
    // and add it it the maze
    cellsInMaze.add(aCell);


    while (allCells.length > 0) {
        // select another cell at random - to walk from
        let cell = allCells.splice(Math.floor(Math.random() * allCells.length),1)[0];

        console.log("Random start cell:");
        console.log(cell);

        const path = [cell];
        let buildingPath = true;

        // build path
        while (buildingPath) {
            // add a random cell next to walkFrom
            const neighbours = grid.neighbours(cell);
            cell = neighbours[Math.floor(Math.random() * neighbours.length)];

            // This random cell is either:
            // 1 - already in the maze : so stop and add the entire path to the maze
            // 2 - already in the path : so erase the "loop" = everything in the path following where it was
            // 3 - neither, so add it to the path

            const indexInPath = path.indexOf(cell);

            // if it is in the maze - stop, and add the entire path to the maze
            if (cellsInMaze.has(cell)) {
                buildingPath = false;
                for (let i = path.length - 1; i > 0; i--) {
                    // connect last piece of path to previous
                    const lastCell = path[i];
                    const nextCell = path[i - 1];
                    connectCells(lastCell, nextCell);
                }
            } else if (indexInPath != -1) {
                // if it is in the path - delete everything from the index and forward
                path.splice(indexInPath + 1, path.length - indexInPath - 1);
                cell = path[indexInPath];
            } else {
                path.push(cell);
            }
        }

    }



}