import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function Messeges(props) {
  const { assertions } = props;
  const minScore = 3;
  const msg = parseInt(assertions, 10) < minScore ? 'Could be better...' : 'Well Done!';
  return (
    <section>
      <h1 data-testid="feedback-text">{msg}</h1>
    </section>
  );
}

Messeges.propTypes = {
  assertions: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  assertions: state.assertions,
});

export default connect(mapStateToProps)(Messeges);
