import '../style/Piece.css'

export default function Piece({piece}) {
	return (
		// <div className="pieceContainer">
			<div className={`piece ${piece.pieceSymbol}`}></div>
		// </div>
	)
}
