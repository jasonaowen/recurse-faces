import { INITIAL_STATE, guess, setActivePerson } from './core';

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'SET_ACTIVE_PERSON':
    return setActivePerson(state, action.person);
  case 'GUESS':
    return guess(state, action.guess);
  default:
    return state;
  }
}
