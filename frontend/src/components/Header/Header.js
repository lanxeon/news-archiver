import React, { Component } from "react";

import classes from "./Header.module.css";

import NavButton from "../UI/NavButton/NavButton";

class Header extends Component {
	render() {
		return (
			<header className={classes.header}>
				<div className={classes.logo}>LOGO</div>
				<div className={classes.spacer}></div>
				<nav className={classes.nav}>
					{this.props.items.map((item) => (
						<NavButton>{item}</NavButton>
					))}
				</nav>
			</header>
		);
	}
}

export default Header;
