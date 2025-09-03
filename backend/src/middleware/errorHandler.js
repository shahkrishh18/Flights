import ApiError from '../utils/ApiError.js';


export const notFound = (_req, _res, next) => {
next(new ApiError(404, 'Route not found'));
};


export const errorHandler = (err, _req, res, _next) => {
const status = err instanceof ApiError && err.statusCode ? err.statusCode : 500;
const message = err.message || 'Internal Server Error';
if (process.env.NODE_ENV !== 'production') {
console.error(err);
}
res.status(status).json({ success: false, message });
};