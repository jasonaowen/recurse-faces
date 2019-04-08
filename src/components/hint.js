import React, { Component } from 'react';
import { connect } from 'react-redux';

class Hint extends Component {
  render() {
    const hint = this.props.hint;
    if (hint.get('status') === "yes please") {
      let people = this.props.person.slice().sort(function(a,b) {
        let rand = parseInt(Math.random()*2, 10);
        let isPosOrNeg = rand === 1 ? 1 : -1;
        return isPosOrNeg;
      }).map(function(element){
        return element.get('first_name');
      }).join(', ');
      return (
          <div className="hint-result hint please">
            <p>It is one of the following names: <br/> {people}</p>
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
