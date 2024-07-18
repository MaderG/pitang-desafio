export class InvalidYearError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidYearError'
  }
}