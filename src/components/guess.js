import React, { Component } from 'react';
import { connect } from 'react-redux';

class Guess extends Component {

  render() {
    const guess = this.props.guess;
    if (guess.get('status') === "correct") {
      let person = this.props.person;
      let firstName = person.getIn(['0','first_name']);
      let lastName = person.getIn(['0','last_name']);
      let personId = person.getIn(['0','person_id']);
      let stints = person.getIn(['0','stints']);

      let stint_info = new Set(stints.map(s => this.stintToString(s)));
      stint_info = [...stint_info].join('; ');

      if (stint_info) {
        stint_info = <span className="stint">{`(${stint_info})`}</span>;
      } else {
        stint_info = "";
      }

      return (
          <div className="guess-result correct-guess">
            <p>Correct! Their Full Name
            is <a href={`https://www.recurse.com/directory/${personId}`}> <br/>
            {firstName} {lastName}</a> {stint_info}
            </p>
          </div>
      );
    } else if (guess.get('status') === "incorrect") {
      return (
          <div className="guess-result incorrect-guess">
            <p>Wrong :(</p>
          </div>
      );
    } else {
      return null;
    }
  }

  stintToString(stint) {
    let stint_info = "";

    if (!stint) {
      return "";
    }

    let type = stint.get('stint_type')
    if (!type) {
      return "";
    }

    if (type === 'retreat') {
      return stint.get('short_name');
    }

    switch (type) {
      case 'residency':
        type = 'Resident';
        break;
      case 'employment':
        type = stint.get('title') || 'Staff';
        break;
      case 'experimental':
        type = 'Experimental Batch';
        break;
      case 'research fellowship':
        type = 'Research Fellow';
        break;
      case 'facilitatorship':
        type = 'Facilitator';
        break;
      default:
        type = type.charAt(0).toUpperCase() + type.slice(1);
    }

    let dates = this.dateRangeToString(stint.get('start_date'),
      stint.get('end_date'));

    // Using non-breaking space char to keep stint together on a single line
    stint_info = (type + dates).replace(/\s+/g, "\u00A0")

    return stint_info;
  }

  dateRangeToString(start_date, end_date) {
    let date = "";
    const start = this.dateToString(start_date);

    // Schema requires start date but not end date
    if (end_date) {
      date = ", " + start;
      const end = this.dateToString(end_date);

      if (start !== end) {
        date += " - " + end;
      }
    } else {
      date = " since " + start;
    }

    return date;
  }

  dateToString(date) {
    // Input format: "Day, DD Mon YYYY", e.g. "Tue, 23 Apr 2019 00:00:00 GMT"
    // Output format: "Mon 'YY", e.g. "Apr '19"
    return date.substring(8, 11) + " '" + date.substring(14, 16);
  }
}

function mapStateToProps(state) {
  return {
    guess: state.get('guess'),
    person: state.get('activePerson')
  };
}

export const GuessContainer = connect(mapStateToProps)(Guess);
