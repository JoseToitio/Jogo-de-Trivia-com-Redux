import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function Messeges(props) {
  const { assertions, score } = props;
  const minScore = 3;
  const msg = parseInt(assertions, 10) < minScore ? 'Could be better...' : 'Well Done!';
  return (
    <section data-testid="feedback-text">
      <h1 data-testid="feedback-text">{msg}</h1>
      <h2 data-testid="feedback-total-question">{assertions}</h2>
      <h2 data-testid="feedback-total-score">{score}</h2>
    </section>
  );
}

Messeges.propTypes = {
  assertions: PropTypes.string.isRequired,
  score: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
});

export default connect(mapStateToProps)(Messeges);
