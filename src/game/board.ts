import { initBoardGrid } from "./utils"

export class Square {
	id: string
	piece: Piece
	color: string
	styles?: string[] 

	constructor() {
		this.styles = []
	}
}

export class Piece {
	symbol: string
	type: string
	position: string
	color: string
}

export class Board {
	grid: Square[][]
	constructor(grid: Square[][]) {
		if (grid && grid.length === 8 && grid[0].length === 8) {
			this.grid = grid
		} else {
			this.grid = initBoardGrid()
		}
	}
}