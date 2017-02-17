import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { CardContainer } from './components/card';
import { GuessContainer } from './components/guess';
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
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <CardContainer />
        <GuessContainer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, actionCreators)(App);
