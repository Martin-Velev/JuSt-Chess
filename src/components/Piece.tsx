import * as React from 'react'
import '../style/Piece.css'
import { Piece } from '../game/board'

type PieceProps = {
	piece: Piece
}

export default function PieceComponent({ piece }: PieceProps) {
	return <div className={`piece ${piece.symbol}`}></div>
}
