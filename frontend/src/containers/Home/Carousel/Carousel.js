import React from "react";

import {
	CarouselProvider,
	Slider,
	Slide,
	ButtonBack,
	ButtonNext,
	Image,
	DotGroup,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import classes from "./Carousel.module.css";

const Carousel = (props) => {
	return (
		<div className={classes.Carousel}>
			<CarouselProvider naturalSlideWidth={100} naturalSlideHeight={100} totalSlides={1} isPlaying>
				<Slider>
					<Slide index={0}>
						<Image
							src="https://archivedscreenshots.s3.ap-south-1.amazonaws.com/trump-continues-bizarre-appeals-to-suburban-women-1603004424531-dark.jpg"
							alt="lol"
							className={classes.carouselImg}
						/>
					</Slide>
				</Slider>
				<DotGroup className={classes.dots} />
				<div className={classes.ButtonsWrapper}>
					<ButtonBack className={classes.btn}>←</ButtonBack>
					<ButtonNext className={classes.btn}>→</ButtonNext>
				</div>
			</CarouselProvider>
		</div>
	);
};

export default Carousel;
