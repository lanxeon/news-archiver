import React, { useState, useEffect } from "react";
import axios from "axios";

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
	const [headlines, setHeadlines] = useState([]);

	useEffect(() => {
		async function getHeadlines() {
			let thing = await axios.get("http://localhost:3001/carousel-headlines");
			setHeadlines(thing.data.payload);
		}
		getHeadlines();
	}, []);

	return (
		<div className={classes.Carousel}>
			<CarouselProvider
				naturalSlideWidth={100}
				naturalSlideHeight={100}
				totalSlides={headlines.length}
				isPlaying
			>
				<Slider>
					{headlines.map((headline, index) => (
						<Slide index={index} key={headline.headline}>
							<Image
								src={headline.screenshotLight}
								alt={headline.headline}
								className={classes.carouselImg}
							/>
						</Slide>
					))}
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
