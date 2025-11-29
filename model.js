import Grid from "./grid.js";

let grid = null;

export function initializeMaze() {
    grid = new Grid(10,14);

    window.grid = grid;

    for(let row = 0; row < grid.rows(); row++) {
        for(let col = 0; col < grid.cols(); col++) {
            // create completely walled in cells
            const cell = {
                row, col,
                north:  true,
                south: true,
                east: true,
                west:  true,
            }

            grid.set({row,col}, cell);
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
    return grid.get({row, col});
}

export function cellAtIndex(index) {
    return grid.get( grid.rowColFor(index) );
}

/* toggles a wall in the selected cell at the given position
   - only toggles if there is a neighbour in that direction,
     and makes sure that that neighbour's wall will match,
     so there aren't any "half" walls
*/
export function toggleWall(cell, position) {
    switch(position) {
        case "north":
            const north = grid.north(cell);
            if(north) {
                cell.north = !cell.north;
                grid.get(north).south = cell.north;
            }
            break;
        case "south":
            const south = grid.south(cell);
            if(south) {
                cell.south = !cell.south;
                grid.get(south).north = cell.south;
            }
            break;
        case "west":
            const west = grid.west(cell);
            if(west) {
                cell.west = !cell.west;
                grid.get(west).east = cell.west;
            }
            break;
        case "east":
            const east = grid.east(cell);
            if(east) {
                cell.east = !cell.east;
                grid.get(east).west = cell.east;
            }
            break;
    }
}