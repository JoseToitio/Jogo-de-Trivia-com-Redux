import React from 'react';
import { connect } from 'react-redux';
import fetchQuestions from '../services/fetchQuestions';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      options: [],
      count: 0,
      time: 30,
      answerSelected: false,
    };
    this.clickCount = this.clickCount.bind(this);
    this.createButtons = this.createButtons.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    fetchQuestions(token).then((data) => {
      this.setState({ options: data.results });
    });

    this.setTimer();
  }

  componentDidUpdate() {
    const { time } = this.state;
    if (time <= 0) clearInterval(this.intervalId);
  }

  seconds = (second) => {
    const milliseconds = 1000;
    return second * milliseconds;
  };

  timeCountdown = () => {
    const { time } = this.state;
    this.setState((prevState) => ({ time: prevState.time - 1 }));
    if (time === 1) this.setState({ answerSelected: true });
  }

  setTimer = () => {
    this.setState({ time: 30 });
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.timeCountdown, this.seconds(1));
  }

  clickCount() {
    this.setState((prevState) => ({
      count: prevState.count + 1,
      answerSelected: true,
    }));
    this.setTimer();
  }

  createButtons(options) {
    const { clickCount } = this;
    const { count, answerSelected, time } = this.state;
    const { incorrect_answers: incorrect } = options[count];
    const ifTimeIsUp = time === 0;

    return incorrect.map((curr, index) => (
      <button
        key={ index }
        type="button"
        onClick={ clickCount }
        data-testid={ `wrong-answer-${index}` }
        className={ answerSelected ? 'border-red' : '' }
        disabled={ ifTimeIsUp }
      >
        {curr}
      </button>
    ));
  }

  render() {
    const { options, count, time, answerSelected } = this.state;
    const { clickCount, createButtons } = this;
    const ifTimeIsUp = time === 0;

    return (
      <section>
        <div data-testid="question-category">
          {options.length >= 1 ? options[count].category : 'Carregando'}
        </div>

        <div data-testid="question-text">
          {options.length >= 1 ? options[count].question : 'Carregando'}
        </div>

        <div>{`Tempo: ${time}`}</div>

        <div>
          {options.length >= 1 ? createButtons(options) : 'Carregando'}

          <button
            type="button"
            onClick={ clickCount }
            data-testid="correct-answer"
            className={ answerSelected ? 'border-green' : '' }
            disabled={ ifTimeIsUp }
          >
            {options.length >= 1 ? options[count].correct_answer : 'Carregando'}
          </button>
        </div>

      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.token,
});

export default connect(mapStateToProps)(Game);
