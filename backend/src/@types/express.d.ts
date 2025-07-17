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
        project?: {
          id: string;
          key: string;
        }; // Attach project data to response locals
      };
    }
  }
}