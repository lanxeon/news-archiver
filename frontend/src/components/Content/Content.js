import React from "react";
import { Switch, Route } from "react-router-dom";
import classes from "./Content.module.css";

import Home from "../../containers/Home/Home";
import DateContent from "../../containers/DateContent/DateContent";

export default function Content() {
	return (
		<main className={classes.content}>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/:date" exact component={DateContent} />
			</Switch>
		</main>
	);
}
