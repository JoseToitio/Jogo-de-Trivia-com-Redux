import React from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import fetchQuestions from '../services/fetchQuestions';
import { setPlayerAction, setTokenAction } from '../redux/actions';
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

  async componentDidMount() {
    const { setToken } = this.props;
    const currentToken = localStorage.getItem('token');
    const TOKEN_END_POINT = 'https://opentdb.com/api_token.php?command=request';

    const { response_code: code, results } = await fetchQuestions(currentToken);

    const errorCode = 3;
    if (code !== errorCode) return this.setOptions(results);

    try {
      const { token: newToken } = await (await fetch(TOKEN_END_POINT)).json();

      setToken(newToken);
      localStorage.setItem('token', newToken);

      await fetchQuestions(newToken).then((result) => this.setState({ options: result }));
    } catch (error) {
      console.error(error);
    }
  }

  componentDidUpdate() {
    const { time, answerSelected } = this.state;
    if (time <= 0 || answerSelected === true) clearInterval(this.intervalId);
  }

  setOptions = (results) => {
    this.setState({ options: results });
    this.setTimer();
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

  optionClick = ({ target }) => {
    const { options, time, questionNumber, points: prevScore, assertions } = this.state;
    const { setPlayer } = this.props;
    const { correct_answer: correct } = options[questionNumber];
    const selectedAnswer = target.innerHTML;
    const ten = 10;
    const three = 3;
    const isCorrect = correct === selectedAnswer;

    const points = {
      easy: ten + time,
      medium: ten + (time * 2),
      hard: ten + (time * three),
    };

    const newScore = prevScore + points[options[questionNumber].difficulty];

    if (isCorrect) {
      setPlayer({ score: newScore, assertions: assertions + 1 });
      return this.setState((prevState) => ({
        answerSelected: true,
        assertions: prevState.assertions + 1,
        points: newScore,
      }));
    }
    this.setState({ answerSelected: true });
  }

  nextButtonClick = () => {
    const { points, questionNumber } = this.state;
    const { player: { name, gravatarEmail }, history } = this.props;

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
              selectAnswer={ this.optionClick }
            />) : ('Carregando')}
        </div>

        {(answerSelected === true || time === 0) && (
          <input
            value="NEXT"
            type="button"
            data-testid="btn-next"
            onClick={ this.nextButtonClick }
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
  setToken: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  token: state.token,
  player: state.player,
});

const mapDispatchToProps = (dispatch) => ({
  setPlayer: (player) => dispatch(setPlayerAction(player)),
  setToken: (token) => dispatch(setTokenAction(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
