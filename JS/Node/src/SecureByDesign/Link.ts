import { link } from 'fs/promises';

const regex = new RegExp(/^https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
const notAllowedCharactersRegex = new RegExp('[<>@]+');

export default class Link {
  
  constructor(
    // 4.1 Immutability
    public readonly text: string,
  ) {
    // 4.2 Failing fast using contracts
    // 4.2.2 Upholding invariants in constructors

    if (text.length > 500) {
      throw new Error('Link cannot exceed 500 characters');
    }

    if (text.match(notAllowedCharactersRegex)) {
      throw new Error('Link must be a valid link');
    }

    if (!text.match(regex)) {
      throw new Error('Link must be a valid link');
    }
  }

  equals(other: Link): boolean {
    return this.text === other.text;
  }
}

export const isLink = (text: string): boolean => !!text.match(regex);