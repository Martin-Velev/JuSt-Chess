import { Piece, Square } from './board'
import { ChessGame } from './game'
import { coordinatesFromPosition } from './utils'

const DIAGONALS: [number, number][] = [
	[-1, -1],
	[-1, +1],
	[+1, -1],
	[+1, +1],
]
const RANK_FILE: [number, number][] = [
	[-1, 0], // UP
	[+1, 0], // DOWN
	[0, -1], // LEFT
	[0, +1], // RIGHT
]
const KNIGHT_MOVES: [number, number][] = [
	[+2, +1],
	[+2, -1],
	[-2, +1],
	[-2, -1],

	[+1, +2],
	[-1, +2],
	[+1, -2],
	[-1, -2],
]

export class Move {
	to: Square
	from: Square
	piece: Piece
	isCapture?: boolean

	notation?: string
}

interface PieceFilter {
	color?: string
	type?: string
}
export function isThreatened(piece: Piece, board: Square[][]) {
	// const diagonals = checkLine(DIAGONALS)

	function pieceOnBoard(filter: PieceFilter, board: Square[][]): Piece[] {
		const pieces = board.reduce((prev, rank) => {
			const pieces = rank.filter((sqr) => sqr.piece).map((sqr) => sqr.piece)
			if (pieces.length > 0 && filter) {
				let filteredPieces = pieces.filter((piece) => {
					
				})

				console.log('fltr', filteredPieces)
				if (filteredPieces.length > 0) {
					return [...prev, ...filteredPieces]
				}
			}
			return prev
		}, [])
		console.log('final', pieces)
		return []
	}

	const oppositeColor = piece.color === 'white' ? 'black' : 'white'

	const bishops: Piece[] = pieceOnBoard(
		{ type: 'Bishop', color: oppositeColor },
		board
	)

	console.log('bishops', bishops)
}

function legalMoves(
	directions: [number, number][],
	piece: Piece,
	game: ChessGame
): Move[] {
	const { board } = game
	let moves: Move[] = []
	const [i, j] = coordinatesFromPosition(piece.position)
	const originSqr = board[i][j]
	directions.forEach((dir) => {
		const newI = i + dir[0]
		const newJ = j + dir[1]
		if (newI > 7 || newI < 0 || newJ > 7 || newJ < 0) {
			return moves
		}

		// if (i === iCur && j === jCur) return

		const trgtSqr = board[newI][newJ]
		if (trgtSqr.piece) {
			if (piece.color === trgtSqr.piece.color) {
				// Same colored piece
				return
			} else {
				// Opposite color piece (Capture)
				let move: Move = new Move()
				move.from = originSqr
				move.to = board[newI][newJ]
				move.piece = piece
				move.isCapture = true

				moves.push(move)
			}
		} else {
			let move: Move = new Move()
			move.from = originSqr
			move.to = board[newI][newJ]
			move.piece = piece
			move.isCapture = false
			moves.push(move)
		}
	})
	return moves
}

function checkLine(
	[i, j]: [number, number],
	[iIncr, jIncr]: [number, number],
	board: Square[][],
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

	const trgtSqr = board[newI][newJ]
	if (trgtSqr.piece) {
		if (piece.color === trgtSqr.piece.color) {
			// Same colored piece
			return
		} else {
			// Opposite color piece (Capture)
			let move: Move = new Move()
			move.from = originSqr
			move.to = board[newI][newJ]
			move.piece = piece
			move.isCapture = true

			return [...moves, move]
		}
	} else {
		let move: Move = new Move()
		move.from = originSqr
		move.to = board[newI][newJ]
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

export function generateLegalMoves(piece: Piece, game: ChessGame): Move[] {
	if (!piece || !game) return
	switch (piece.type) {
		case 'Pawn':
			return legalPawnMoves(piece, game)
		case 'Bishop':
			return legalBishopMoves(piece, game)
		case 'Rook':
			return legalRookMoves(piece, game)
		case 'Queen':
			return legalQueenMoves(piece, game)
		case 'Knight':
			return legalKnightMoves(piece, game)
		case 'King':
			return legalKingMoves(piece, game)
		default:
			return []
	}
}

function legalPawnMoves(piece: Piece, { board }: ChessGame): Move[] {
	const moves = []

	const [iCur, jCur] = coordinatesFromPosition(piece.position)

	const originSqr = board[iCur][jCur]
	const pawnDir = piece.color === 'white' ? -1 : +1

	// Captures
	let targetI = iCur + pawnDir
	if (targetI < 8 && targetI >= 0) {
		// CAPTURE LEFT
		let targetJLeft = jCur - 1
		if (targetJLeft > 0) {
			const targetPiece = board[targetI][targetJLeft].piece

			if (targetPiece && targetPiece.color !== piece.color) {
				const captureLeft = new Move()

				captureLeft.from = originSqr
				captureLeft.to = board[targetI][targetJLeft]
				captureLeft.isCapture = true

				moves.push(captureLeft)
			}
		}

		let targetJRight = jCur + 1
		if (targetJRight < 8) {
			const targetPiece = board[targetI][targetJRight].piece

			if (targetPiece && targetPiece.color !== piece.color) {
				const captureRight = new Move()

				captureRight.from = originSqr
				captureRight.to = board[targetI][targetJRight]
				captureRight.isCapture = true
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
		oneForward.to = board[targetI][jCur]
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
		twoForward.to = board[targetI][jCur]

		if (isInitalRank && !twoForward.to.piece) {
			moves.push(twoForward)
		}
	}

	//En Passant

	return moves
}

function legalRookMoves(piece: Piece, { board }: ChessGame): Move[] {
	let moves: Move[] = []

	const [iCur, jCur] = coordinatesFromPosition(piece.position)
	const originSqr = board[iCur][jCur]

	const directions = RANK_FILE
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

function legalKnightMoves(piece: Piece, game: ChessGame): Move[] {
	let directions = KNIGHT_MOVES
	return legalMoves(directions, piece, game)
}

function legalBishopMoves(piece: Piece, game: ChessGame): Move[] {
	const { board } = game
	let moves: Move[] = []

	const [iCur, jCur] = coordinatesFromPosition(piece.position)
	const originSqr = board[iCur][jCur]

	const directions = DIAGONALS

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

function legalQueenMoves(piece: Piece, game: ChessGame): Move[] {
	const diagonalMoves = legalBishopMoves(piece, game)
	const lateralMoves = legalRookMoves(piece, game)

	return [...diagonalMoves, ...lateralMoves]
}

function legalKingMoves(piece: Piece, game: ChessGame) {
	let directions: [number, number][] = [
		[-1, 0], // UP
		[-1, -1], // UP-LEFT
		[0, -1], // LEFT
		[+1, -1], // BOTTOM-LEFT
		[+1, 0], // BOTTOM
		[+1, +1], // BOTTOM-RIGHT
		[0, +1], // RIGHT
		[-1, +1], // TOP-RIGHT
	]

	return legalMoves(directions, piece, game)
}
