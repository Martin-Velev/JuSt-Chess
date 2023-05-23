import * as React from 'react'
import { useState, useEffect } from 'react'
import BoardComponent from './Board'
import '../style/Chess.css'
import {
	coordinatesFromPosition,
	getBoardFromFEN,
	positionFromCoordinates,
} from '../game/utils'
import { ChessGame } from '../game/game'
import { FEN_STARTING_POSITION, FILES, RANKS } from '../constants'
import { Piece, Square } from '../game/board'
import { Move, generateLegalMoves, isThreatened } from '../game/move'

export default function Chess() {
	const [game, setGame] = useState(
		new ChessGame(getBoardFromFEN(FEN_STARTING_POSITION))
	)
	const [selectedPiece, setSelectedPiece]: [Piece, Function] = useState(null)
	const [originSquare, setOriginSquare]: [Square, Function] = useState(null)

	if (!game || !game.board) {
		return <div>NO GAME</div>
	}

	function handleSqrClick(sqr: Square) {
		if (game.legalMoves && selectedPiece) {
			// Piece selected. Attempting move
			const possibleMoveSqrs = game.legalMoves.map((move) => move.to.id)

			console.log('is threatened', isThreatened(selectedPiece, game.board))

			if (possibleMoveSqrs.includes(sqr.id)) {
				if (selectedPiece.color !== game.toMove) return
				// MOVE PIECE

				const move: Move = {
					from: originSquare,
					to: sqr,
					piece: selectedPiece,
				}
				game.makeMove(move)

				// console.log('threat', isThreatened(selectedPiece, game.board))
			}

			setSelectedPiece(null)
			setOriginSquare(null)
			cleanBoardStyles()
		}

		if (!selectedPiece && sqr.piece) {
			if (sqr.piece.color !== game.toMove) return
			// Selecting piece
			setSelectedPiece(sqr.piece)
			setOriginSquare(sqr)

			const moves = generateLegalMoves(sqr.piece, game)
			if (moves) {
				game.legalMoves = moves
				const possibleMoveSqrs = moves.map((move) => move.to.id)

				possibleMoveSqrs.forEach((sqrId) => {
					const [i, j] = coordinatesFromPosition(sqrId)

					const curSqrl = game.board[i][j]
					if (curSqrl.piece) {
						curSqrl.styles.push('legal-capture')
					} else {
						curSqrl.styles.push('legal-move')
					}
				})
			}
		} else {
			game.legalMoves = []
		}
	}

	function cleanBoardStyles() {
		// console.log(game)
		const cleanBoard = game.board.map((rank: Square[]) => {
			return rank.map((sqr) => {
				return {
					...sqr,
					styles: [],
				}
			})
		})

		game.board = cleanBoard
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
