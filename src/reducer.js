import { INITIAL_STATE, setActivePerson } from './core';

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case 'SET_ACTIVE_PERSON':
    return setActivePerson(state, action.person);
  default:
    return state;
  }
}
