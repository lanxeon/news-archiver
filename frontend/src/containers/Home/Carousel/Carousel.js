import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

//Carousel library items, and its CSS
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

// *******IMPORTANT********
//import our own custom CSS file AFTER importing the carousel library's css
import classes from "./Carousel.module.css";

//left and right arrow icons for carousel
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLefttIcon from "@material-ui/icons/ChevronLeft";

//loader component
import Loader from "../../../components/UI/Loader/Loader";

//context, used for dark/light theme picture toggling in this case
import GlobalContext from "../../../Context/GlobalContext";

const Carousel = () => {
	const [headlines, setHeadlines] = useState([]);
	const { theme } = useContext(GlobalContext);

	useEffect(() => {
		async function getHeadlines() {
			let thing = await axios.get("http://localhost:3001/carousel-headlines");
			setHeadlines(thing.data.payload);
		}
		getHeadlines();
	}, []);

	return (
		<div className={classes.Carousel}>
			{headlines.length === 0 ? (
				<Loader />
			) : (
				<>
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
										src={
											theme === "light"
												? headline.screenshotLight
												: headline.screenshotDark
										}
										alt={headline.headline}
										className={classes.carouselImg}
									/>
								</Slide>
							))}
						</Slider>
						<DotGroup className={classes.dots} />
						{/* <div className={classes.ButtonsWrapper}> */}
						<ButtonBack className={classes.btn}>
							<ChevronLefttIcon />
						</ButtonBack>
						<ButtonNext className={[classes.btn, classes.right].join(" ")}>
							<ChevronRightIcon />
						</ButtonNext>
						{/* </div> */}
					</CarouselProvider>
				</>
			)}
		</div>
	);
};

export default Carousel;
