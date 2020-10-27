import React from "react";
import classes from "./TimelineItems.module.css";

import {
	TimelineItem,
	TimelineSeparator,
	TimelineConnector,
	TimelineContent,
	TimelineDot,
	TimelineOppositeContent,
} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";

function TimelineItems(props) {
	return (
		<>
			{typeof props.items !== "undefined" &&
				props.items.map((item) => (
					<TimelineItem key={item._id} className={classes.TimelineItem}>
						<TimelineOppositeContent>
							<Typography variant="body2" color="inherit">
								{new Date(item.timestamp).toLocaleTimeString()}
							</Typography>
						</TimelineOppositeContent>
						<TimelineSeparator>
							<TimelineDot
								variant={item.type === "article" ? "outlined" : "default"}
								color={item.source === "fox" ? "primary" : "secondary"}
							/>
							<TimelineConnector />
						</TimelineSeparator>
						<TimelineContent>{item.headline}</TimelineContent>
					</TimelineItem>
				))}
		</>
	);
}

export default TimelineItems;
