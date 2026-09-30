// src/modules/observations/observation.service.js
import XLSX from 'xlsx';
import { Observation } from '../models/observation.model.js';
import { ApiError } from '../utils/ApiError.js';
import { createAuditLog } from './auditLog.service.js';
import { AUDIT_ACTIONS } from '../models/auditLog.model.js';


const EXPORT_LIMIT = 10_000;

/**
 * Builds a MongoDB filter object from query parameters.
 */
function buildFilter({ startDate, endDate, minAltitude, maxAltitude, source, isDeleted = false }) {
  const filter = { isDeleted };

  if (startDate || endDate) {
    filter.recordedAt = {};
    if (startDate) filter.recordedAt.$gte = startDate;
    if (endDate) filter.recordedAt.$lte = endDate;
  }

  if (minAltitude !== undefined || maxAltitude !== undefined) {
    filter.altitude = {};
    if (minAltitude !== undefined) filter.altitude.$gte = minAltitude;
    if (maxAltitude !== undefined) filter.altitude.$lte = maxAltitude;
  }

  if (source) filter.source = source;

  return filter;
}

export async function listObservations({ page, limit, startDate, endDate, minAltitude, maxAltitude, source, sortBy, sortOrder, isDeleted = false }) {
  const filter = buildFilter({ startDate, endDate, minAltitude, maxAltitude, source, isDeleted: false });
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  const skip = (page - 1) * limit;

  const [observations, total] = await Promise.all([
    Observation.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Observation.countDocuments(filter),
  ]);

  return { observations, total };
}

export async function getObservationById(id) {
  const observation = await Observation.findById(id).lean();
  if (!observation) throw ApiError.notFound('Observation not found');
  return observation;
}

export async function createObservation(data, userId) {
  const observation = await Observation.create({ ...data, createdBy: userId });

  await createAuditLog({
    userId,
    action: AUDIT_ACTIONS.OBSERVATION_CREATED,
    resource: 'observations',
    resourceId: observation._id.toString(),
    metadata: { source: data.source, altitude: data.altitude },
  });

  return observation.toJSON();
}

export async function updateObservation(id, updates, userId) {
  const observation = await Observation.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!observation) throw ApiError.notFound('Observation not found');

  await createAuditLog({
    userId,
    action: AUDIT_ACTIONS.OBSERVATION_UPDATED,
    resource: 'observations',
    resourceId: id,
    metadata: updates,
  });

  return observation.toJSON();
}

export async function deleteObservation(id, userId) {
  const observation = await Observation.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true });
  if (!observation) throw ApiError.notFound('Observation not found');
  await createAuditLog({ userId, action: AUDIT_ACTIONS.OBSERVATION_DELETED, resource: 'observations', resourceId: id });
}

export async function restoreObservation(id, userId) {
  const observation = await Observation.findByIdAndUpdate(id, { isDeleted: false, deletedAt: null }, { new: true });
  if (!observation) throw ApiError.notFound('Observation not found');
  await createAuditLog({ userId, action: 'OBSERVATION_RESTORED', resource: 'observations', resourceId: id });
}

export async function deleteObservationsByFilter(filterParams, userId) {
  const filter = buildFilter({ ...filterParams, isDeleted: false });
  const result = await Observation.updateMany(filter, { isDeleted: true, deletedAt: new Date() });
  await createAuditLog({ userId, action: AUDIT_ACTIONS.OBSERVATION_DELETED, resource: 'observations', metadata: { filter: filterParams, count: result.modifiedCount } });
  return result.modifiedCount;
}

/**
 * Streams observations as CSV to the response object.
 * Enforces a hard cap of EXPORT_LIMIT records regardless of filters.
 */
export async function exportObservationsCsv({ startDate, endDate, minAltitude, maxAltitude, source }, res) {
  const filter = buildFilter({ startDate, endDate, minAltitude, maxAltitude, source, isDeleted: false });

  const CSV_HEADER = 'id,altitude,temperature,pressure,humidity,windSpeed,windDirection,recordedAt,source,sessionId\n';

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="observations.csv"');
  res.write(CSV_HEADER);

  const cursor = Observation.find(filter)
    .sort({ recordedAt: -1 })
    .limit(EXPORT_LIMIT)
    .lean()
    .cursor();

  for await (const doc of cursor) {
    const row = [
      doc._id,
      doc.altitude,
      doc.temperature,
      doc.pressure,
      doc.humidity,
      doc.windSpeed,
      doc.windDirection,
      doc.recordedAt.toISOString(),
      doc.source,
      doc.sessionId ?? '',
    ].join(',');
    res.write(row + '\n');
  }

  res.end();
}

/**
 * Exports observations as Excel (.xlsx) file.
 */
export async function exportObservationsExcel({ startDate, endDate, minAltitude, maxAltitude, source }, res) {
  const filter = buildFilter({ startDate, endDate, minAltitude, maxAltitude, source, isDeleted: false });

  const observations = await Observation.find(filter)
    .sort({ recordedAt: -1 })
    .limit(EXPORT_LIMIT)
    .lean();

  const data = observations.map((doc) => ({
    'ID': doc._id.toString(),
    'Altitude (m)': doc.altitude,
    'Temperature (Â°C)': doc.temperature,
    'Pressure (hPa)': doc.pressure,
    'Humidity (%)': doc.humidity,
    'Wind Speed (m/s)': doc.windSpeed,
    'Wind Direction (Â°)': doc.windDirection,
    'Recorded At': doc.recordedAt.toISOString(),
    'Source': doc.source,
    'Session ID': doc.sessionId ?? '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Observations');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="observations.xlsx"');
  res.send(excelBuffer);
}

export async function deleteAllObservations(userId) {
  await Observation.updateMany({ isDeleted: false }, { isDeleted: true, deletedAt: new Date() });
  await createAuditLog({
    userId,
    action: AUDIT_ACTIONS.OBSERVATION_DELETED,
    resource: 'observations',
    metadata: { deletedAll: true },
  });
}





