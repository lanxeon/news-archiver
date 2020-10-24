import React, { Component } from "react";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";

class DateContent extends Component {
	state = {
		articles: [],
		headlines: [],
	};

	componentDidMount = async () => {
		let data = await Axios.get("http://localhost:3001/content/23-10-2020");
		console.log(data.data.articles);
		this.setState({ articles: data.data.articles, headlines: data.data.headliners });
	};

	render() {
		return (
			<Timeline align="alternate">
				{typeof this.state.articles !== "undefined" &&
					this.state.articles.map((article) => (
						<TimelineItem>
							<TimelineOppositeContent>
								<Typography variant="body2" color="inherit">
									{new Date(article.timestamp).toLocaleTimeString()}
								</Typography>
							</TimelineOppositeContent>
							<TimelineSeparator>
								<TimelineDot
									variant="outlined"
									color={article.source === "fox" ? "secondary" : "primary"}
								/>
								<TimelineConnector />
							</TimelineSeparator>
							<TimelineContent>{article.headline}</TimelineContent>
						</TimelineItem>
					))}
			</Timeline>
		);
	}
}

export default DateContent;
