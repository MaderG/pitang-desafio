export class InvalidHourError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidHourError';
    }
}