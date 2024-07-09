export class AppointmentNotExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppointmentNotExistsError';
  }
}
