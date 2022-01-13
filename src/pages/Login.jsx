import React from 'react';
import PropTypes from 'prop-types';
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

  handleClick() {
    const { history } = this.props;
    history.push('/settings');
  }

  isEmailValid(email) {
    const re = /\S+@\S+\.com/;
    const result = re.test(email);
    if (result === true) {
      return true;
    }
  }

  updateButtonState() {
    const { email, userName } = this.state;
    const { isEmailValid } = this;
    const minLength = 1;
    const valid = !(isEmailValid(email) && userName.length >= minLength);
    this.setState({ isDisabled: valid });
    console.log(isEmailValid(email));
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
            />

            <button
              type="button"
              data-testid="btn-settings"
              onClick={ this.handleClick }
            >
              Configurações do Jogo
            </button>
          </div>
        </header>
      </main>
    );
  }
}

Login.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default Login;
