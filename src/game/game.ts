import { Board, Piece, Square } from './board'
import { Move } from './move'
import { coordinatesFromPosition } from './utils'

export class ChessGame {
	board: Board
	legalMoves: Move[]
	toMove: 'white' | 'black'

	constructor(board: Board) {
		this.board = board
		this.toMove = 'white'
	}

	makeMove(move: Move) {
		console.log('called')
		console.log('move', move)

		const [i, j] = coordinatesFromPosition(move.to.id)
		const [iOrigin, jOrigin] = coordinatesFromPosition(move.from.id)
		const newGrid: Square[][] = [...this.board.grid]

		newGrid[i][j].piece = { ...move.piece, position: move.to.id }
		newGrid[iOrigin][jOrigin].piece = null
		this.board.grid = newGrid

		this.toMove = this.toMove === 'white' ? 'black' : 'white'
	}

	clearLegalMoves() {
		this.legalMoves = []
	}
}
