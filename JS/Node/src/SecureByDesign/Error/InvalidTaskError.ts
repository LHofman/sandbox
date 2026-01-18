// 9.1.2 Handling exceptions
export default class InvalidTaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTaskError';
  }
}
