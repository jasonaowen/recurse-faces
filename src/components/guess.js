import React, { Component } from 'react';
import { connect } from 'react-redux';

class Guess extends Component {
  render() {
    const guess = this.props.guess;
    if (guess.get('status') === "correct") {
      return (
          <div className="correct guess">
            Correct! Their Full Name is {this.props.person.get('first_name')} {this.props.person.get('last_name')}
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
    guess: state.get('guess'),
    person: state.get('activePerson')
  };
}

export const GuessContainer = connect(mapStateToProps)(Guess);
