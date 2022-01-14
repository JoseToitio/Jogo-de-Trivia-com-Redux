import React from 'react';
import PropTypes from 'prop-types';
import Button from './components/Button';
import Header from './components/Header';

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { history } = this.props;
    history.push('/');
    console.log('cliquei');
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <Header />
        <Button onClick={ this.handleClick } />
      </div>
    );
  }
}
Feedback.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
export default Feedback;
