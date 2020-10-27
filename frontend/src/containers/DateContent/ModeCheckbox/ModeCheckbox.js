import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import FormHelperText from "@material-ui/core/FormHelperText";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
	},
	formControl: {
		margin: theme.spacing(3),
	},
	formLabel: {
		color: "inherit",
	},
}));

const ModeCheckbox = (props) => {
	const classes = useStyles();

	const { fox, cnn } = props.sources;
	const { headlines, articles } = props.modes;

	return (
		<div className={classes.root}>
			<FormControl component="fieldset" className={classes.formControl}>
				<FormLabel component="legend" className={classes.formLabel}>
					Filter Source
				</FormLabel>
				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox
								checked={fox}
								onChange={(e) => props.handleSourceChange(e)}
								name="fox"
								disabled={fox && !cnn}
							/>
						}
						label="Fox"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={cnn}
								onChange={(e) => props.handleSourceChange(e)}
								name="cnn"
								disabled={cnn && !fox}
							/>
						}
						label="CNN"
					/>
				</FormGroup>
			</FormControl>
			<FormControl component="fieldset" className={classes.formControl}>
				<FormLabel component="legend" className={classes.formLabel}>
					Filter headlines/articles
				</FormLabel>
				<FormGroup>
					<FormControlLabel
						control={
							<Checkbox
								checked={headlines}
								onChange={(e) => props.handleModeChange(e)}
								name="headlines"
								disabled={headlines && !articles}
							/>
						}
						label="Headlines"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={articles}
								onChange={(e) => props.handleModeChange(e)}
								name="articles"
								disabled={articles && !headlines}
							/>
						}
						label="Articles"
					/>
				</FormGroup>
			</FormControl>
		</div>
	);
};

export default ModeCheckbox;
