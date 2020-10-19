import React, { Component } from "react";
import "./App.css";

import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";

import GlobalContext from "./Context/GlobalContext";

class App extends Component {
	state = {
		mode: "dark",
		headerItems: ["item1", "item2", "item3"],
	};

	componentDidMount = async () => {
		//get the theme from localstorage
		let theme = localStorage.getItem("theme");

		//if localstorage does not contain theme, give user the default dark mode
		if (!["light", "dark"].includes(theme)) {
			localStorage.setItem("theme", "dark");
			this.setState({ mode: "dark" });
		} else {
			this.setState({ mode: theme });
		}
	};

	//toggle the theme from dark to light and vice versa
	toggleThemeHandler = () => {
		let newTheme = this.state.mode === "light" ? "dark" : "light";

		localStorage.setItem("theme", newTheme);
		this.setState({
			mode: newTheme,
		});
	};

	render() {
		return (
			<div className={`root ${this.state.mode}`}>
				<GlobalContext.Provider
					value={{
						theme: this.state.mode,
						inRoute: false,
						date: Date.now(),
						setRouteAndDate: () => null,
					}}
				>
					<Header
						items={this.state.headerItems}
						toggleTheme={this.toggleThemeHandler}
						mode={this.state.mode}
					/>
					<Content />
				</GlobalContext.Provider>
				<Footer />
			</div>
		);
	}
}

export default App;
