import { PIECE_ABR } from '../constants'
import { Move, Square } from './board'
import { coordinatesFromPosition, positionFromCoordinates } from './utils'

interface GameMetaData {
	enPassantTargetSquare: string
}

export class ChessGame {
	board: Square[][]
	legalMoves: Move[]
	toMove: 'white' | 'black'
	metaData: GameMetaData

	constructor(board: Square[][]) {
		this.board = board
		this.toMove = 'white'
		this.metaData = { enPassantTargetSquare: null }
	}

	makeMove(move: Move) {
		const [i, j] = coordinatesFromPosition(move.to.id)
		const [iOrigin, jOrigin] = coordinatesFromPosition(move.from.id)
		const isEnPassantMove = move.to.id === this.metaData.enPassantTargetSquare
		if (isEnPassantMove) {
			const [i, j] = coordinatesFromPosition(
				this.metaData.enPassantTargetSquare
			)

			this.board[iOrigin][j].piece = null
		}

		this.metaData.enPassantTargetSquare = null
		const newGrid: Square[][] = [...this.board]

		newGrid[i][j].piece = { ...move.originPiece, position: move.to }
		newGrid[iOrigin][jOrigin].piece = null
		this.board = newGrid

		if (move.originPiece.type === PIECE_ABR.p) {
			// did pawn move 2 squares:
			if (Math.abs(i - iOrigin) === 2) {
				const targetRank = iOrigin + (i - iOrigin) / 2
				const enPassantSqr = positionFromCoordinates([targetRank, j])

				this.metaData.enPassantTargetSquare = enPassantSqr
			}
		}

		this.toMove = this.toMove === 'white' ? 'black' : 'white'
	}

	clearLegalMoves() {
		this.legalMoves = []
	}
}
