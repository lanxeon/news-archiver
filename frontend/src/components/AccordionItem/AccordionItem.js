import React from "react";
import classes from "./Accordionitem.module.css";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		backgroundColor: "var(--bg-content)",
		color: "var(--text-color)",
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},
}));

const AccordionItem = (props) => {
	const materialClasses = useStyles();
	const { item } = props;

	return (
		<div className={classes.Wrapper}>
			<Accordion className={classes.Accordion}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
					<Typography className={materialClasses.heading}>{item.headline}</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<div className={classes.imgContainer}>
						<img src={item.screenshotLight} alt="lol" />
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default AccordionItem;
