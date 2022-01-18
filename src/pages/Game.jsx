import React from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import fetchQuestions from '../services/fetchQuestions';
import { setPlayerAction } from '../redux/actions';
import Questions from './components/Questions';
import Header from './components/Header';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      options: [],
      questionNumber: 0,
      time: 30,
      answerSelected: false,
      points: 0,
      assertions: 0,
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    fetchQuestions(token).then((data) => {
      this.setState({ options: data.results });
    });

    this.setTimer();
  }

  componentDidUpdate() {
    const { time, answerSelected } = this.state;
    if (time <= 0 || answerSelected === true) clearInterval(this.intervalId);
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

  selectAnswer = ({ target }) => {
    const { options, time, questionNumber } = this.state;
    const { correct_answer: correct } = options[questionNumber];
    const selectedAnswer = target.innerHTML;
    const ten = 10;
    const three = 3;

    const points = {
      easy: ten + time,
      medium: ten + (time * 2),
      hard: ten + (time * three),
    };

    if (correct === selectedAnswer) {
      this.setState({
        answerSelected: true,
      });
      return this.setState((prevState) => ({
        assertions: prevState.assertions + 1,
        points: prevState.points + points[options[questionNumber].difficulty],
      }));
    }
    this.setState({ answerSelected: true });
  }

  changeQuestion = () => {
    const { points, assertions, questionNumber } = this.state;
    const { player: { name, gravatarEmail }, history, setPlayer } = this.props;

    this.setState((prevState) => ({
      questionNumber: prevState.questionNumber + 1,
      answerSelected: false,
    }));

    this.setTimer();

    const hash = md5(gravatarEmail).toString();
    const email = `https://www.gravatar.com/avatar/${hash}`;

    localStorage.setItem(
      'ranking', JSON.stringify({ name, score: points, picture: email }),
    );

    const lastNumber = 4;
    const questionsOver = questionNumber === lastNumber;

    if (questionsOver) history.push('/feedback');

    setPlayer({ score: points, assertions });
  }

  render() {
    const { options, questionNumber, time, answerSelected, points } = this.state;
    const { player } = this.props;

    return (
      <section>
        <Header player={ player } />

        <div data-testid="question-category">
          {options.length >= 1 ? options[questionNumber].category : 'Carregando'}
        </div>

        <div data-testid="question-text">
          {options.length >= 1 ? options[questionNumber].question : 'Carregando'}
        </div>

        <div>{`Tempo: ${time}`}</div>

        <div data-testid="answer-options">
          {options.length >= 1 ? (
            <Questions
              options={ options }
              questionNumber={ questionNumber }
              answerSelected={ answerSelected }
              time={ time }
              selectAnswer={ this.selectAnswer }
            />) : ('Carregando')}
        </div>

        {(answerSelected === true || time === 0) && (
          <input
            value="NEXT"
            type="button"
            data-testid="btn-next"
            onClick={ this.changeQuestion }
          />
        )}

        <div data-testid="header-score">{points}</div>
      </section>
    );
  }
}

Game.propTypes = {
  player: PropTypes.shape({
    name: PropTypes.string.isRequired,
    gravatarEmail: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.string.isRequired,
  setPlayer: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.token,
  player: state.player,
});

const mapDispatchToProps = (dispatch) => ({
  setPlayer: (player) => dispatch(setPlayerAction(player)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
