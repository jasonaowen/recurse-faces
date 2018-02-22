import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { CardContainer } from './components/card';
import { HintContainer } from './components/hint';
import { GuessContainer } from './components/guess';
import { NextContainer } from './components/next';
import * as actionCreators from './action_creators';
import { getRandomPerson } from './api';
import { connect } from 'react-redux';

class App extends Component {
  componentDidMount() {
    getRandomPerson().then((result) => {
      this.props.setActivePerson(result);
    });
  }

  render() {
    return (
      <div className="App">
        <CardContainer />
        <HintContainer />
        <GuessContainer />
        <NextContainer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, actionCreators)(App);
