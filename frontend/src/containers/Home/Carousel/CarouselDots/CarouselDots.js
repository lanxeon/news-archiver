import React from "react";

import { DotGroup } from "pure-react-carousel";

import classes from "./CarouselDots.module.css";

const CarouselDots = () => {
	return <DotGroup className={classes.dots} />;
};

export default CarouselDots;
