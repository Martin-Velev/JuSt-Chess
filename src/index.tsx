import * as React from "react";
import * as ReactDOM from "react-dom";
import Chess from "./components/Chess";

const root = (
	<React.StrictMode>
		<Chess />
	</React.StrictMode>
)
ReactDOM.render(root, document.getElementById('root'))

