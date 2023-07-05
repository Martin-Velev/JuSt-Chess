export const DIAGONALS: [number, number][] = [
	[-1, -1],
	[-1, +1],
	[+1, -1],
	[+1, +1],
]
export const RANK_FILE: [number, number][] = [
	[-1, 0], // UP
	[+1, 0], // DOWN
	[0, -1], // LEFT
	[0, +1], // RIGHT
]
export const KNIGHT_MOVES: [number, number][] = [
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
	position: Square
	color: string
}
