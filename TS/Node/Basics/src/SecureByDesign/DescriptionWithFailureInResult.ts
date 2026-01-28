export default class Description {
  private constructor(
    // 4.1 Immutability
    public readonly text: string,
  ) {}

  static create(text: string): Result<Description> {
    // 4.2 Failing fast using contracts
    if (text.length === 0) {
      return Result.fail<Description>('Description cannot be empty');
    }

    if (text.length > 100) {
      return Result.fail<Description>('Description cannot exceed 100 characters');
    }

    return Result.ok<Description>(new Description(text));
  }

  equals(other: Description): boolean {
    return this.text === other.text;
  }
}

class Result<T> {
  private constructor(
    private error: string | null,
    private value?: T,
  ) {}

  static fail<T>(error: string): Result<T> {
    return new Result(error);
  }

  static ok<T>(value?: T): Result<T> {
    return new Result(null, value);
  }

  isSuccess(): boolean {
    return this.error === null;
  }

  getError(): string | null {
    return this.error;
  }

  getValue(): T | undefined {
    return this.value;
  }
}
