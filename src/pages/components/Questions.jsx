import React from 'react';
import PropTypes from 'prop-types';
import shuffle from '../../services/shuffle';

class Questions extends React.Component {
  render() {
    const { options, questionNumber, answerSelected, time, selectAnswer } = this.props;
    const { incorrect_answers: incorrect, correct_answer: correct,
      type } = options[questionNumber];

    const alternatives = (type === 'boolean'
      ? [correct, incorrect] : [correct, ...incorrect]);

    const shuffledAlternatives = shuffle(alternatives);
    const ifTimeIsUp = time === 0 || answerSelected === true;

    return (
      shuffledAlternatives.map((alternative, index) => {
        const isTheAnswerCorrect = alternative === correct;
        const answerId = isTheAnswerCorrect ? 'correct-answer' : `wrong-answer-${index}`;
        const answerClass = isTheAnswerCorrect ? 'border-green' : 'border-red';

        return (
          <button
            onClick={ selectAnswer }
            type="button"
            key={ index }
            data-testid={ answerId }
            className={ answerSelected ? answerClass : '' }
            disabled={ ifTimeIsUp }
          >
            { alternative }
          </button>);
      })

    );
  }
}

Questions.propTypes = {
  options: PropTypes.string.isRequired,
  questionNumber: PropTypes.number.isRequired,
  answerSelected: PropTypes.bool.isRequired,
  time: PropTypes.number.isRequired,
  selectAnswer: PropTypes.func.isRequired,
};

export default Questions;
