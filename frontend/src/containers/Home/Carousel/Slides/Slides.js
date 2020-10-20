import React from "react";
import classes from "./Slides.module.css";

import { Slide, Image } from "pure-react-carousel";

const Slides = (props) => {
	return (
		<>
			{props.headlines.map((headline, index) => (
				<Slide index={index} key={headline.headline}>
					<Image
						src={props.theme === "light" ? headline.screenshotLight : headline.screenshotDark}
						alt={headline.headline}
						className={classes.carouselImg}
					/>
				</Slide>
			))}
		</>
	);
};

export default Slides;
