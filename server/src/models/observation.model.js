// src/models/observation.model.js
import mongoose from 'mongoose';

const SOURCES = ['simulated', 'instrument', 'manual'];

const observationSchema = new mongoose.Schema(
  {
    altitude: {
      type: Number,
      required: [true, 'Altitude is required'],
      min: [0, 'Altitude cannot be negative'],
      max: [50000, 'Altitude cannot exceed 50,000 meters'],
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature is required'],
      min: [-100, 'Temperature cannot be below -100Â°C'],
      max: [60, 'Temperature cannot exceed 60Â°C'],
    },
    pressure: {
      type: Number,
      required: [true, 'Pressure is required'],
      min: [1, 'Pressure cannot be below 1 hPa'],
      max: [1100, 'Pressure cannot exceed 1100 hPa'],
    },
    humidity: {
      type: Number,
      required: [true, 'Humidity is required'],
      min: [0, 'Humidity cannot be below 0%'],
      max: [100, 'Humidity cannot exceed 100%'],
    },
    windSpeed: {
      type: Number,
      required: [true, 'Wind speed is required'],
      min: [0, 'Wind speed cannot be negative'],
      max: [200, 'Wind speed cannot exceed 200 m/s'],
    },
    windDirection: {
      type: Number,
      required: [true, 'Wind direction is required'],
      min: [0, 'Wind direction must be between 0 and 360'],
      max: [360, 'Wind direction must be between 0 and 360'],
    },
    latitude: {
      type: Number,
      required: false,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: false,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    recordedAt: {
      type: Date,
      required: [true, 'Recorded timestamp is required'],
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      enum: { values: SOURCES, message: 'Invalid source' },
      required: [true, 'Source is required'],
      index: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DataCollection',
      default: null,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for common filter queries
observationSchema.index({ recordedAt: -1, altitude: 1 });
observationSchema.index({ sessionId: 1, recordedAt: -1 });

observationSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const Observation = mongoose.model('Observation', observationSchema);


