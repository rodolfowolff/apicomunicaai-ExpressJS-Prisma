export class ApiError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
export class BadRequestError extends ApiError {
  constructor(message: string = "Bad Request: Invalid request parameters") {
    super(message, 400);
  }
}
export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized: Invalid credentials") {
    super(message, 401);
  }
}
export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden: You are not authorized") {
    super(message, 403);
  }
}
export class NotFoundError extends ApiError {
  constructor(message: string = "Not Found: Resource not found") {
    super(message, 404);
  }
}
export class ConflictError extends ApiError {
  constructor(message: string = "Conflict: Resource already exists") {
    super(message, 409);
  }
}
