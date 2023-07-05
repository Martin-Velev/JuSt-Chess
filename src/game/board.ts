
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
