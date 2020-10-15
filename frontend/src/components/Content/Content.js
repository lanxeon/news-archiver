import React from "react";
import { Switch, Route } from "react-router-dom";
import classes from "./Content.module.css";

import Home from "../../containers/Home/Home";

export default function Content() {
	return (
		<main className={classes.content}>
			<Switch>
				<Route path="/" component={Home} />
			</Switch>
		</main>
	);
}
