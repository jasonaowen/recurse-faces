import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action_creators';
import { getRandomPerson } from '../api';

class Card extends Component {
  handleSubmitClick = (event) => {
    const guess = this._guess.value;
    this.props.guess(guess);
    event.preventDefault();
  }

  handleGetNewPersonClick = (event) => {
    getRandomPerson().then((result) => {
      this.props.setActivePerson(result);
    });
    event.preventDefault();
  }

  render() {
    const person = this.props.person;
    return (
      <div className="card">
        <div className="person-title" id={person.get('id') + "-title"}>
          Who is this?
        </div>
        <img src={person.get('image_url')}
             height="150"
             width="150"
             alt="Who is this?"
        />
        <form onSubmit={this.handleSubmitClick}>
          <input type="text" ref={input => this._guess = input} />
          <input type="submit" value="Guess!" label="Guess!" />
        </form>
        <form onSubmit={this.handleGetNewPersonClick}>
          <input type="submit" value="Next!" label="Next!" />
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    person: state.get('activePerson')
  };
}

export const CardContainer = connect(mapStateToProps, actionCreators)(Card);
