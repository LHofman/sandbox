import { link } from 'fs/promises';

const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
const regex = new RegExp(expression);

export default class Link {
  
  constructor(
    // 4.1 Immutability
    public readonly text: string,
  ) {
    // 4.2 Failing fast using contracts
    // 4.2.2 Upholding invariants in constructors

    if (!text.match(regex)) {
      throw new Error('Link must be a valid link');
    }

    if (text.length > 500) {
      throw new Error('Link cannot exceed 500 characters');
    }
  }

  equals(other: Link): boolean {
    return this.text === other.text;
  }
}