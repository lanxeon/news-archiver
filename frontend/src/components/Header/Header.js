import React from "react";
import classes from "./Header.module.css";

import ThemeToggler from "./ThemeToggler/ThemeToggler";
import Logo from "./Logo/Logo";

import Datepicker from "../Datepicker/Datepicker";
import { NavLink } from "react-router-dom";

const Header = (props) => {
	return (
		<header className={classes.header}>
			<NavLink to="/">
				<Logo />
			</NavLink>
			<div className={classes.spacer}></div>
			<Datepicker variant="dialog" className="DatePickerWrapperStatic" />
			<div className={classes.spacer}></div>
			<ThemeToggler {...props} />
		</header>
	);
};

export default Header;
