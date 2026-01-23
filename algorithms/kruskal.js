import * as model from "../model.js";
import Algorithm from "./algorithm.js"

export default class Kruskal extends Algorithm {

    walls = [];
    cellSets = new Set();

    constructor(controller) {
        super(controller);
    }

    initialize() {
        super.initialize();

        // Clear list of all walls ...
        this.walls = [];

        // And a set for each cell
        this.cellSets = new Set(); // TODO: Make this a "disjoint set"

        // Build lists of walls and cells
        for (let row = 0; row < model.rows(); row++) {
            for (let col = 0; col < model.cols(); col++) {
                // Create a set for each cell
                const cell = model.cell(row, col);
                this.cellSets.add(new Set([cell]));
                // Create a "wall" that divides two cells
                // - horisontally - if there is a cell after this
                if (col < model.cols() - 1) {
                    this.walls.push({ cellA: cell, cellB: model.cell(row, col + 1), direction: "hori" });
                }
                // - and vertically - if there is a cell below this
                if (row < model.rows() - 1) {
                    this.walls.push({ cellA: cell, cellB: model.cell(row + 1, col), direction: "vert" });
                }
            }
        }
    }

    recentlyJoined = [];

    step() {
        // As long as there are walls
        if (!this.done && this.walls.length > 0) {

            // First remove .joined from all recently joined cells
            while( this.recentlyJoined.length > 0 ) {
                this.recentlyJoined.shift().joined = false;
            }

            // pick a wall at random
            const [wall] = this.walls.splice(Math.floor(Math.random() * this.walls.length), 1);
            // Find the two sets containing the two cells 
            const setA = this.cellSets.values().find(set => set.has(wall.cellA));
            const setB = this.cellSets.values().find(set => set.has(wall.cellB));

            // TODO: Highlight picked wall somehow ...

            // if they are two distinct sets
            if (setA !== setB) {
                // Mark cells as visited - which will in time override the highlight ...                
                this.visit(wall.cellA);
                this.visit(wall.cellB);

                // remove the wall
                model.removeWallBetween(wall.cellA, wall.cellB);
                
                // and join the two sets
                const union = setA.union(setB);
                // remove both sets from cellSets
                this.cellSets.delete(setA);
                this.cellSets.delete(setB);
                // and add the union in stead
                this.cellSets.add(union);

                // mark cells in the union as newly joined
                union.forEach(cell => {
                    cell.joined = true;
                    this.recentlyJoined.push(cell);
                });
            } else {
                // Highlight wall between cells in the same set - make it visible that wall won't be removed!
                if (wall.direction === "vert") {
                    wall.cellA.highlight = "south";
                    wall.cellB.highlight = "north";
                } else {
                    wall.cellA.highlight = "east";
                    wall.cellB.highlight = "west";
                }
            }
        } else {
            this.done = true;
        }
    }

}