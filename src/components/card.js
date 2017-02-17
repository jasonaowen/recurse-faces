import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action_creators';

class Card extends Component {
  handleSubmitClick = (event) => {
    const guess = this._guess.value;
    this.props.guess(guess);
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
