export function guess(guess) {
  return {
    type: "GUESS",
    guess
  };
}

export function setActivePerson(person) {
  return {
    type: "SET_ACTIVE_PERSON",
    person
  };
}

export function clearGuess() {
    return {
    type: "CLEARGUESS",
  };
}
