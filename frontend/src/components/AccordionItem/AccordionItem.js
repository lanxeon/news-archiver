import React from "react";
import classes from "./Accordionitem.module.css";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// import { makeStyles } from "@material-ui/core/styles";
// const useStyles = makeStyles((theme) => ({
// 	root: {
// 		width: "100%",
// 		backgroundColor: "var(--bg-content)",
// 		color: "var(--text-color)",
// 	},
// 	heading: {
// 		fontSize: theme.typography.pxToRem(15),
// 		fontWeight: theme.typography.fontWeightRegular,
// 	},
// 	svg: {
// 		fill: "var(--text-color)",
// 		color: "var(--text-color)",
// 	},
// }));

const AccordionItem = (props) => {
	// const materialClasses = useStyles();
	const { item } = props;

	return (
		<div className={classes.Wrapper}>
			<Accordion className={classes.Accordion} TransitionProps={{ unmountOnExit: true }}>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon style={{ color: "var(--text-color)" }} />}
					aria-controls="headline/article content"
				>
					<h4 className={classes.heading}>{item.headline}</h4>
				</AccordionSummary>
				<AccordionDetails className={classes.AccordionContent}>
					{item.type === "article" ? (
						<p className={classes.authors}>
							- By <span>{item.authors.join(", ")}</span>
						</p>
					) : null}

					<div className={classes.imgContainer}>
						<img src={item.screenshotLight} alt="lol" />
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default AccordionItem;
