import React, { Component } from 'react';
import { connect } from 'react-redux';

class Guess extends Component {
  render() {
    const guess = this.props.guess;
    if (guess.get('status') === "correct") {
      let person = this.props.person;
      return (
          <div className="correct guess">
            Correct! Their Full Name is {person.getIn(['0','first_name'])} {person.getIn(['0','last_name'])}
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
