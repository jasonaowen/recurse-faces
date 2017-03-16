import { Map, fromJS } from 'immutable';

export const INITIAL_STATE = Map.of(
  'hint', Map.of('status', 'no hint'),
  'guess', Map.of('status', 'no guess'),
  'activePerson', Map.of(
    'id', 0,
    'first_name', '',
    'image_url', ''
  ),
);

export function guess(state, guess) {
  if (guess === state.getIn(['activePerson', '0', 'first_name'])) {
    return state.set('guess', Map.of('status', 'correct'));
  } else {
    return state.set('guess', Map.of('status', 'incorrect'));
  }
}

export function setActivePerson(state, person) {
  return state.set('activePerson', fromJS(person));
}

export function clearGuess(state) {
  return state.set('guess', Map.of('status', 'no guess'));
}

export function hint(state) {
  return state.set('hint', Map.of('status', 'yes please'))
}

export function clearHint(state) {
  return state.set('hint', Map.of('status', 'no hint'));
}

/* things we'll want in the store
 *
 * list of people
 * currently selected person
 * what the user has typed as a guess so far (maybe? does this need to be stored?)
 * something about batches - currently selected, maybe? maybe also a list?
 *
 */
