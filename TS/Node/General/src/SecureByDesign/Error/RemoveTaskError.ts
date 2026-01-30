// 9.1.2 Handling exceptions
export default class RemoveTaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RemoveTaskError';
  }
}
