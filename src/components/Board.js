import '../style/Board.css'
import { FEN_STARTING_POSITION, FILES, RANKS } from '../constants'
import Piece from './Piece'
import { useState } from 'react'
import { Board } from '../game/board'
import { getBoardFromFEN } from '../game/utils'

export default function BoardComponent({ children }) {
	const [board, setBoard] = useState(getBoardFromFEN(FEN_STARTING_POSITION))
	const grid = []

	// for (let i = 0; i < 8; i++) {
	// 	const rank = []
	// 	for (let j = 0; j < 8; j++) {
	// 		const sqr = {
	// 			color: (i + j) % 2 === 0 ? 'white' : 'black',
	// 			id: FILES[j] + RANKS[8 - (i + 1)],
	// 			piece: null,
	// 		}

	// 		rank.push(sqr)
	// 	}
	// 	grid.push(rank)
	// }
	console.log(board)
	return (
		<div className="board">
			{board.grid.map((rank, i) => (
				<div
					id={'rank' + RANKS[8 - (i + 1)]}
					key={RANKS[8 - (i + 1)]}
					className="rank"
				>
					{rank.map((sqr) => (
						<div key={sqr.id} id={sqr.id} className={`sqr ${sqr.color}`}>
							{sqr.piece && <Piece piece={sqr.piece} />}
						</div>
					))}
				</div>
			))}
		</div>
	)
}
