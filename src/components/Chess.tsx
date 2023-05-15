import * as React from 'react'
import { useState, useEffect } from 'react'
import BoardComponent from './Board'
import '../style/Chess.css'
import { getBoardFromFEN, positionFromCoordinates } from '../game/utils'
import { ChessGame } from '../game/game'
import { FEN_STARTING_POSITION, FILES, RANKS } from '../constants'
import { Piece, Square } from '../game/board'
import { generateLegalMoves } from '../game/move'

export default function Chess() {
	const [game, setGame] = useState(
		new ChessGame(getBoardFromFEN(FEN_STARTING_POSITION))
	)
	const [selectedPiece, setSelectedPiece] = useState(null)
	const [originSquare, setOriginSquare] = useState(null)

	if (!game || !game.board) {
		return <div>NO GAME</div>
	}

	function handleSqrClick(sqr: Square) {
		//TODO: check if move is valid
		// Is it the right color to move
		// Can the piece move that way
		// Is it revealing check
		// is it obstructed by a piece
		// is it trying to capture a piece of the same color

		const moves = generateLegalMoves(sqr.piece, game.board)
		console.log('moves:', moves)
		if (sqr.piece && selectedPiece === null) {
			setSelectedPiece(sqr.piece)
			setOriginSquare(sqr)
		} else if (selectedPiece && originSquare) {
			sqr.piece = selectedPiece
			originSquare.piece = null
			selectedPiece.position = sqr.id
			setSelectedPiece(null)
			setOriginSquare(null)
		}
	}

	return (
		<div id="Chess">
			<div className="col">
				<div className="fileNotation">
					{FILES.map((file) => (
						<div key={file}> {file} </div>
					))}
				</div>
				<div className="row">
					<div className="rankNotation">
						{RANKS.map((rank) => (
							<div key={rank}> {rank} </div>
						))}
					</div>
					<div className="boardContainer">
						<BoardComponent onSqrClick={handleSqrClick} board={game.board} />
					</div>
				</div>
			</div>
		</div>
	)
}
