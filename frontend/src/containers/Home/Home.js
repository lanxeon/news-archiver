import React, { Component } from "react";
import classes from "./Home.module.css";

import Introduction from "./Introduction/Introduction";
import Carousel from "./Carousel/Carousel";
import Datepicker from "../../components/Datepicker/Datepicker";

export default class Home extends Component {
	constructor(props) {
		super(props);
		console.log(props);
	}

	render() {
		return (
			<div className={classes.homeWrapper}>
				<Introduction />
				<Carousel />
				<Datepicker variant="static" className="DatePickerWrapperStatic" />
			</div>
		);
	}
}
