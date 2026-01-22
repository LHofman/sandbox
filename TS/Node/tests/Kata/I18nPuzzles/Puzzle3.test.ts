import { countValidPasswords } from '../../../src/Kata/I18nPuzzles/Puzzle3';

it('validates the test input', () => {
  const testInput = [
    "d9Ō",
    "uwI.E9GvrnWļbzO",
    "ž-2á",
    "Ģ952W*F4",
    "?O6JQf",
    "xi~Rťfsa",
    "r_j4XcHŔB",
    "71äĜ3",
  ];

  const validCount = countValidPasswords(testInput);
  expect(validCount).toBe(2);
});
