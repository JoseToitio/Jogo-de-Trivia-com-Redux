import React from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import fetchQuestions from '../services/fetchQuestions';
import { setPlayerAction } from '../redux/actions';
import CreateButtons from './components/CreateButtons';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      options: [],
      count: 0,
      time: 30,
      answerSelected: false,
      soma: 0,
      assertions: 0,
    };
    this.clickCount = this.clickCount.bind(this);
    this.respost = this.respost.bind(this);
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

  respost({ target }) {
    const resposta = target.innerHTML;
    const { options, time } = this.state;
    const DEZ = 10;
    const THREE = 3;
    if (options.some((x) => x.correct_answer === resposta)) {
      this.setState((prevState) => ({
        assertions: prevState.assertions + 1,
      }));
      if (options.some((x) => x.difficulty === 'easy')) {
        this.setState((prevState) => ({
          soma: prevState.soma + DEZ + time,
        }));
      } else if (options.some((x) => x.difficulty === 'medium')) {
        this.setState((prevState) => ({
          soma: prevState.soma + DEZ + (time * 2),
        }));
      } else if (options.some((x) => x.difficulty === 'hard')) {
        this.setState((prevState) => ({
          soma: prevState.soma + DEZ + (time * THREE),
        }));
      }
    }
    this.setState({
      answerSelected: true,
    });
  }

  clickCount() {
    this.setState((prevState) => ({
      count: prevState.count + 1,
      answerSelected: false,
    }));
    const { soma, assertions } = this.state;
    const { player } = this.props;
    const { name, gravatarEmail } = player;
    const hash = md5(gravatarEmail).toString();
    const email = `https://www.gravatar.com/avatar/${hash}`;
    this.setTimer();
    localStorage.setItem('ranking', JSON.stringify({
      name,
      score: soma,
      picture: email,
    }));
    const { count } = this.state;
    const FOUR = 4;
    if (count === FOUR) {
      const { history } = this.props;
      history.push('/feedback');
    }
    const { setPlayer } = this.props;
    setPlayer({
      score: soma,
      assertions,
    });
  }

  render() {
    const { options, count, time, answerSelected, soma } = this.state;
    const { clickCount, respost } = this;

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
          {options.length >= 1 ? (
            <CreateButtons
              options={ options }
              count={ count }
              answerSelected={ answerSelected }
              time={ time }
              respost={ respost }
            />
          ) : (
            'Carregando'
          )}
        </div>

        {answerSelected === true || time === 0 ? (
          <input
            value="NEXT"
            type="button"
            data-testid="btn-next"
            onClick={ clickCount }
          />
        ) : (
          ''
        )}
        <div data-testid="header-score">{soma}</div>
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
