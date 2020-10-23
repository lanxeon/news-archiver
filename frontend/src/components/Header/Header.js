import React from "react";
import classes from "./Header.module.css";

import Datepicker from "../Datepicker/Datepicker";
import ThemeToggler from "./ThemeToggler/ThemeToggler";
import Logo from "./Logo/Logo";
import Spacer from "../UI/Spacer/Spacer";

import { NavLink } from "react-router-dom";

const Header = (props) => {
	return (
		<header className={classes.header}>
			<NavLink to="/">
				<Logo />
			</NavLink>
			<Spacer />
			<Datepicker variant="dialog" />
			<Spacer />
			<ThemeToggler {...props} />
		</header>
	);
};

export default Header;
