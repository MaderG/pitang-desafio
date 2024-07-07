export class PastDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PastDateError';
  }
}
