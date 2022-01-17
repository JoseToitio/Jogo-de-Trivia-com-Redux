import React from 'react';
import PropTypes from 'prop-types';
import shuffle from '../../services/shuffle';

class CreateButtons extends React.Component {
  constructor() {
    super();
    this.createButtons = this.createButtons.bind(this);
  }

  createButtons() {
    const { options, count, answerSelected, time, respost } = this.props;
    const ifTimeIsUp = time === 0 || answerSelected === true;
    const {
      incorrect_answers: incorrect,
      correct_answer: correct,
      type } = options[count];
    const alternativas = (
      type === 'boolean' ? [correct, incorrect] : [correct, ...incorrect]);
    const questionRand = shuffle(alternativas);
    return (
      <div data-testid="answer-options">
        {questionRand.map((curr, Index) => {
          if (options.some((f) => f.correct_answer === curr)) {
            return (
              <button
                onClick={ respost }
                type="button"
                key={ Index }
                data-testid="correct-answer"
                className={ answerSelected ? 'border-green' : '' }
                disabled={ ifTimeIsUp }
              >
                { curr }
              </button>);
          }
          return (
            <button
              onClick={ respost }
              type="button"
              key={ Index }
              data-testid={ `wrong-answer-${Index}` }
              className={ answerSelected ? 'border-red' : '' }
              disabled={ ifTimeIsUp }
            >
              { curr }
            </button>);
        })}
      </div>);
  }

  render() {
    const { createButtons } = this;
    return (
      <>
        { createButtons() }
      </>
    );
  }
}

CreateButtons.propTypes = {
  options: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  answerSelected: PropTypes.bool.isRequired,
  time: PropTypes.number.isRequired,
  respost: PropTypes.func.isRequired,
};

export default CreateButtons;
