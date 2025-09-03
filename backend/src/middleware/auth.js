import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';


export const verifyAccess = (req, _res, next) => {
try {
const auth = req.headers.authorization || '';
const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
if (!token) throw new ApiError(401, 'Missing access token');
const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
req.user = { id: payload.sub };
next();
} catch (err) {
next(new ApiError(401, 'Invalid or expired access token'));
}
};