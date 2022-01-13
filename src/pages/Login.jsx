import React from 'react';

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
      <section>
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
      </section>
    );
  }
}

export default Login;
