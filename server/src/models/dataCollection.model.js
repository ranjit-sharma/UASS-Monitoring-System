// src/models/dataCollection.model.js
import mongoose from 'mongoose';

export const COLLECTION_STATUSES = ['idle', 'running', 'completed', 'failed'];

// Valid state transitions (from -> [allowedTo])
const VALID_TRANSITIONS = {
  idle: ['running'],
  running: ['completed', 'failed'],
  completed: [],
  failed: [],
};

const dataCollectionSchema = new mongoose.Schema(
  {
    sessionName: {
      type: String,
      trim: true,
      maxlength: [200, 'Session name cannot exceed 200 characters'],
      default() {
        return `Session ${new Date().toISOString()}`;
      },
    },
    status: {
      type: String,
      enum: { values: COLLECTION_STATUSES, message: 'Invalid status' },
      default: 'idle',
      index: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      trim: true,
      default: 'simulated',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Validates that a status transition is allowed.
 * @param {string} from
 * @param {string} to
 * @returns {boolean}
 */
export function isValidTransition(from, to) {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

dataCollectionSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const DataCollection = mongoose.model('DataCollection', dataCollectionSchema);

