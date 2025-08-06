import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  grade: { type: Number, enum: [10, 11, 12], required: true },
  stream: { type: String, enum: ['Science', 'Management'], required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};



const User = mongoose.model('User', userSchema);
export default User;
