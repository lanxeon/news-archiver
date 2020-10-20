import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

//Carousel library items, and its CSS
import { CarouselProvider, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

// *******IMPORTANT********
//import our own custom CSS file AFTER importing the carousel library's css
import classes from "./Carousel.module.css";

//import the various carousel components such as slider, carousel and buttons
import SliderButtons from "./SliderButtons/SliderButtons";
import CarouselDots from "./CarouselDots/CarouselDots";
import Slides from "./Slides/Slides";
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
			<h2>Latest archived headlines</h2>

			{headlines.length === 0 ? (
				<Loader />
			) : (
				<CarouselProvider
					naturalSlideWidth={100}
					naturalSlideHeight={100}
					totalSlides={headlines.length}
					isPlaying
				>
					<Slider>
						<Slides headlines={headlines} theme={theme} />
					</Slider>
					<CarouselDots />
					<SliderButtons />
				</CarouselProvider>
			)}
		</div>
	);
};

export default Carousel;
