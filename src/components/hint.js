import React, { Component } from 'react';
import { connect } from 'react-redux';

class Hint extends Component {
  render() {
    const hint = this.props.hint;
    if (hint.get('status') === "yes please") {
      let people = this.props.person.map(function(element){
        return element.get('first_name');
      }).join(', ')
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
