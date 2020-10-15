import React, { Component } from "react";

import classes from "./Header.module.css";

// import NavButton from "../UI/NavButton/NavButton";
import { IconButton, Tooltip } from "@material-ui/core";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4RoundedIcon from "@material-ui/icons/Brightness4Rounded";
// import { ReactComponent as ThemeToggleIcon } from "../../assets/icons/theme-toggle.svg";

//theme toggler button
const ThemeToggler = (props) => {
	return (
		<Tooltip title="Toggle light/dark theme">
			<IconButton aria-label="Toggle light/dark theme" onClick={props.toggleTheme}>
				{props.mode === "light" ? (
					<Brightness4RoundedIcon style={{ fill: "#fff" }} />
				) : (
					<Brightness7Icon style={{ fill: "#fff" }} />
				)}
			</IconButton>
		</Tooltip>
	);
};

class Header extends Component {
	render() {
		return (
			<header className={classes.header}>
				<div className={classes.logo}>
					<h3>News Archiver</h3>
				</div>
				<div className={classes.spacer}></div>
				<div className={classes.spacer}></div>
				<ThemeToggler {...this.props} />
				{/* <nav className={classes.nav}>
					{this.props.items.map((item) => (
						<NavButton>{item}</NavButton>
					))}
				</nav> */}
			</header>
		);
	}
}

export default Header;
