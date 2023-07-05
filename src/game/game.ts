import { Square } from './board'
import { Move } from './move'
import { coordinatesFromPosition } from './utils'

export class ChessGame {
	board: Square[][]
	legalMoves: Move[]
	toMove: 'white' | 'black'

	constructor(board: Square[][]) {
		this.board = board
		this.toMove = 'white'
	}

	makeMove(move: Move) {
		const [i, j] = coordinatesFromPosition(move.to.id)
		const [iOrigin, jOrigin] = coordinatesFromPosition(move.from.id)
		const newGrid: Square[][] = [...this.board]

		newGrid[i][j].piece = { ...move.originPiece, position: move.to }
		newGrid[iOrigin][jOrigin].piece = null
		this.board = newGrid

		this.toMove = this.toMove === 'white' ? 'black' : 'white'
	}

	clearLegalMoves() {
		this.legalMoves = []
	}
}
