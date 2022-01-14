import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Button extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <div>
        <button
          type="button"
          data-testid="btn-play-again"
          onClick={ onClick }
        >
          Play Again
        </button>
      </div>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Button;
