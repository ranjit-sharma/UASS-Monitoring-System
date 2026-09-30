// src/collectors/simulator.js
/**
 * SimulatorDataSource â€” implements the IDataSource interface.
 *
 * Generates plausible atmospheric soundings using a simplified ISA model.
 * All observations have source: 'simulated'.
 *
 * IDataSource interface:
 *   start(sessionId, onObservation, onError): void
 *   stop(): void
 *   getSourceName(): string
 */

import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

// ISA constants
const SEA_LEVEL_TEMP_C = 15; // Â°C
const LAPSE_RATE = 6.5 / 1000; // Â°C per meter
const SEA_LEVEL_PRESSURE = 1013.25; // hPa
const SCALE_HEIGHT = 8500; // meters

/**
 * Calculates ISA temperature at a given altitude (meters).
 * Valid in the troposphere (0â€“11,000 m).
 */
function isaTemperature(altitudeM) {
  const temp = SEA_LEVEL_TEMP_C - LAPSE_RATE * altitudeM;
  // Add Â±2Â°C random variation
  return parseFloat((temp + (Math.random() * 4 - 2)).toFixed(2));
}

/**
 * Calculates approximate atmospheric pressure at altitude using
 * the barometric formula.
 */
function isaPressure(altitudeM) {
  const pressure = SEA_LEVEL_PRESSURE * Math.exp(-altitudeM / SCALE_HEIGHT);
  // Add Â±1 hPa random variation
  return parseFloat((pressure + (Math.random() * 2 - 1)).toFixed(2));
}

/**
 * Returns a plausible relative humidity value.
 * Humidity decreases roughly with altitude, with random variation.
 */
function simulateHumidity(altitudeM) {
  const base = Math.max(0, 80 - altitudeM / 300);
  const value = base + (Math.random() * 20 - 10);
  return parseFloat(Math.min(100, Math.max(0, value)).toFixed(2));
}

/**
 * Returns a plausible wind speed (m/s).
 * Wind increases with altitude up to the jet stream level (~10 km).
 */
function simulateWindSpeed(altitudeM) {
  const base = Math.min(50, altitudeM / 300);
  const value = base + (Math.random() * 10 - 5);
  return parseFloat(Math.max(0, value).toFixed(2));
}

/**
 * Generates a slowly drifting wind direction (degrees).
 * Uses a simple random walk seeded per call.
 */
let _windDirection = 180;
function simulateWindDirection() {
  _windDirection = (_windDirection + (Math.random() * 20 - 10) + 360) % 360;
  return parseFloat(_windDirection.toFixed(1));
}

let _lat = 37.7749; // San Francisco start
let _lng = -122.4194;
function simulateLocation(windSpeed, windDir) {
  // Wind comes FROM windDir. Blows towards windDir + 180
  const blowRad = (windDir + 180) * (Math.PI / 180);
  // Rough approx: 1 m/s = ~0.00001 deg/s
  const speedDeg = windSpeed * 0.00001;
  // Multiplied by interval to simulate distance covered
  _lat += Math.cos(blowRad) * speedDeg * 5;
  _lng += Math.sin(blowRad) * speedDeg * 5;
  return { lat: parseFloat(_lat.toFixed(6)), lng: parseFloat(_lng.toFixed(6)) };
}

/**
 * Generates one observation payload at the given altitude.
 */
function generateObservation(altitudeM) {
  const windSpeed = simulateWindSpeed(altitudeM);
  const windDir = simulateWindDirection();
  const loc = simulateLocation(windSpeed, windDir);

  return {
    altitude: altitudeM,
    temperature: isaTemperature(altitudeM),
    pressure: isaPressure(altitudeM),
    humidity: simulateHumidity(altitudeM),
    windSpeed: windSpeed,
    windDirection: windDir,
    latitude: loc.lat,
    longitude: loc.lng,
    recordedAt: new Date(),
    source: 'simulated',
  };
}

export class SimulatorDataSource {
  constructor() {
    this._intervalId = null;
    // Altitude cycles from 0 to 30,000 m in 500 m steps
    this._altitude = 0;
    this._altitudeStep = 500;
    this._maxAltitude = 30000;
  }

  getSourceName() {
    return 'simulator';
  }

  /**
   * Starts generating observations on the configured interval.
   * @param {string} sessionId
   * @param {function(object): void} onObservation
   * @param {function(Error): void} onError
   */
  start(sessionId, onObservation, onError) {
    if (this._intervalId) {
      logger.warn('SimulatorDataSource.start() called while already running');
      return;
    }

    logger.info(
      { sessionId, interval: env.simulatorIntervalMs },
      'Simulator started'
    );

    this._intervalId = setInterval(() => {
      try {
        const observation = generateObservation(this._altitude);
        this._altitude =
          (this._altitude + this._altitudeStep) %
          (this._maxAltitude + this._altitudeStep);
        onObservation(observation);
      } catch (err) {
        logger.error({ err }, 'Simulator generation error');
        onError(err);
      }
    }, env.simulatorIntervalMs);
  }

  stop() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
      this._altitude = 0;
      _lat = 37.7749;
      _lng = -122.4194;
      logger.info('Simulator stopped');
    }
  }
}

