export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public details?: any
  ) {
    super(message);
  }
}
