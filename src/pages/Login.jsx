import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setTokenAction } from '../redux/actions';
import logo from '../trivia.png';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      userName: '',
      isDisabled: true,
    };
    this.isEmailValid = this.isEmailValid.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateButtonState = this.updateButtonState.bind(this);
  }

  onChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value }, this.updateButtonState);
  }

  getToken = () => {
    const { setToken } = this.props;
    const END_POINT = 'https://opentdb.com/api_token.php?command=request';

    try {
      fetch(END_POINT)
        .then((response) => response.json())
        .then(({ token }) => {
          setToken(token);
          localStorage.setItem('token', token);
        });
    } catch (error) {
      console.error(error);
    }
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
              onClick={ this.getToken }
            />
          </div>
        </header>
      </main>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setToken: (token) => dispatch(setTokenAction(token)) });

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
