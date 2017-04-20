import {string_compare} from './string_compare'

const cases = [
  {
    name: 'Foo',
    guess: 'foo',
    result: true
  },
  {
    name: 'bâr',
    guess: 'bar',
    result: true
  },
  {
    name: 'Barbara ğ',
    guess: 'barbara g',
    result: true
  },
  {
    name: 'fIrSt ç',
    guess: 'first c',
    result: true
  },
  {
    name: 'Nobile\'s',
    guess: 'nobiles',
    result: true
  },
  {
    name: 'Mivá',
    guess: 'miva',
    result: true
  },
  {
    name: 'Mârjorie',
    guess: 'marjorie',
    result: true
  },
  {
    name: 'LIttlë',
    guess: 'little',
    result: true
  },
  {
    name: 'LIttlë',
    guess: 'Litttle',
    result: false
  },
  {
    name: 'Hermìne',
    guess: 'hermine',
    result: true
  },
  {
    name: 'Hermìne',
    guess: 'hemrine',
    result: false
  },
];

describe('string_compare', () => {
  for (var i = 0, len = cases.length; i < len; i++) {
    let c = cases[i]
    it(`When name is ${c.name} then guessing ${c.guess} should be ${c.result}`, () => {
      expect(string_compare(c.guess, c.name)).toBe(c.result);
    });
  }
});