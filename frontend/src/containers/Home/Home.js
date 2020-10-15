import React, { Component } from "react";
import classes from "./Home.module.css";

import Introduction from "./Introduction/Introduction";

export default class Home extends Component {
	constructor(props) {
		super(props);
		console.log(props);
	}

	render() {
		return (
			<div className={classes.homeWrapper}>
				<Introduction />
			</div>
		);
	}
}
