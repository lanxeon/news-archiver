import React, { Component } from "react";
// import classes from "./DateContent.module.css";
import GlobalContext from "../../Context/GlobalContext";

import { Timeline } from "@material-ui/lab";
import Axios from "axios";

import ModeCheckbox from "./ModeCheckbox/ModeCheckbox";
import TimelineItems from "./TimelineItems/TimelineItems";

class DateContent extends Component {
	static contextType = GlobalContext;

	state = {
		articles: [],
		headlines: [],
		headlinesAndArticles: [],

		sources: {
			fox: true,
			cnn: true,
		},
		modes: {
			headlines: true,
			articles: true,
		},
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
			headlines: data.data.headlines,
			headlinesAndArticles: data.data.headlinesAndArticles,
		});
	};

	handleSourceChange = (event) => {
		this.setState({ sources: { ...this.state.sources, [event.target.name]: event.target.checked } });
	};
	handleModeChange = (event) => {
		this.setState({ modes: { ...this.state.modes, [event.target.name]: event.target.checked } });
	};

	render() {
		//get the type of items to show (articles, headlines or both), as well as the items given the mode
		const mode =
			this.state.modes["headlines"] && this.state.modes["articles"]
				? "headlinesAndArticles"
				: this.state.modes["articles"]
				? "articles"
				: "headlines";

		const source =
			this.state.sources["fox"] && this.state.sources["cnn"]
				? "both"
				: this.state.sources["fox"]
				? "fox"
				: "cnn";

		const items =
			source === "both"
				? [...this.state[mode]]
				: [...this.state[mode]].filter((item) => item.source === source);

		return (
			<>
				<ModeCheckbox
					sources={this.state.sources}
					modes={this.state.modes}
					handleModeChange={(e) => this.handleModeChange(e)}
					handleSourceChange={(e) => this.handleSourceChange(e)}
				/>
				<Timeline align="left">
					<TimelineItems items={items} />
				</Timeline>
			</>
		);
	}
}

export default DateContent;
