import React, { useState, useEffect, useContext } from "react";
import classes from "./Datepicker.module.css";

//datepicker, themes and HOC for date provider
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { DatePicker } from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import { cyan, pink, lightBlue } from "@material-ui/core/colors";

import GlobalContext from "../../Context/GlobalContext";
import { useHistory } from "react-router-dom";

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
	const [date, changeDate] = useState(new Date());
	const [materialTheme, setMaterialTheme] = useState(createMuiTheme({ overrides }));

	const globalContext = useContext(GlobalContext);
	let history = useHistory();

	useEffect(() => {
		overrides["MuiPickersToolbar"]["toolbar"]["backgroundColor"] =
			globalContext.theme === "dark" ? "#393e46" : cyan["600"];
		setMaterialTheme(createMuiTheme({ overrides }));
	}, [globalContext]);

	const redirectToDate = (date) => {
		console.log(date.toString());
		changeDate(date);
		history.push(`${date}`);
	};

	return (
		<MuiPickersUtilsProvider utils={MomentUtils}>
			{props.variant === "static" ? <h3>Pick a date to get started</h3> : null}

			<div className={classes[props.className]}>
				<ThemeProvider theme={materialTheme}>
					<DatePicker
						autoOk
						orientation="portrait"
						variant={props.variant}
						openTo="date"
						value={date}
						onChange={redirectToDate}
						disableFuture
					/>
				</ThemeProvider>
			</div>
		</MuiPickersUtilsProvider>
	);
};

export default Datepicker;
