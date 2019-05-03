import {checkGuess, generateGuessVariants} from './core'

describe('checkGuess', () => {
    it(`checks a simple case correctly`, () => {
        expect(checkGuess("John", new Set([["John"]]))).toEqual(true);
        expect(checkGuess("Paul", new Set([["John"]]))).toEqual(false);
        expect(checkGuess("", new Set([["John"]]))).toEqual(false);
    });
    it(`checks a more complicated case correctly`, () => {
        expect(checkGuess("John", generateGuessVariants("John Paul (JP)", "", ""))).toEqual(true);
        expect(checkGuess("Paul", generateGuessVariants("John Paul (JP)", "", ""))).toEqual(true);
        expect(checkGuess("John Paul", generateGuessVariants("John Paul (JP)", "", ""))).toEqual(true);
        expect(checkGuess("Paul John", generateGuessVariants("John Paul (JP)", "", ""))).toEqual(false);
        expect(checkGuess("J.P.", generateGuessVariants("John Paul (JP)", "", ""))).toEqual(true);
        expect(checkGuess("JP", generateGuessVariants("John Paul (JP)", "", ""))).toEqual(true);
    });
    it(`checks if middle names are handled correctly`, () => {
        expect(checkGuess("Sebastian", generateGuessVariants("Sebastian", "(blinry)", "Morr"))).toEqual(true);
        expect(checkGuess("blinry", generateGuessVariants("Sebastian", "(blinry)", "Morr"))).toEqual(true);
        expect(checkGuess("Blinry", generateGuessVariants("Sebastian", "(blinry)", "Morr"))).toEqual(true);
        expect(checkGuess("Sebastian blinry", generateGuessVariants("Sebastian", "(blinry)", "Morr"))).toEqual(true);
        expect(checkGuess("blinry", generateGuessVariants("Sebastian", "blinry", "Morr"))).toEqual(false);
        expect(checkGuess("B", generateGuessVariants("Sebastian", "B.", "Morr"))).toEqual(false);
    });
    it(`checks if last names are handled correctly`, () => {
        expect(checkGuess("Sebastian Morr", generateGuessVariants("Sebastian", "(blinry)", "Morr"))).toEqual(true);
        expect(checkGuess("Sebastian blinry Morr", generateGuessVariants("Sebastian", "(blinry)", "Morr"))).toEqual(true);
        expect(checkGuess("blinry Morr", generateGuessVariants("Sebastian", "(blinry)", "Morr"))).toEqual(true);
        expect(checkGuess("Morr", generateGuessVariants("Sebastian", "(blinry)", "Morr"))).toEqual(false);
    });
});
