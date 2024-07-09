export class UnableToUpdateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnableToUpdateError';
  }
}
