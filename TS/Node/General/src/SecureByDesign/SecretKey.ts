import IllegalActionError from './Error/IllegalActionError';

export default class SecretKey {
  constructor(private value: string | null) {}

  getValue(): string {
    if (this.value === null) {
      throw new IllegalActionError('Secret key has already been consumed.');
    }

    const tempValue = this.value;
    this.value = null; // Invalidate the key after use
    return tempValue;
  }

  public toString = (): string => '[SecretKey: ****]';
}