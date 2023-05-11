import { FILES, PIECE_ABR, PIECE_MAP, RANKS } from '../constants'
import { Board } from './board'

/**
 *
 * @param {string} fen The Forsyth–Edwards Notation for the position
 * @returns {Board} Board object
 */
export function getBoardFromFEN(fen) {
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
				const pieceSymbol = PIECE_MAP[piecesInRank[j]]
				let [color, type] = pieceSymbol.split('')
				color = color === 'w' ? 'white' : 'black'
				type = PIECE_ABR[type]

				const piece = {
					color,
					type,
					pieceSymbol
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
			const square = {}
			square.id = FILES[j] + RANKS[8 - (i + 1)]
			square.color = color

			rank.push(square)
		}
		grid.push(rank)
	}

	return grid
}
