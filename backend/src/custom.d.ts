// custom.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string }; // Make `user` optional to avoid issues in routes not using this property
    }
  }
}
