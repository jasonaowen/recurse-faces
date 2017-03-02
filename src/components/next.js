import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action_creators';
import { getRandomPerson } from '../api';

class Next extends Component {
  handleGetNewPersonClick = (event) => {
    event.preventDefault();
    const filter = this._selection.value;
    getRandomPerson(filter).then((result) => {
      this.props.setActivePerson(result);
    });
    this.props.clearGuess();
  }

  render() {
    return (
      <form onSubmit={this.handleGetNewPersonClick}>
        <select name="filter" ref={input => this._selection = input}>
          <option value="all">Everyone</option>
          <option value="overlapping">At RC with me</option>
          <option value="my_batch">My batch</option>
        </select>
        <input type="submit" value="Next!" label="Next!" />
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export const NextContainer = connect(mapStateToProps, actionCreators)(Next);
