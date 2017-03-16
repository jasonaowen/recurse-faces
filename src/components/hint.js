import React, { Component } from 'react';
import { connect } from 'react-redux';

class Hint extends Component {
  render() {
    const hint = this.props.hint;
    let persons = this.props.person.slice();
    if (hint.get('status') === "yes please") {
      let people = process.env.REACT_APP_USE_TEST_DATA === "true"
      ? persons
          .sort(function(a,b) {
            return Math.random()-Math.random();
          })
          .reduce(function(acc,val) {
        return acc += val.get('first_name') + ",";
      },"").slice(0,-1)
      : "Hint";
      return (
          <div className="hint please">
            It is one of the following names {people}
          </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    person: state.get('activePerson'),
    hint: state.get('hint')
  };
}

export const HintContainer = connect(mapStateToProps)(Hint);
