import { initBoardGrid } from "./utils"

export class Board {
	constructor(grid) {
		if (grid && grid.length === 8 && grid[0].length === 8) {
			this.grid = grid
		} else {
			this.grid = initBoardGrid()
		}
	}
}