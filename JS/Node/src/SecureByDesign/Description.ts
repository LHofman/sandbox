export default class Description {
  constructor(
    // 4.1 Immutability
    public readonly text: string,
  ) {
    // 4.2 Failing fast using contracts
    // 4.2.2 Upholding invariants in constructors
    if (text.length === 0) {
      throw new Error('Description cannot be empty');
    }

    if (text.length > 100) {
      throw new Error('Description cannot exceed 100 characters');
    }
  }

  equals(other: Description): boolean {
    return this.text === other.text;
  }
}