import React, { Component } from "react";
import classes from "./DateContent.module.css";
import GlobalContext from "../../Context/GlobalContext";

import Axios from "axios";

import {
	Timeline,
	TimelineItem,
	TimelineSeparator,
	TimelineConnector,
	TimelineContent,
	TimelineDot,
	TimelineOppositeContent,
} from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";

class DateContent extends Component {
	static contextType = GlobalContext;

	state = {
		articles: [],
		headlines: [],
		headlinesAndArticles: [],
		mode: "headlinesAndArticles",
	};

	componentDidMount = async () => {
		let data = await Axios.get(`http://localhost:3001/content/${this.props.match.params.date}`);
		console.log(data.data.headlinesAndArticles);

		this.setState({
			articles: data.data.articles,
			headlines: data.data.headliners,
			headlinesAndArticles: data.data.headlinesAndArticles,
		});

		//also update the date with the appropriate one
		let curDate = this.props.match.params.date.split("-");
		this.context.setRouteAndDate(new Date(+curDate[2], +curDate[1] - 1, +curDate[0]), true);
	};

	componentDidUpdate = async (prevProps) => {
		if (prevProps.match.params.date === this.props.match.params.date) return;

		//also update the date with the appropriate one
		let curDate = this.props.match.params.date.split("-");
		this.context.setRouteAndDate(new Date(+curDate[2], +curDate[1] - 1, +curDate[0]), true);

		let data = await Axios.get(`http://localhost:3001/content/${this.props.match.params.date}`);
		this.setState({
			articles: data.data.articles,
			headlines: data.data.headliners,
			headlinesAndArticles: data.data.headlinesAndArticles,
		});
	};

	// shouldComponentUpdate = (prevProps) => {
	// 	console.log(prevProps.match.params.date);
	// 	console.log(this.props.match.params.date);
	// 	return prevProps.match.params.date !== this.props.match.params.date;
	// };

	render() {
		return (
			<Timeline align="alternate">
				{typeof this.state.articles !== "undefined" &&
					this.state.headlinesAndArticles.map((article) => (
						<TimelineItem key={article._id} className={classes.TimelineItem}>
							<TimelineOppositeContent>
								<Typography variant="body2" color="inherit">
									{new Date(article.timestamp).toLocaleTimeString()}
								</Typography>
							</TimelineOppositeContent>
							<TimelineSeparator>
								<TimelineDot
									variant={article.type === "article" ? "outlined" : "default"}
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

// import React, { useEffect, useState } from "react";
// import Timeline from "@material-ui/lab/Timeline";
// import TimelineItem from "@material-ui/lab/TimelineItem";
// import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
// import TimelineConnector from "@material-ui/lab/TimelineConnector";
// import TimelineContent from "@material-ui/lab/TimelineContent";
// import TimelineDot from "@material-ui/lab/TimelineDot";
// import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
// import Typography from "@material-ui/core/Typography";

// import { makeStyles } from "@material-ui/core/styles";
// import Axios from "axios";

// import GlobalContext from "../../Context/GlobalContext";

// const useStyles = makeStyles({
// 	root: {
// 		height: 120,
// 	},
// 	alignAlternate: {
// 		height: 120,
// 		minHeight: 120,
// 	},
// });

// const DateContent = (props) => {
// 	const [articles, setArticles] = useState([]);
// 	const [headlines, setHeadlines] = useState([]);
// 	const [headlinesAndArticles, setHeadlinesAndArticles] = useState([]);

// 	useEffect(() => {
// 		const f = async () => {
// 			let data = await Axios.get(`http://localhost:3001/content/${props.match.params.date}`);
// 			console.log(data.data.headlinesAndArticles);
// 			setArticles(data.data.articles);
// 			setHeadlines(data.data.headlines);
// 			setHeadlinesAndArticles(data.data.headlinesAndArticles);
// 		};

// 		f();
// 	}, [props.match.params.date]);

// 	const classes = useStyles();

// 	return (
// 		<Timeline align="alternate">
// 			{typeof articles !== "undefined" &&
// 				articles.map((article) => (
// 					<TimelineItem key={article._id} classes={classes.alignAlternate}>
// 						<TimelineOppositeContent>
// 							<Typography variant="body2" color="inherit">
// 								{new Date(article.timestamp).toLocaleTimeString()}
// 							</Typography>
// 						</TimelineOppositeContent>
// 						<TimelineSeparator>
// 							<TimelineDot
// 								variant="outlined"
// 								color={article.source === "fox" ? "secondary" : "primary"}
// 							/>
// 							<TimelineConnector />
// 						</TimelineSeparator>
// 						<TimelineContent>{article.headline}</TimelineContent>
// 					</TimelineItem>
// 				))}
// 		</Timeline>
// 	);
// };

// export default DateContent;
