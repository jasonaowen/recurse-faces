import { Map, fromJS } from 'immutable';
import { string_compare } from './string_compare'
import { powerSet } from './name_variants'

export const INITIAL_STATE = Map.of(
  'hint', Map.of('status', 'no hint'),
  'guess', Map.of('status', 'no guess'),
  'loading', false,
  'activePerson', Map.of(
    'id', 0,
    'first_name', '',
    'image_url', ''
  ),
);

export function guess(state, guess) {
  let person = state.getIn(['activePerson', '0']);
  let firstName = person.get('first_name');
  let middleName = person.get('middle_name');
  let lastName = person.get('last_name');
  let variants = generateGuessVariants(firstName, middleName, lastName);

  if (checkGuess(guess, variants)) {
    return state.set('guess', Map.of('status', 'correct'));
  } else {
    return state.set('guess', Map.of('status', 'incorrect'));
  }
}

export function generateGuessVariants(firstName, middleName, lastName) {
  let nameParts = firstName.split(" ");

  // Only use the middle name if it's in parentheses.
  if (/^\(.*\)$/.test(middleName)) {
    nameParts.push(middleName);
  }

  let variants = powerSet(nameParts);

  // Filter out the empty set.
  variants = new Set(Array.from(variants).filter(v => v.length > 0));

  // For each variant, add one which also has the last name.
  let variantsWithLastName = new Set(variants);
  for (let variant of variants) {
    let variantWithLastName = variant.slice(0)
    variantWithLastName.push(lastName);
    variantsWithLastName.add(variantWithLastName);
  }

  return new Set([...variants, ...variantsWithLastName])
}

export function checkGuess(guess, variants) {
  return Array.from(variants).some((variant) => {
    return string_compare(variant.join(" "), guess);
  });
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

export function startLoading(state) {
  return state.set('loading', true);
}

export function endLoading(state) {
  return state.set('loading', false);
}

/* things we'll want in the store
 *
 * list of people
 * currently selected person
 * what the user has typed as a guess so far (maybe? does this need to be stored?)
 * something about batches - currently selected, maybe? maybe also a list?
 *
 */
