import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action_creators';
import { getRandomPerson } from '../api';
import { Button } from 'react-bootstrap'

class Next extends Component {
  handleGetNewPersonClick = (event) => {
    event.preventDefault();
    const filter = this._selection.value;
    this.props.startLoading();
    getRandomPerson(filter).then((result) => {
      this.props.setActivePerson(result);
      this.props.endLoading();
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
        <Button id="next" bsStyle="success" type="submit" value="Next!" disabled={this.props.loading} >Next!</Button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.get('loading'),
  };
}

export const NextContainer = connect(mapStateToProps, actionCreators)(Next);
