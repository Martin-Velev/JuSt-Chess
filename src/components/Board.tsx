
import * as React from "react";
import '../style/Board.css'
import { RANKS } from '../constants'
import PieceComponent from "./Piece";
import { Board, Square } from "../game/board";

type BoardComponentProps = {
	board: Board

}
export default function BoardComponent({board}: BoardComponentProps) {
	// const [board, setBoard] = useState()

	console.log(board)
	return (
		<div className="board">
			{board.grid.map((rank: Square[], i:number) => (
				<div
					id={'rank' + RANKS[8 - (i + 1)]}
					key={RANKS[8 - (i + 1)]}
					className="rank"
				>
					{rank.map((sqr) => (
						<div key={sqr.id} id={sqr.id} className={`sqr ${sqr.color}`}>
							{sqr.piece && <PieceComponent piece={sqr.piece} />}
						</div>
					))}
				</div>
			))}
		</div>
	)
}
