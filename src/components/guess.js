import React, { Component } from 'react';
import { connect } from 'react-redux';

class Guess extends Component {
  render() {
    const guess = this.props.guess;
    if (guess.get('status') === "correct") {
      return (
          <div className="correct guess">
            Correct!
          </div>
      );
    } else if (guess.get('status') === "incorrect") {
      return (
          <div className="incorrect guess">
            Wrong :(
          </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    guess: state.get('guess')
  };
}

export const GuessContainer = connect(mapStateToProps)(Guess);
