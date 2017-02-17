import { Map, fromJS } from 'immutable';

export const INITIAL_STATE = Map();

export function setActivePerson(state, person) {
  return state.set('activePerson', fromJS(person));
}

/* things we'll want in the store
 *
 * list of people
 * currently selected person
 * what the user has typed as a guess so far (maybe? does this need to be stored?)
 * something about batches - currently selected, maybe? maybe also a list?
 *
 */
