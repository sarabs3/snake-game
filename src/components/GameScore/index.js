import React from 'react';

const GameScore = props => {
	return <div className={'gameScore'} data-testid={'game-score'}>Score: <b>{props.score}</b></div>
};

export default GameScore;
