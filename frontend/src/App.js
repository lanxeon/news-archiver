import React, { Component } from "react";
import "./App.css";

import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";

class App extends Component {
	state = {
		mode: "dark",
		headerItems: ["item1", "item2", "item3"],
	};

	//toggle the theme from dark to light and vice versa
	toggleThemeHandler = () => {
		let currentTheme = this.state.mode;
		this.setState({
			mode: currentTheme === "light" ? "dark" : "light",
		});
	};

	render() {
		return (
			<div className={`root ${this.state.mode}`}>
				<Header
					items={this.state.headerItems}
					toggleTheme={this.toggleThemeHandler}
					mode={this.state.mode}
				/>
				<Content />
				<Footer />
			</div>
		);
	}
}

export default App;
