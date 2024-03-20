import { JwtDecodedPayload } from '@/auth/auth.types';
import { Request } from 'express';

export default function extractUserDataFromRequest(
  req: Request,
): JwtDecodedPayload {
  return {
    id: req.user.id,
    role: req.user.role,
    username: req.user.username,
    cat_type_id: req.user.cat_type_id,
  };
}
