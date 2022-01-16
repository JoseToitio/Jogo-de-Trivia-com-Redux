import React from 'react';
import Header from './components/Header';
import Messeges from './components/Messeges';

class Feedback extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Messeges />
      </div>
    );
  }
}

export default Feedback;
