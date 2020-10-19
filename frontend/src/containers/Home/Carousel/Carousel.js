import React, { useState, useEffect } from "react";
import classes from "./Carousel.module.css";
import axios from "axios";

//Carousel library items
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

//left and right arrow icons for carousel
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLefttIcon from "@material-ui/icons/ChevronLeft";

// //backdrop and loader component
// import Backdrop from "@material-ui/core/Backdrop";
// import CircularProgress from "@material-ui/core/CircularProgress";

const Carousel = () => {
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
			{}
			<h2>Latest archived headlines</h2>
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
					<ButtonBack className={classes.btn}>
						<ChevronLefttIcon />
					</ButtonBack>
					<ButtonNext className={classes.btn}>
						<ChevronRightIcon />
					</ButtonNext>
				</div>
			</CarouselProvider>
		</div>
	);
};

export default Carousel;
