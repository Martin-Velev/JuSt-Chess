import { Board, Piece, Square } from './board'
import { coordinatesFromPosition, positionFromCoordinates } from './utils'

export class Move {
	to: Square
	from: Square
	notation: string
	piece: Piece
	isCapture?: boolean
}

function checkLine(
	[i, j]: [number, number],
	[iIncr, jIncr]: [number, number],
	board: Board,
	piece: Piece,
	originSqr: Square,
	moves: Move[]
): Move[] {
	const newI = i + iIncr
	const newJ = j + jIncr
	if (newI > 7 || newI < 0 || newJ > 7 || newJ < 0) {
		return moves
	}

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

			return [...moves, move]
		}
	} else {
		let move: Move = new Move()
		move.from = originSqr
		move.to = board.grid[newI][newJ]
		move.piece = piece
		move.isCapture = false
		moves.push(move)

		return checkLine(
			[newI, newJ],
			[iIncr, jIncr],
			board,
			piece,
			originSqr,
			moves
		)
	}
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
}

function legalPawnMoves(piece: Piece, board: Board): Move[] {
	if (piece.type !== 'Pawn') return null
	const moves = []

	const [iCur, jCur] = coordinatesFromPosition(piece.position)

	const originSqr = board.grid[iCur][jCur]
	const pawnDir = piece.color === 'white' ? -1 : +1

	// Captures
	let targetI = iCur + pawnDir
	if (targetI < 8 && targetI >= 0) {
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
		if (targetJRight < 8) {
			const targetPiece = board.grid[targetI][targetJRight].piece

			if (targetPiece && targetPiece.color !== piece.color) {
				const captureRight = new Move()

				captureRight.from = originSqr
				captureRight.to = board.grid[targetI][targetJRight]
				moves.push(captureRight)
			}
		}
	}

	// Move one forward
	// check if there's room ahead
	targetI = iCur + pawnDir
	if (targetI < 8 && targetI >= 0) {
		const oneForward = new Move()
		oneForward.from = originSqr
		oneForward.to = board.grid[targetI][jCur]
		if (!oneForward.to.piece) {
			moves.push(oneForward)
		} else {
			return moves
		}
	}

	// Move 2 forward
	// check if there's room ahead
	targetI = iCur + pawnDir * 2
	if (targetI < 8 && targetI >= 0) {
		const initialRank = piece.color === 'white' ? 2 : 7
		const isInitalRank = parseInt(piece.position.split('')[1]) === initialRank
		const twoForward = new Move()
		twoForward.from = originSqr
		twoForward.to = board.grid[targetI][jCur]

		if (isInitalRank && !twoForward.to.piece) {
			moves.push(twoForward)
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

	const directions: [number, number][] = [
		[-1, -1],
		[-1, +1],
		[+1, -1],
		[+1, +1],
	]
	// top left

	directions.forEach((direction) => {
		const newMoves = checkLine(
			[iCur, jCur],
			direction,
			board,
			piece,
			originSqr,
			moves
		)

		if (newMoves && newMoves.length > 0) {
			moves.push(...newMoves)
		}
	})

	return moves
}
