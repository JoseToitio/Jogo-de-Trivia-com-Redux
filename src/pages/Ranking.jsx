import React, { Component } from 'react';

class Ranking extends Component {
  constructor() {
    super();
    this.state = {
      player: [],
    };
    this.getFromLocalStorage = this.getFromLocalStorage.bind(this);
  }

  componentDidMount() {
    const { getFromLocalStorage } = this;
    getFromLocalStorage();
  }

  getFromLocalStorage() {
    const player = JSON.parse(localStorage.getItem('ranking'));
    this.setState({ player });
  }

  render() {
    const { player } = this.state;
    console.log(player);
    return (
      <div>
        <h1 data-testid="ranking-title">Ranking</h1>
      </div>
    );
  }
}

export default Ranking;
