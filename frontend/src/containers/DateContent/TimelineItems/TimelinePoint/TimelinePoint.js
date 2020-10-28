import React from "react";

import { TimelineSeparator, TimelineConnector, TimelineDot } from "@material-ui/lab";

const TimelinePoint = (props) => {
	const variant = props.type === "article" ? "outlined" : "default";
	const color = props.source === "fox" ? "primary" : "secondary";

	return (
		<>
			<TimelineSeparator>
				<TimelineDot variant={variant} color={color} />
				<TimelineConnector />
			</TimelineSeparator>
		</>
	);
};

export default TimelinePoint;
