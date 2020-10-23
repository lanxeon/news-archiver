import React from "react";
import { Switch, Route } from "react-router-dom";
import classes from "./Content.module.css";

import Home from "../../containers/Home/Home";

export default function Content() {
	return (
		<main className={classes.content}>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/:date" exact render={() => <h1>Hello</h1>} />
			</Switch>
		</main>
	);
}
