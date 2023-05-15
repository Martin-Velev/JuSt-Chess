export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8]
export const FILES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
export const FEN_STARTING_POSITION =
	'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
export enum PIECE_MAP {
	P = 'wp',
	p = 'bp',
	R = 'wr',
	r = 'br',
	N = 'wn',
	n = 'bn',
	B = 'wb',
	b = 'bb',
	Q = 'wq',
	q = 'bq',
	K = 'wk',
	k = 'bk',
}

export enum PIECE_ABR {
	p = 'Pawn',
	r = 'Rook',
	b = 'Bishop',
	n = 'Knight',
	q = 'Queen',
	k = 'King',
}
