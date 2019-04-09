import React, { Component } from 'react';
import { connect } from 'react-redux';

class Guess extends Component {
  render() {
    const guess = this.props.guess;
    if (guess.get('status') === "correct") {
      let person = this.props.person;
      let firstName = person.getIn(['0','first_name']);
      let lastName = person.getIn(['0','last_name']);
      let personId = person.getIn(['0','person_id']);
      return (
          <div className="guess-result correct-guess">
            <p>Correct! Their Full Name
            is <a href={`https://www.recurse.com/directory/${personId}`}>
            {firstName} {lastName}</a>
            </p>
          </div>
      );
    } else if (guess.get('status') === "incorrect") {
      return (
          <div className="guess-result incorrect-guess">
            <p>Wrong :(</p>
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
