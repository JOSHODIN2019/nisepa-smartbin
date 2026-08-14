import type { NextFunction, Request, RequestHandler, Response } from 'express'

// Wraps async route handlers so rejected promises reach the error-handling
// middleware instead of crashing the process (Express 4-style requirement;
// harmless under Express 5's native async support too).
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}
