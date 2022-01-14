import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Button extends Component {
  render() {
    const { onClick, name, testid } = this.props;
    return (
      <div>
        <button
          type="button"
          data-testid={ testid }
          onClick={ onClick }
        >
          {name}
        </button>
      </div>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  testid: PropTypes.string.isRequired,
};

export default Button;
