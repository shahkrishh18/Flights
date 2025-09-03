import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema(
{
name: { type: String, trim: true },
email: { type: String, unique: true, required: true, lowercase: true, index: true },
password: { type: String, required: true, select: false },
passwordResetToken: { type: String, select: false },
passwordResetExpires: { type: Date, select: false }
},
{ timestamps: true }
);


userSchema.pre('save', async function (next) {
if (!this.isModified('password')) return next();
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
});


userSchema.methods.comparePassword = async function (candidate) {
return bcrypt.compare(candidate, this.password);
};


export default mongoose.model('User', userSchema);