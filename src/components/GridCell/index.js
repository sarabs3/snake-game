import React from "react";

const GridCell = props => {
	const classes = `grid-cell 
		${props.foodCell ? "grid-cell--food" : ""} 
		${props.snakeCell ? "grid-cell--snake" : ""}
		`;

	return (
		<div
			className={classes}
			style={{height: props.size + "px", width: props.size + "px"}}
			data-testid={'grid-cell'}
		/>
	);
};

export default GridCell;
