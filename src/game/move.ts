import { Piece, Square } from './board'
import { ChessGame } from './game'
import { coordinatesFromPosition, positionFromCoordinates } from './utils'

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
	originPiece: Piece
	isCapture?: boolean
	capturedPiece?: Piece

	notation?: string
}

interface PieceFilter {
	color?: string
	type?: string
}

export function piecesOnBoard(filter: PieceFilter, board: Square[][]): Piece[] {
	const pieces = board.reduce((prev, rank) => {
		const sqrsWithPiece = rank.filter((sqr) => !!sqr.piece)
		const pieces = sqrsWithPiece.map((sqr) => sqr.piece)
		if (pieces.length > 0 && filter) {
			let filteredPieces = pieces.filter((piece) => {
				if (filter.color && piece.color !== filter.color) return false
				if (filter.type && piece.type !== filter.type) return false
				return true
			})

			if (filteredPieces.length > 0) {
				return [...prev, ...filteredPieces]
			}
		}
		return prev
	}, [])
	return pieces as Piece[]
}

export function isThreatened(piece: Piece, game: ChessGame): boolean {
	const { board } = game
	const oppositeColor = piece.color === 'white' ? 'black' : 'white'

	const oppositePieces: Piece[] = piecesOnBoard({ color: oppositeColor }, board)
	const possibleMoves: Move[] = oppositePieces.reduce((moves, piece) => {
		const newMoves = generateLegalMoves(piece, game)
		return [...moves, ...newMoves]
	}, [])
	const possibleCaptures: Move[] = possibleMoves.filter(
		(move) => move.isCapture
	)

	if (possibleCaptures.find((move) => move.to.id === piece.position.id)) {
		return true
	}
	return false
}

function legalSingleMove(
	directions: [number, number][],
	piece: Piece,
	game: ChessGame
): Move[] {
	const { board } = game
	let moves: Move[] = []
	const [i, j] = coordinatesFromPosition(piece.position.id)
	const originSqr = board[i][j]
	directions.forEach((dir) => {
		const newI = i + dir[0]
		const newJ = j + dir[1]
		if (newI > 7 || newI < 0 || newJ > 7 || newJ < 0) {
			return moves
		}

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
				move.originPiece = piece
				move.isCapture = true
				move.capturedPiece = move.to.piece

				moves = [...moves, move]
			}
		} else {
			let move: Move = new Move()
			move.from = originSqr
			move.to = board[newI][newJ]
			move.originPiece = piece
			move.isCapture = false
			moves = [...moves, move]
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
		return [...moves]
	}

	// if (i === iCur && j === jCur) return

	const trgtSqr = board[newI][newJ]
	if (trgtSqr.piece) {
		if (piece.color === trgtSqr.piece.color) {
			// Same colored piece
			return null
		} else {
			// Opposite color piece (Capture)
			let move: Move = new Move()
			move.from = originSqr
			move.to = board[newI][newJ]
			move.originPiece = piece
			move.isCapture = true
			move.capturedPiece = move.to.piece

			return [...moves, move]
		}
	} else {
		let move: Move = new Move()
		move.from = originSqr
		move.to = board[newI][newJ]
		move.originPiece = piece
		move.isCapture = false
		moves = [...moves, move]

		return checkLine([newI, newJ], [iIncr, jIncr], board, piece, originSqr, [
			...moves,
		])
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

	const [iCur, jCur] = coordinatesFromPosition(piece.position.id)

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
		const isInitalRank = parseInt(piece.position.id.split('')[1]) === initialRank
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

	const [iCur, jCur] = coordinatesFromPosition(piece.position.id)
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
	return legalSingleMove(directions, piece, game)
}

function legalBishopMoves(piece: Piece, game: ChessGame): Move[] {
	const { board } = game

	const [iCur, jCur] = coordinatesFromPosition(piece.position.id)
	const originSqr = board[iCur][jCur]

	const directions = DIAGONALS

	let moves: Move[] = []
	directions.forEach((direction) => {
		const newMoves = checkLine(
			[iCur, jCur],
			direction,
			board,
			piece,
			originSqr,
			[]
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

	return legalSingleMove(directions, piece, game)
}
