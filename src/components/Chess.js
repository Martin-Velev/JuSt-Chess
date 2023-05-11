import BoardComponent from './Board'
import '../style/Chess.css'
import Piece from './Piece'

function Chess() {
	return (
		<div className="Chess">
			<div className="boardContainer">
				<BoardComponent>
					<Piece piece={{ type: 'pawn', color: 'black' }} />
				</BoardComponent>
			</div>
		</div>
	)
}

export default Chess
