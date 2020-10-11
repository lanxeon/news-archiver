import React, { Component } from "react";
import "./App.css";

import Header from "./components/Header/Header";

class App extends Component {
	state = {
		mode: "dark",
		headerItems: ["item1", "item2", "item3"],
	};

	render() {
		return (
			<div className="root" dataTheme={this.state.mode}>
				<Header items={this.state.headerItems} />
			</div>
		);
	}
}

export default App;
