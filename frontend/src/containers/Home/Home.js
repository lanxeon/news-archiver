import React, { Component } from "react";
import classes from "./Home.module.css";

//components imports
import Introduction from "./Introduction/Introduction";
import Carousel from "./Carousel/Carousel";
import Datepicker from "../../components/Datepicker/Datepicker";

//context
import globalContext from "../../Context/GlobalContext";

export default class Home extends Component {
	static contextType = globalContext;

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
