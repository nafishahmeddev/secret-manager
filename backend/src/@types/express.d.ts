import { IncomingHttpHeaders } from 'http';
interface Headers extends IncomingHttpHeaders {
  authorization?: string;
}

declare global {
  namespace Express {
    interface Request {
      headers: Headers;
      auth?: {
        id: string;
        email: string;
      };
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