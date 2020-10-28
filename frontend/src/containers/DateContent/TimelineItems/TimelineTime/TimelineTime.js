import React from "react";

import Typography from "@material-ui/core/Typography";

const TimelineTime = (props) => {
	//extract time in hh:mm format from timestamp
	const time = new Date(props.timestamp).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<Typography variant="body2" color="inherit">
			{time}
		</Typography>
	);
};

export default TimelineTime;
