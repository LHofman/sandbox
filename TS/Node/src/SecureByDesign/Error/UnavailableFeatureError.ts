// 9.1.2 Handling exceptions
export default class UnavailableFeatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnavailableFeatureError';
  }
}
