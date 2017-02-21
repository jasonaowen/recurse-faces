import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../action_creators';
import { getRandomPerson } from '../api';

class Next extends Component {
  handleGetNewPersonClick = (event) => {
    getRandomPerson().then((result) => {
      this.props.setActivePerson(result);
    });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleGetNewPersonClick}>
        <input type="submit" value="Next!" label="Next!" />
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export const NextContainer = connect(mapStateToProps, actionCreators)(Next);
