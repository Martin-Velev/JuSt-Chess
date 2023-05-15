import { Board, Piece, Square } from './board'
import { coordinatesFromPosition, positionFromCoordinates } from './utils'

export class Move {
	to: Square
	from: Square
	notation: string
	piece: Piece
	isCapture?: boolean
}

export function generateLegalMoves(piece: Piece, board: Board): Move[] {
	if (!piece || !board) return
	switch (piece.type) {
		case 'Pawn':
			return legalPawnMoves(piece, board)
		case 'Bishop':
			return legalBishopMoves(piece, board)
		default:
			return []
	}
	return []
}

function legalPawnMoves(piece: Piece, board: Board): Move[] {
	if (piece.type !== 'Pawn') return null
	const moves = []

	const [iCur, jCur] = coordinatesFromPosition(piece.position)

	const originSqr = board.grid[iCur][jCur]
	const pawnDir = piece.color === 'white' ? -1 : +1

	// Move one forward
	// check if there's room ahead
	let targetI = iCur + pawnDir
	if (targetI < 7 && targetI > 0) {
		const oneForward = new Move()
		oneForward.from = originSqr
		oneForward.to = board.grid[targetI][jCur]
		if (!oneForward.to.piece) {
			moves.push(oneForward)
		}
	}

	// Move 2 forward
	// check if there's room ahead
	targetI = iCur + pawnDir * 2
	if (targetI < 7 && targetI > 0) {
		const initialRank = piece.color === 'white' ? 2 : 7
		const isInitalRank = parseInt(piece.position.split('')[1]) === initialRank
		const twoForward = new Move()
		twoForward.from = originSqr
		twoForward.to = board.grid[targetI][jCur]
		if (isInitalRank && !twoForward.to.piece) {
			moves.push(twoForward)
		}
	}

	// Captures
	targetI = iCur + pawnDir
	if (targetI < 7 && targetI > 0) {
		// CAPTURE LEFT
		let targetJLeft = jCur - 1
		if (targetJLeft > 0) {
			const targetPiece = board.grid[targetI][targetJLeft].piece

			if (targetPiece && targetPiece.color !== piece.color) {
				const captureLeft = new Move()

				captureLeft.from = originSqr
				captureLeft.to = board.grid[targetI][targetJLeft]

				moves.push(captureLeft)
			}
		}

		let targetJRight = jCur + 1
		if (targetJRight < 7) {
			const targetPiece = board.grid[targetI][targetJRight].piece

			if (targetPiece && targetPiece.color !== piece.color) {
				const captureRight = new Move()

				captureRight.from = originSqr
				captureRight.to = board.grid[targetI][targetJRight]
				moves.push(captureRight)
			}
		}
	}

	//En Passant

	return moves
}

function legalBishopMoves(piece: Piece, board: Board): Move[] {
	let moves: Move[] = []

	if (piece.type !== 'Bishop') return null

	const [iCur, jCur] = coordinatesFromPosition(piece.position)
	const originSqr = board.grid[iCur][jCur]

	function checkDiagonal(
		[i, j]: [number, number],
		[iIncr, jIncr]: [number, number],
		board: Board
	) {
		const newI = i + iIncr
		const newJ = j + jIncr
		console.log('iIncr, jIncr', iIncr, jIncr)
		console.log('newI, newJ', newI, newJ)
		if (newI > 7 || newI < 0 || newJ > 7 || newJ < 0) {
			return
		}

		console.log('recursive checking', positionFromCoordinates([newI, newJ]))

		// if (i === iCur && j === jCur) return

		const trgtSqr = board.grid[newI][newJ]
		if (trgtSqr.piece) {
			if (piece.color === trgtSqr.piece.color) {
				// Same colored piece
				return
			} else {
				// Opposite color piece (Capture)
				let move: Move = new Move()
				move.from = originSqr
				move.to = board.grid[newI][newJ]
				move.piece = piece
				move.isCapture = true
				moves.push(move)

				return
			}
		} else {
			let move: Move = new Move()
			move.from = originSqr
			move.to = board.grid[newI][newJ]
			move.piece = piece
			move.isCapture = false
			moves.push(move)

			checkDiagonal([newI, newJ], [iIncr, jIncr], board)
		}
	}
	console.log('--------')

	// top left
	checkDiagonal([iCur, jCur], [-1, -1], board)
	// top right
	checkDiagonal([iCur, jCur], [-1, +1], board)
	// bottom left
	checkDiagonal([iCur, jCur], [+1, -1], board)
	// bottom right
	checkDiagonal([iCur, jCur], [+1, +1], board)

	return moves
}
