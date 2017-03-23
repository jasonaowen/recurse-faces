import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action_creators';
import { getRandomPerson } from '../api';
import { Button } from 'react-bootstrap'

class Next extends Component {
  handleGetNewPersonClick = (event) => {
    event.preventDefault();
    const filter = this._selection.value;
    getRandomPerson(filter).then((result) => {
      this.props.setActivePerson(result);
    });
    this.props.clearGuess();
    this.props.clearHint();
  }

  render() {
    return (
      <form onSubmit={this.handleGetNewPersonClick}>
        <select id="filter" name="filter" ref={input => this._selection = input}>
          <option value="all">Everyone</option>
          <option value="overlapping">At RC with me</option>
          <option value="my_batch">My batch</option>
        </select>
        <Button id="next" bsStyle="success" type="submit" value="Next!">Next!</Button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export const NextContainer = connect(mapStateToProps, actionCreators)(Next);
