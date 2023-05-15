import { FILES, PIECE_ABR, PIECE_MAP, RANKS } from '../constants'
import { Board, Square } from './board'

/**
 *
 * @param {string} fen The Forsyth–Edwards Notation for the position
 * @returns {Board} Board object
 */
export function getBoardFromFEN(fen: string) {
	console.log(fen)

	const fields = fen.split(' ')
	console.log('fields', fields)
	// SETUP PIECES

	const INITIAL_POSITION = fields[0]
	const ranks = INITIAL_POSITION.split('/')
	let grid = initBoardGrid()

	for (let i = 0; i < ranks.length; i++) {
		const piecesInRank = ranks[i].split('')

		for (let j = 0; j < 8; j++) {
			const emptySquares = parseInt(piecesInRank[j])
			if (emptySquares) {
				j += emptySquares - 1
				continue
			} else {
				const symbol = PIECE_MAP[piecesInRank[j] as keyof typeof PIECE_MAP]
				let [color, type] = symbol.split('')
				color = color === 'w' ? 'white' : 'black'
				type = PIECE_ABR[type as keyof typeof PIECE_ABR]
				const position = positionFromCoordinates([i, j])

				const piece = {
					color,
					type,
					symbol,
					position
				}

				grid[i][j].piece = piece
			}
		}
	}

	return new Board(grid)
}

/**
 * @returns default empty board grid
 */
export function initBoardGrid() {
	const grid = []
	for (let i = 0; i < 8; i++) {
		const rank = []
		for (let j = 0; j < 8; j++) {
			const color = (i + j) % 2 === 0 ? 'white' : 'black'
			const square = new Square()
			square.id = FILES[j] + RANKS[8 - (i + 1)]
			square.color = color

			rank.push(square)
		}
		grid.push(rank)
	}

	return grid
}

export function positionFromCoordinates([i, j]: [number, number]): string {
	const rank = RANKS[8 - (i + 1)]
	const file = FILES[j]

	return `${file}${rank}`
}

export function coordinatesFromPosition(position: string): [number, number] {
	const [file, rank] = position.split('')
	console.log(position, rank)
	const i = 8 - RANKS.indexOf(parseInt(rank)) - 1
	const j = FILES.indexOf(file)
	return [i, j]
}
