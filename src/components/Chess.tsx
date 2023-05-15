import * as React from "react";
import {useState} from 'react'
import BoardComponent from './Board'
import '../style/Chess.css'
import { getBoardFromFEN } from "../game/utils";
import { ChessGame } from "../game/game";
import { FEN_STARTING_POSITION } from "../constants";

export default function Chess() {
	const [game, setGame] = useState(new ChessGame(getBoardFromFEN(FEN_STARTING_POSITION)))
	if(!game || !game.board) {
		return <div>NO GAME</div>
	}


	
	return (
		<div className="Chess">
			<div className="boardContainer">
				<BoardComponent board={game.board}/>
			</div>
		</div>
	)
}
