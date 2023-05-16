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
import { generateLegalMoves } from '../game/move'

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
		// console.log('moves', game.legalMoves)
		// console.log('selectedPiece', selectedPiece)
		// console.log('origin', originSquare)
		// console.log('sqr', sqr)
		setGame({
			...game,
			legalMoves: [],
		})
		if (game.legalMoves && selectedPiece) {
			// Piece selected. Attempting move
			const possibleMoveSqrs = game.legalMoves.map((move) => move.to.id)

			if (possibleMoveSqrs.includes(sqr.id)) {
				// MOVE PIECE

				const [i, j] = coordinatesFromPosition(sqr.id)
				const [iOrigin, jOrigin] = coordinatesFromPosition(originSquare.id)
				const newGrid: Square[][] = { ...game.board.grid }

				newGrid[i][j].piece = { ...selectedPiece, position: sqr.id }
				newGrid[iOrigin][jOrigin].piece = null
				const newBoard = { ...game.board, grid: newGrid }

				setGame({
					...game,
					board: newBoard,
					legalMoves: [],
				})
			}

			setSelectedPiece(null)
			setOriginSquare(null)
			cleanBoardStyles()
		}

		if (!selectedPiece && sqr.piece) {
			// Selecting piece
			setSelectedPiece(sqr.piece)
			setOriginSquare(sqr)

			const moves = generateLegalMoves(sqr.piece, game.board)
			if (moves) {
				setGame({
					...game,
					legalMoves: moves,
				})
				const possibleMoveSqrs = moves.map((move) => move.to.id)

				possibleMoveSqrs.forEach((sqrId) => {
					const [i, j] = coordinatesFromPosition(sqrId)

					const curSqrl = game.board.grid[i][j]
					if (curSqrl.piece) {
						curSqrl.styles.push('legal-capture')
					} else {
						curSqrl.styles.push('legal-move')
					}
				})
			}
		}
	}

	function cleanBoardStyles() {
		const cleanBoard = {
			grid: game.board.grid.map((rank) => {
				return rank.map((sqr) => {
					return {
						...sqr,
						styles: [],
					}
				})
			}),
		}

		const clGame: ChessGame = {
			...game,
			board: cleanBoard,
		}

		setGame(clGame)
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
