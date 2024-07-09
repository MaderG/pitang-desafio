export class MissingParametersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingParametersError';
  }
}
