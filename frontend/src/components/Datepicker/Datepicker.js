import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./Datepicker.module.css";

//datepicker, themes and HOC for date provider
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { DatePicker } from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import { cyan, pink, lightBlue } from "@material-ui/core/colors";

//moment js library
import moment from "moment";

//context
import GlobalContext from "../../Context/GlobalContext";

import Buttons from "./ButtonSet/ButtonSet";

//custom theme for datepicker. Overridden in component using
const overrides = {
	MuiPickersToolbar: {
		toolbar: {
			backgroundColor: cyan["600"],
		},
	},
	MuiPickersCalendarHeader: {
		switchHeader: {
			// backgroundColor: cyan["600"],
			color: "#08090a",
		},
	},
	MuiPickersDay: {
		day: {
			color: pink.A200,
		},
		daySelected: {
			backgroundColor: pink["400"],
		},
		dayDisabled: {
			color: "#ccc",
		},
		current: {
			color: lightBlue["900"],
		},
	},
	MuiPickersModal: {
		dialogAction: {
			color: lightBlue["400"],
		},
	},
};

const Datepicker = (props) => {
	const [date, setDate] = useState(new Date());
	const [materialTheme, setMaterialTheme] = useState(createMuiTheme({ overrides }));

	const globalContext = useContext(GlobalContext);
	let history = useHistory();

	useEffect(() => {
		const { theme, date } = globalContext;

		overrides["MuiPickersToolbar"]["toolbar"]["backgroundColor"] =
			theme === "dark" ? "#393e46" : cyan["600"];

		setDate(date);
		setMaterialTheme(createMuiTheme({ overrides }));
	}, [globalContext]);

	const redirectToDate = (d = new Date()) => {
		let dateToSet;
		if (props.variant === "static") {
			dateToSet = date;
		} else {
			dateToSet = d;
		}

		globalContext.setRouteAndDate(dateToSet);

		let routeDate = moment(dateToSet).format("DD-MM-YYYY");
		history.push(`${routeDate}`);
	};

	const staticPickerDateChangeHandler = (d) => {
		setDate(d);
	};

	return (
		<MuiPickersUtilsProvider utils={MomentUtils}>
			{props.variant === "static" ? <h3>Pick a date to get started</h3> : null}

			<div className={classes[props.className]}>
				<ThemeProvider theme={materialTheme}>
					<DatePicker
						minDate={new Date(2020, 9, 1)}
						orientation="portrait"
						variant={props.variant}
						openTo="date"
						value={date}
						onChange={props.variant !== "static" ? redirectToDate : staticPickerDateChangeHandler}
						disableFuture
					/>
				</ThemeProvider>
				{props.variant === "static" ? <Buttons confirmDate={redirectToDate} /> : null}
			</div>
		</MuiPickersUtilsProvider>
	);
};

export default Datepicker;
