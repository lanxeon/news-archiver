import React from "react";
import classes from "./SliderButtons.module.css";

import { ButtonBack, ButtonNext } from "pure-react-carousel";

//left and right arrow icons for carousel
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLefttIcon from "@material-ui/icons/ChevronLeft";

const SliderButtons = () => {
	return (
		<>
			<ButtonBack className={classes.btn}>
				<ChevronLefttIcon />
			</ButtonBack>
			<ButtonNext className={[classes.btn, classes.right].join(" ")}>
				<ChevronRightIcon />
			</ButtonNext>
		</>
	);
};

export default SliderButtons;
