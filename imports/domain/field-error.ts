
export class FieldError extends Error {
  constructor(
    public readonly fieldName: string,
    public readonly message: string
  ) {
    super(`'${fieldName}' ${message}`);
  }
}
