import React from "react";

import classes from "./Footer.module.css";

export const Footer = () => {
	return (
		<div className={classes.footerWrapper}>
			<footer>
				<p>
					Made with ❤️ by{" "}
					<a href="https://github.com/lanxeon" target="_blank">
						lanxion
					</a>
				</p>
			</footer>
		</div>
	);
};

export default Footer;
