import React from 'react';
import PropTypes from 'prop-types';
import Button from './components/Button';
import Header from './components/Header';
import Messeges from './components/Messeges';

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(rota) {
    const { history } = this.props;
    history.push(`/${rota}`);
  }

  render() {
    return (
      <div>
        <Header />
        <Messeges />
        <Button
          onClick={ () => this.handleClick('') }
          name="Play Again"
          testid="btn-play-again"
        />
        <Button
          onClick={ () => this.handleClick('ranking') }
          name="Ranking"
          testid="btn-ranking"
        />
      </div>
    );
  }
}
Feedback.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default Feedback;
