import React, { Component } from "react";
import "./App.css";

import Header from "./components/Header/Header";

class App extends Component {
	state = {
		mode: "light",
		headerItems: ["item1", "item2", "item3"],
	};

	render() {
		return (
			<div className={`root ${this.state.mode}`} dataTheme={this.state.mode}>
				<Header items={this.state.headerItems} />
				<main className="content"></main>
			</div>
		);
	}
}

export default App;
