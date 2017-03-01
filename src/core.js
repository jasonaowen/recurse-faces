import { Map, fromJS } from 'immutable';

export const INITIAL_STATE = Map.of(
  'guess', Map.of('status', 'no guess'),
  'activePerson', Map.of(
    'id', 0,
    'first_name', '',
    'image_url', ''
  ),
);

export function guess(state, guess) {
  if (guess === state.getIn(['activePerson', 'first_name'])) {
    return state.set('guess', Map.of('status', 'correct'));
  } else {
    return state.set('guess', Map.of('status', 'incorrect'));
  }
}

export function setActivePerson(state, person) {
  return state.set('activePerson', fromJS(person));
}

export function clearGuest(state) {
  return state.set('guess', Map.of('status', 'no guess'));
}

/* things we'll want in the store
 *
 * list of people
 * currently selected person
 * what the user has typed as a guess so far (maybe? does this need to be stored?)
 * something about batches - currently selected, maybe? maybe also a list?
 *
 */
