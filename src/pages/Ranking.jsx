import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './components/Button';

class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: [],
    };
    this.getFromLocalStorage = this.getFromLocalStorage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const { getFromLocalStorage } = this;
    getFromLocalStorage();
  }

  getFromLocalStorage() {
    const player = JSON.parse(localStorage.getItem('ranking'));
    this.setState({ player });
  }

  handleClick(rota) {
    const { history } = this.props;
    history.push(`/${rota}`);
  }

  render() {
    const { player } = this.state;
    console.log(player);
    return (
      <div>
        <h1 data-testid="ranking-title">Ranking</h1>
        <Button
          testid="btn-go-home"
          name="Login"
          onClick={ () => this.handleClick('') }
        />
      </div>
    );
  }
}
Ranking.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default Ranking;
