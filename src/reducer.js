import { INITIAL_STATE, guess, setActivePerson, clearGuess, hint, clearHint } from './core';

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'SET_ACTIVE_PERSON':
    return setActivePerson(state, action.person);
  case 'GUESS':
    return guess(state, action.guess);
  case 'CLEARGUESS':
    return clearGuess(state);
  case 'HINT':
    return hint(state);
  case 'CLEARHINT':
    return clearHint(state);
  default:
    return state;
  }
}
