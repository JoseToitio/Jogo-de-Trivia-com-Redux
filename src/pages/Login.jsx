import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setPlayerAction, setTokenAction } from '../redux/actions';
import logo from '../trivia.png';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      userName: '',
      isDisabled: true,
    };
    this.isEmailValid = this.isEmailValid.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateButtonState = this.updateButtonState.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  onChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value }, this.updateButtonState);
  }

  getToken = () => {
    const { setToken, setPlayer } = this.props;
    const { email, userName } = this.state;
    const END_POINT = 'https://opentdb.com/api_token.php?command=request';

    setPlayer({ name: userName, gravatarEmail: email });

    try {
      fetch(END_POINT)
        .then((response) => response.json())
        .then(({ token }) => {
          setToken(token);
          localStorage.setItem('token', token);
          const { history } = this.props;
          history.push('/game');
        });
    } catch (error) {
      console.error(error);
    }
  }

  handleClick() {
    const { history } = this.props;
    history.push('/settings');
  }

  isEmailValid(email) {
    return email.length !== 0;
  }

  updateButtonState() {
    const { email, userName } = this.state;
    const { isEmailValid } = this;
    const minLength = 1;
    const valid = !(isEmailValid(email) && userName.length >= minLength);
    this.setState({ isDisabled: valid });
  }

  render() {
    const { isDisabled } = this.state;
    return (
      <main>
        <header className="App-header">
          <img src={ logo } className="App-logo" alt="logo" />
          <div>
            <input
              type="text"
              name="userName"
              data-testid="input-player-name"
              onChange={ this.onChange }
            />
            <input
              type="email"
              name="email"
              onChange={ this.onChange }
              data-testid="input-gravatar-email"
            />

            <input
              type="button"
              disabled={ isDisabled }
              value="INICIAR"
              data-testid="btn-play"
              onClick={ this.getToken }
            />

            <button
              type="button"
              data-testid="btn-settings"
              onClick={ this.handleClick }
            >
              Configura????es do Jogo
            </button>
          </div>
        </header>
      </main>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setTokenAction(token)),
  setPlayer: (player) => dispatch(setPlayerAction(player)),
});

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  setPlayer: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
