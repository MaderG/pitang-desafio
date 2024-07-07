export class BookingBoundsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingBoundsError';
  }
}
