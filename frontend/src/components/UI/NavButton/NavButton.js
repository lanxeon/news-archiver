import React from "react";

import classes from "./NavButton.module.css";

export default function NavButton(props) {
	return <button className={classes.button}>{props.children}</button>;
}
