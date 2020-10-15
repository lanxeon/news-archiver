import React from "react";

import classes from "./Introduction.module.css";

const Introduction = (props) => {
	return (
		<section className={classes.info}>
			<h1 id="info">News Archiver</h1>
			<p>
				There is an obvious schism as to how news is reported in the US. You could open Fox news on
				one tab and CNN on another and notice instantly the difference in the ways that they report
				the news. If you ever want to go back in time and compare headlines and highlighted articles,
				look no more! Just pick a date to compare headlines...
			</p>
		</section>
	);
};

export default Introduction;
