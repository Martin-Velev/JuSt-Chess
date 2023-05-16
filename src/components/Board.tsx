import * as React from 'react'
import '../style/Board.css'
import { RANKS } from '../constants'
import PieceComponent from './Piece'
import { Board, Square } from '../game/board'

type BoardComponentProps = {
	board: Board
	onSqrClick: Function
}
export default function BoardComponent({
	board,
	onSqrClick: onPieceClick,
}: BoardComponentProps) {
	// const [board, setBoard] = useState()

	return (
		<div className="board">
			{board.grid.map((rank: Square[], i: number) => (
				<div
					id={'rank' + RANKS[8 - (i + 1)]}
					key={RANKS[8 - (i + 1)]}
					className="rank"
				>
					{rank.map((sqr) => {
						let classList = ''
						if (sqr.styles && sqr.styles.length > 0) {
							classList = ` ${sqr.styles.join(' ')}`
						}
						return (
							<div
								onClick={(e) => onPieceClick(sqr)}
								key={sqr.id}
								id={sqr.id}
								className={`sqr ${sqr.color}` + classList}
							>
								{sqr.piece && <PieceComponent piece={sqr.piece} />}
							</div>
						)
					})}
				</div>
			))}
		</div>
	)
}
