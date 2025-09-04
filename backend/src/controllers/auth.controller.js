import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {asyncHandler} from '../utils/asyncHandler.js';
import User from '../models/User.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  res.json({ success: true, accessToken, refreshToken });
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
const { email } = req.body;
const user = await User.findOne({ email });
if (!user) return res.json({ success: true, message: 'If that email exists, a reset link has been sent' });


const raw = crypto.randomBytes(32).toString('hex');
const hash = crypto.createHash('sha256').update(raw).digest('hex');
user.passwordResetToken = hash;
user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
await user.save();


const resetUrl = `${process.env.APP_URL}/api/auth/reset-password/${raw}`;
await sendEmail({
to: user.email,
subject: 'Reset your password',
html: `<p>Click to reset: <a href="${resetUrl}">${resetUrl}</a></p>`
});


res.json({ success: true, message: 'If that email exists, a reset link has been sent' });
});


export const resetPassword = asyncHandler(async (req, res) => {
const { token } = req.params;
const { password } = req.body;
const hash = crypto.createHash('sha256').update(token).digest('hex');
const user = await User.findOne({
passwordResetToken: hash,
passwordResetExpires: { $gt: new Date() }
}).select('+password');


if (!user) throw new ApiError(400, 'Invalid or expired reset token');


user.password = password;
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;
await user.save();


res.json({ success: true, message: 'Password updated' });
});
