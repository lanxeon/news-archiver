import React from "react";

import { Carousel as LibraryCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import classes from "./Carousel.module.css";

const Carousel = (props) => {
	return (
		<div className={classes.Carousel}>
			<LibraryCarousel>
				<div style={{ overflow: "hidden" }}>
					<img
						src="https://archivedscreenshots.s3.ap-south-1.amazonaws.com/trump-continues-bizarre-appeals-to-suburban-women-1603004424531-dark.jpg"
						alt=""
					/>
				</div>
			</LibraryCarousel>
		</div>
	);
};

export default Carousel;
