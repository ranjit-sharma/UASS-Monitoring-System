// src/models/user.model.js
import mongoose from 'mongoose';

const ROLES = ['admin', 'operator', 'viewer'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i, 'Invalid email address'],
      maxlength: [254, 'Email cannot exceed 254 characters'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // never returned in queries unless explicitly selected
    },
    role: {
      type: String,
      enum: { values: ROLES, message: 'Invalid role' },
      default: 'viewer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Never expose passwordHash via toJSON
userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export const VALID_ROLES = ROLES;
export const User = mongoose.model('User', userSchema);

