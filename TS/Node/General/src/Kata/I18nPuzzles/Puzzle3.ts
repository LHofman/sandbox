// Mobbing practice with the Onyx Team

import fs from 'node:fs';
import path from 'node:path';

export function isValid(password: string): boolean {
  if (password.length < 4 || password.length > 12) return false;

  if (!/\d/.test(password)) return false;

  let hasUppercase: boolean = false;
  let hasLowercase: boolean = false;
  let hasSpecialCharacter: boolean = false;

  [...password].forEach((char) => {
    hasUppercase = hasUppercase || char.toLowerCase() !== char && char.toUpperCase() === char;
    hasLowercase = hasLowercase || char.toLowerCase() === char && char.toUpperCase() !== char;

    const cp = char.codePointAt(0);
    hasSpecialCharacter = hasSpecialCharacter || (cp !== undefined && cp > 127);

    if (hasUppercase && hasLowercase && hasSpecialCharacter) {
      return;
    }
  });

  if (!hasUppercase || !hasLowercase || !hasSpecialCharacter) return false;

  return true;
}

export function countValidPasswords(passwords: string[]): number {
  return passwords.reduce(
    (acc, password) => acc + (isValid(password) ? 1 : 0),
    0,
  );
}

export async function runFullInput() {
  fs.readFile(path.resolve(__dirname, "./Puzzle3.input.txt"), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const passwords = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const validCount = countValidPasswords(passwords);
    console.log(`There are ${validCount} valid passwords in the input file.`);
  });
}