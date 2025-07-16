interface Headers extends IncomingHttpHeaders {
  authorization?: string;
}

declare global {
  namespace Express {
    interface Request {
      headers: Headers;
    }
    interface Response {
      locals: {
        // User information, if authenticated
      };
    }
  }
}