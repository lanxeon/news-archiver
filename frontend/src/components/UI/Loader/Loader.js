import React from "react";

import classes from "./Loader.module.css";

const Loader = () => {
	return (
		<div className={classes.LoaderWrapper}>
			<div className={classes.LdsRing}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default Loader;
