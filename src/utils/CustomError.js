export class CustomError {
  static create({ name = "Error", status, message }) {
    const error = new Error(message);
    error.name = name;
    error.status = status;
    throw error;
  }
}
