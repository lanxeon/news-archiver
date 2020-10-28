import React from "react";
import classes from "./ButtonSet.module.css";

import Button from "@material-ui/core/Button";

const GoButton = (props) => {
	return (
		<div className={classes.ButtonContainer}>
			<Button color="primary">CANCEL</Button>
			<Button color="primary" onClick={props.confirmDate}>
				OK
			</Button>
		</div>
	);
};

export default GoButton;
