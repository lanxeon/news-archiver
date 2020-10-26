import React, { Component } from "react";
// import classes from "./DateContent.module.css";
import GlobalContext from "../../Context/GlobalContext";

import { Timeline } from "@material-ui/lab";
import Axios from "axios";

import TimelineItems from "./TimelineItems/TimelineItems";

class DateContent extends Component {
	static contextType = GlobalContext;

	state = {
		articles: [],
		headlines: [],
		headlinesAndArticles: [],
		mode: "headlinesAndArticles",
		source: "both",
	};

	componentDidMount = async () => {
		let data = await Axios.get(`http://localhost:3001/content/${this.props.match.params.date}`);
		console.log(data.data);

		this.setState({
			articles: data.data.articles,
			headlines: data.data.headlines,
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

	render() {
		//get the type of items to show (articles, headlines or both)
		const mode = this.state.mode;
		const items =
			this.state.source === "both"
				? [...this.state[mode]]
				: [...this.state[mode]].filter((item) => item.source !== this.state.source);

		return (
			<Timeline align="alternate">
				<TimelineItems items={items} />
			</Timeline>
		);
	}
}

export default DateContent;
