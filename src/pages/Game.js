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
    this.setState((prevState) => ({ time: prevState.time - 1 }));
  }

  setTimer = () => {
    this.setState({ time: 30 });
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.timeCountdown, this.seconds(1));
  }

  clickCount() {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
    this.setTimer();
  }

  createButtons(options) {
    const { clickCount } = this;
    const { count } = this.state;
    const { incorrect_answers: incorrect } = options[count];

    return incorrect.map((curr, index) => (
      <button
        key={ index }
        type="button"
        onClick={ clickCount }
        data-testid={ `wrong-answer-${index}` }
      >
        {curr}
      </button>
    ));
  }

  render() {
    const { options, count, time } = this.state;
    const { clickCount, createButtons } = this;

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
