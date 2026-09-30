// src/collectors/lanReceiver.js
import dgram from 'dgram';
import net from 'net';
import { ingestHardwareTelemetry } from '../services/collection.service.js';
import { logger } from '../utils/logger.js';

/**
 * LAN Cable Telemetry Receiver Module.
 * Listens for incoming sensor telemetry packets sent over Ethernet / LAN cable.
 */

// 1. UDP LAN Cable Listener (Default port 5001)
export function startUdpLanListener(port = 5001) {
  const socket = dgram.createSocket('udp4');

  socket.on('message', async (msg, rinfo) => {
    try {
      const dataString = msg.toString('utf8');
      logger.info({ from: `${rinfo.address}:${rinfo.port}` }, 'Received UDP telemetry frame over LAN cable');
      
      // Parse JSON payload or NMEA comma-separated telemetry
      let telemetry = {};
      if (dataString.trim().startsWith('{')) {
        telemetry = JSON.parse(dataString);
      } else {
        // NMEA format fallback: altitude,temp,press,humidity,speed,dir
        const parts = dataString.split(',');
        telemetry = {
          altitude: parseFloat(parts[0]),
          temperature: parseFloat(parts[1]),
          pressure: parseFloat(parts[2]),
          humidity: parseFloat(parts[3]),
          windSpeed: parseFloat(parts[4]),
          windDirection: parseFloat(parts[5]),
          source: 'instrument',
        };
      }

      await ingestHardwareTelemetry(telemetry);
    } catch (err) {
      logger.error({ err }, 'Failed to parse UDP telemetry packet over LAN cable');
    }
  });

  socket.bind(port, () => {
    logger.info({ port }, 'UDP LAN Cable Receiver listening for physical sensor telemetry');
  });

  return socket;
}

// 2. TCP LAN Cable Listener (Default port 5002)
export function startTcpLanListener(port = 5002) {
  const server = net.createServer((socket) => {
    logger.info({ client: socket.remoteAddress }, 'Hardware sensor connected via TCP over LAN cable');

    socket.on('data', async (chunk) => {
      try {
        const payload = JSON.parse(chunk.toString('utf8'));
        await ingestHardwareTelemetry(payload);
      } catch (err) {
        logger.error({ err }, 'Invalid TCP telemetry packet received over LAN');
      }
    });
  });

  server.listen(port, () => {
    logger.info({ port }, 'TCP LAN Cable Receiver listening for physical sensor telemetry');
  });

  return server;
}

