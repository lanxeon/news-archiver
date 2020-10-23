import React from "react";

// import classes from "./ThemeToggler.module.css";

import { IconButton, Tooltip } from "@material-ui/core";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4RoundedIcon from "@material-ui/icons/Brightness4Rounded";

const ThemeToggler = (props) => {
	return (
		<Tooltip title="Toggle light/dark theme">
			<IconButton aria-label="Toggle light/dark theme" onClick={props.toggleTheme}>
				{props.mode === "light" ? (
					<Brightness4RoundedIcon style={{ fill: "#eee" }} />
				) : (
					<Brightness7Icon style={{ fill: "#eee" }} />
				)}
			</IconButton>
		</Tooltip>
	);
};

export default ThemeToggler;
