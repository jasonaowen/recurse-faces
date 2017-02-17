import React, { Component } from 'react';
import { connect } from 'react-redux';

class Card extends Component {
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    person: state.get('activePerson')
  };
}

export const CardContainer = connect(mapStateToProps)(Card);
