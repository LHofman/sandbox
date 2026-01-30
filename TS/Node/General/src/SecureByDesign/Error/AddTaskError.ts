// 9.1.2 Handling exceptions
export default class AddTaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AddTaskError';
  }
}
