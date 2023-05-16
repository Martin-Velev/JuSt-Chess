import { Board, Piece } from './board'
import { Move } from './move'

export class ChessGame {
	board: Board
	legalMoves: Move[]

	constructor(board: Board) {
		this.board = board
	}
}