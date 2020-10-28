import React from "react";
import classes from "./TimelineItems.module.css";

import { TimelineItem, TimelineContent, TimelineOppositeContent } from "@material-ui/lab";

import TimelineTime from "./TimelineTime/TimelineTime";
import TimelinePoint from "./TimelinePoint/TimelinePoint";
import AccordionItem from "../../../components/AccordionItem/AccordionItem";

function TimelineItems(props) {
	return (
		<>
			{typeof props.items !== "undefined" &&
				props.items.map((item) => (
					<TimelineItem key={item._id} className={classes.TimelineItem}>
						<TimelineOppositeContent className={classes.TimelineOppositeContent}>
							<TimelineTime timestamp={item.timestamp} />
						</TimelineOppositeContent>

						<TimelinePoint source={item.source} type={item.type} />

						<TimelineContent>
							<AccordionItem item={item} />
							{/* {item.headline} */}
						</TimelineContent>
					</TimelineItem>
				))}
		</>
	);
}

export default TimelineItems;
