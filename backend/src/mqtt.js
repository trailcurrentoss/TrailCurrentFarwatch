const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');
const tls = require('tls');

// MQTT Topic Path Constants
const MQTT_ROOT = 'rv';
const MQTT_LIGHTS = 'lights';
const MQTT_THERMOSTAT = 'thermostat';
const MQTT_ENERGY = 'energy';
const MQTT_AIRQUALITY = 'airquality';
const MQTT_GPS = 'gps';
const MQTT_CONFIG = 'config';

// MQTT Message Types
const MSG_COMMAND = 'command';
const MSG_BRIGHTNESS = 'brightness';
const MSG_STATUS = 'status';

// MQTT Topics
const TOPICS = {
    LIGHT_COMMAND: `${MQTT_ROOT}/${MQTT_LIGHTS}/+/${MSG_COMMAND}`,  // + is wildcard for light ID
    LIGHT_STATUS: `${MQTT_ROOT}/${MQTT_LIGHTS}/+/${MSG_STATUS}`,
    THERMOSTAT_COMMAND: `${MQTT_ROOT}/${MQTT_THERMOSTAT}/${MSG_COMMAND}`,
    THERMOSTAT_STATUS: `${MQTT_ROOT}/${MQTT_THERMOSTAT}/${MSG_STATUS}`,
    ENERGY_STATUS: `${MQTT_ROOT}/${MQTT_ENERGY}/${MSG_STATUS}`,
    AIRQUALITY_STATUS: `${MQTT_ROOT}/${MQTT_AIRQUALITY}/${MSG_STATUS}`,
    AIRQUALITY_TEMP_AND_HUMIDITY: `${MQTT_ROOT}/${MQTT_AIRQUALITY}/temphumid`,
    GPS_LAT_LON: `${MQTT_ROOT}/${MQTT_GPS}/latlon`,
    GPS_ALT: `${MQTT_ROOT}/${MQTT_GPS}/alt`,
    GPS_GNSS_DETAILS: `${MQTT_ROOT}/${MQTT_GPS}/details`,
    DEPLOYMENT_AVAILABLE: `${MQTT_ROOT}/deployment/available`,
    DEPLOYMENT_STATUS: `${MQTT_ROOT}/deployment/status`,
    PDM_CHANNELS_CONFIG: `${MQTT_ROOT}/${MQTT_CONFIG}/pdm_channels`
};

class MqttService {
    constructor() {
        this.client = null;
        this.db = null;
        this.broadcast = null;
        this.connected = false;
    }

    connect(db, broadcast) {
        this.db = db;
        this.broadcast = broadcast;

        const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
        const username = process.env.MQTT_USERNAME;
        const password = process.env.MQTT_PASSWORD;
        console.log(`Connecting to MQTT broker at ${brokerUrl}`);

        const options = {
            clientId: `rv-backend-${Date.now()}`,
            clean: true,
            reconnectPeriod: 5000,
            username: username,
            password: password,
        };

        // Load CA certificate for TLS connections
        const caPath = path.join('/app/certs', 'ca.pem');
        if (brokerUrl.startsWith('mqtts://') && fs.existsSync(caPath)) {
            options.ca = [fs.readFileSync(caPath), ...tls.rootCertificates];
            // Verify cert against expected hostname since internal Docker hostname differs
            const expectedHost = process.env.TLS_CERT_HOSTNAME;
            if (expectedHost) {
                options.checkServerIdentity = (_host, cert) => {
                    return tls.checkServerIdentity(expectedHost, cert);
                };
            }
            console.log('Loaded CA certificate for TLS');
        }

        this.client = mqtt.connect(brokerUrl, options);

        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
            this.connected = true;
            this.subscribeToTopics();
        });

        this.client.on('error', (error) => {
            console.error('MQTT connection error:', error);
        });

        this.client.on('close', () => {
            console.log('MQTT connection closed');
            this.connected = false;
        });

        this.client.on('message', (topic, message) => {
            this.handleMessage(topic, message);
        });

        return this;
    }

    subscribeToTopics() {
        // Subscribe to light status topics (for real light controller integration)
        this.client.subscribe(TOPICS.LIGHT_STATUS, (err) => {
            if (err) {
                console.error('Failed to subscribe to light status:', err);
            } else {
                console.log('Subscribed to light status topics');
            }
        });

        // Subscribe to energy status topic
        this.client.subscribe(TOPICS.ENERGY_STATUS, (err) => {
            if (err) {
                console.error('Failed to subscribe to energy status:', err);
            } else {
                console.log('Subscribed to energy status topic');
            }
        });

        // Subscribe to air quality status topic
        this.client.subscribe(TOPICS.AIRQUALITY_STATUS, (err) => {
            if (err) {
                console.error('Failed to subscribe to air quality status:', err);
            } else {
                console.log('Subscribed to air quality status topic');
            }
        });

        // Subscribe to air quality temp and humidity topic
        this.client.subscribe(TOPICS.AIRQUALITY_TEMP_AND_HUMIDITY, (err) => {
            if (err) {
                console.error('Failed to subscribe to air quality temp and humidity:', err);
            } else {
                console.log('Subscribed to air quality temp and humidity topic');
            }
        })

        // Subscribe to GPS lat and lon topic
        this.client.subscribe(TOPICS.GPS_LAT_LON, (err) => {
            if (err) {
                console.error('Failed to subscribe to GPS lat/lon:', err);
            } else {
                console.log('Subscribed to GPS lat/lon topic');
            }
        });

        // Subscribe to GPS altitude topic
        this.client.subscribe(TOPICS.GPS_ALT, (err) => {
            if (err) {
                console.error('Failed to subscribe to GPS altitude:', err);
            } else {
                console.log('Subscribed to GPS altitude topic');
            }
        });

        // Subscribe to GPS details topic
        this.client.subscribe(TOPICS.GPS_GNSS_DETAILS, (err) => {
            if (err) {
                console.error('Failed to subscribe to GPS details:', err);
            } else {
                console.log('Subscribed to GPS details topic');
            }
        });

        // Subscribe to thermostat status topic
        this.client.subscribe(TOPICS.THERMOSTAT_STATUS, (err) => {
            if (err) {
                console.error('Failed to subscribe to thermostat status:', err);
            } else {
                console.log('Subscribed to thermostat status topic');
            }
        });

        // Subscribe to deployment status topic
        this.client.subscribe(TOPICS.DEPLOYMENT_STATUS, (err) => {
            if (err) {
                console.error('Failed to subscribe to deployment status:', err);
            } else {
                console.log('Subscribed to deployment status topic');
            }
        });

        // Subscribe to PDM channel config topic
        this.client.subscribe(TOPICS.PDM_CHANNELS_CONFIG, (err) => {
            if (err) {
                console.error('Failed to subscribe to PDM channels config:', err);
            } else {
                console.log('Subscribed to PDM channels config topic');
            }
        });
    }

    handleMessage(topic, message) {
        try {
            const payload = JSON.parse(message.toString());

            // Parse topic to determine type
            const parts = topic.split('/');
            if (parts[0] !== MQTT_ROOT) return;

            if (parts[1] === MQTT_LIGHTS) {
                const lightId = parseInt(parts[2]);
                const messageType = parts[3];

                if (messageType === MSG_COMMAND) {
                    this.handleLightCommand(lightId, payload);
                } else if (messageType === MSG_STATUS) {
                    this.handleLightStatus(lightId, payload);
                }
            } else if (parts[1] === MQTT_ENERGY && parts[2] === MSG_STATUS) {
                this.handleEnergyStatus(payload);
            } else if (parts[1] === MQTT_AIRQUALITY && parts[2] === MSG_STATUS) {
                this.handleAirQualityStatus(payload);
            } else if (parts[1] === MQTT_AIRQUALITY && parts[2] === 'temphumid') {
                this.handleAirQualityTempAndHumdity(payload);
            } else if (parts[1] === MQTT_GPS && parts[2] === 'latlon') {
                this.handleGpsStatus(payload);
            } else if (parts[1] === MQTT_GPS && parts[2] === 'alt') {
                this.handleGpsAlt(payload);
            } else if (parts[1] === MQTT_GPS && parts[2] === 'details') {
                this.handleGpsDetails(payload);
            } else if (parts[1] === MQTT_THERMOSTAT && parts[2] === MSG_STATUS) {
                this.handleThermostatStatus(payload);
            } else if (parts[1] === 'deployment' && parts[2] === 'status') {
                this.handleDeploymentStatus(payload);
            } else if (parts[1] === MQTT_CONFIG && parts[2] === 'pdm_channels') {
                this.handlePdmChannelConfig(payload);
            }
        } catch (error) {
            console.error('Error handling MQTT message:', error);
        }
    }

    // Handle light status update from light controller
    async handleLightStatus(lightId, payload) {
        console.log(`Received light status for light ${lightId}:`, payload);

        // Broadcast light status data directly via WebSocket (no database storage needed)
        if (this.broadcast) {
            this.broadcast('light', { 
                "id": lightId, 
                "_id": lightId, 
                "state": payload.state, 
                "brightness": payload.brightness 
            });
        }
    }

    // Handle energy status update from battery monitor
    handleEnergyStatus(payload) {
        console.log('Received energy status:', payload);

        // Broadcast energy data directly via WebSocket (no database storage)
        if (this.broadcast) {
            this.broadcast('energy', {
                solar_watts: payload.solar_watts,
                battery_percent: payload.battery_percent,
                battery_voltage: payload.battery_voltage,
                charge_type: payload.charge_type,
                time_remaining_minutes: payload.time_remaining_minutes
            });
        }
    }

    async handleAirQualityTempAndHumdity(payload) {
        console.log('Received air quality temp and humidity',payload);
        this.broadcast('temphumid', payload);
    }

    // Handle air quality status update from sensor
    handleAirQualityStatus(payload) {
        console.log('Received air quality status:', payload);

        // Broadcast air quality data directly via WebSocket (no database storage)
        if (this.broadcast) {
            this.broadcast('airquality', {
                iaq_index: payload.iaq_index,
                co2_ppm: payload.co2_ppm
            });
        }
    }

    // Handle GPS lat/lon update from GPS module
    handleGpsStatus(payload) {
        console.log('Received GPS lat/lon:', payload);

        // Broadcast GPS data directly via WebSocket (no database storage needed)
        if (this.broadcast) {
            this.broadcast('latlon', {
                latitude: payload.latitude,
                longitude: payload.longitude
            });
        }
    }

    // Handle GPS altitude update from GPS module
    handleGpsAlt(payload) {
        console.log('Received GPS altitude:', payload);

        // Broadcast GPS data directly via WebSocket (no database storage needed)
        if (this.broadcast) {
            this.broadcast('alt', {
                altitudeInMeters: payload.altitudeInMeters,
                altitudeFeet: payload.altitudeFeet
            });
        }
    }

    // Handle GPS details update from GPS module
    handleGpsDetails(payload) {
        console.log('Received GPS details:', payload);

        // Broadcast GPS data directly via WebSocket (no database storage needed)
        if (this.broadcast) {
            this.broadcast('gnss_details', {
                numberOfSatellites: payload.numberOfSatellites,
                speedOverGround: payload.speedOverGround,
                courseOverGround: payload.courseOverGround,
                gnssMode: payload.gnssMode
            });
        }
    }

    // Handle PDM channel config update from in-vehicle system
    async handlePdmChannelConfig(payload) {
        console.log('Received PDM channel config:', payload);

        if (!this.db || !payload.channels || !Array.isArray(payload.channels)) return;

        const lights = this.db.collection('lights');

        try {
            // Upsert each channel into the lights collection
            const validIds = [];
            for (const ch of payload.channels) {
                if (!ch.id || !ch.name) continue;
                validIds.push(ch.id);
                await lights.updateOne(
                    { _id: ch.id },
                    { $set: {
                        name: ch.name,
                        icon: ch.icon || 'lightbulb',
                        type: ch.type || 'light',
                        updated_at: new Date()
                    }},
                    { upsert: true }
                );
            }

            // Remove orphaned lights no longer in the config
            if (validIds.length > 0) {
                await lights.deleteMany({ _id: { $nin: validIds } });
            }

            // Broadcast updated config to connected WebSocket clients
            if (this.broadcast) {
                const allLights = await lights.find().sort({ _id: 1 }).toArray();
                const result = allLights.map(l => ({ id: l._id, ...l }));
                this.broadcast('pdm_config', { lights: result });
            }
        } catch (error) {
            console.error('Error handling PDM channel config:', error);
        }
    }

    // Handle deployment status update from vehicle
    async handleDeploymentStatus(payload) {
        console.log('Received deployment status:', payload);

        const { deploymentId, status, version, progress } = payload;
        if (!deploymentId || !status) return;

        const validStatuses = ['downloading', 'downloaded', 'extracting', 'deploying', 'completed', 'failed'];
        if (!validStatuses.includes(status)) return;

        // Store in database (skip intermediate download progress to avoid flooding)
        const isProgressUpdate = status === 'downloading' && typeof progress === 'number';
        if (this.db && !isProgressUpdate) {
            try {
                await this.db.collection('deployment_statuses').insertOne({
                    deploymentId,
                    status,
                    version: version || 'unknown',
                    timestamp: new Date(payload.timestamp || Date.now()),
                    receivedAt: new Date()
                });
            } catch (error) {
                console.error('Error saving deployment status from MQTT:', error);
            }
        }

        // Broadcast to WebSocket clients (always, including progress updates)
        if (this.broadcast) {
            const wsPayload = {
                deploymentId,
                status,
                version: version || 'unknown',
                timestamp: new Date(payload.timestamp || Date.now()).toISOString()
            };
            if (typeof progress === 'number') {
                wsPayload.progress = progress;
            }
            this.broadcast('deployment_status', wsPayload);
        }
    }

    // Handle thermostat status update from HVAC controller
    handleThermostatStatus(payload) {
        console.log('Received thermostat status:', payload);

        // Broadcast thermostat data directly via WebSocket (no database storage)
        if (this.broadcast) {
            this.broadcast('thermostat', {
                target_temp: payload.target_temp,
                mode: payload.mode
            });
        }
    }

    // Publish thermostat command
    publishThermostatCommand(target_temp, mode) {
        if (!this.connected) {
            console.warn('MQTT not connected, cannot publish thermostat command');
            return false;
        }

        const topic = TOPICS.THERMOSTAT_COMMAND;
        const payload = {};
        if (target_temp !== undefined) {
            payload.target_temp = target_temp;
        }
        if (mode !== undefined) {
            payload.mode = mode;
        }

        console.log(`Publishing thermostat command to ${topic}:`, payload);
        this.client.publish(topic, JSON.stringify(payload), { qos: 1 });
        return true;
    }

    // Publish all lights on/off command (single CAN Bus command)
    publishAllLightsCommand(state) {
        if (!this.connected) {
            console.warn('MQTT not connected, cannot publish all lights command');
            return false;
        }

        const topic = `${MQTT_ROOT}/${MQTT_LIGHTS}/all/${MSG_COMMAND}`;
        const payload = { state };

        console.log(`Publishing all lights command to ${topic}:`, payload);
        this.client.publish(topic, JSON.stringify(payload), { qos: 1 });
        return true;
    }

    // Publish light command (toggle or brightness, routed to separate MQTT topics)
    publishLightCommand(lightId, state, brightness = null) {
        if (!this.connected) {
            console.warn('MQTT not connected, cannot publish light command');
            return false;
        }

        if (brightness !== null) {
            const topic = `${MQTT_ROOT}/${MQTT_LIGHTS}/${lightId}/${MSG_BRIGHTNESS}`;
            const payload = { brightness };
            console.log(`Publishing light brightness to ${topic}:`, payload);
            this.client.publish(topic, JSON.stringify(payload), { qos: 1 });
        } else {
            const topic = `${MQTT_ROOT}/${MQTT_LIGHTS}/${lightId}/${MSG_COMMAND}`;
            const payload = { state };
            console.log(`Publishing light command to ${topic}:`, payload);
            this.client.publish(topic, JSON.stringify(payload), { qos: 1 });
        }
        return true;
    }

    // Publish light status (used by simulated light controller)
    publishLightStatus(lightId, payload) {
        if (!this.connected) {
            console.warn('MQTT not connected, cannot publish light status');
            return false;
        }

        const topic = `${MQTT_ROOT}/${MQTT_LIGHTS}/${lightId}/${MSG_STATUS}`;
        console.log(`Publishing light status to ${topic}:`, payload);
        this.client.publish(topic, JSON.stringify(payload), { qos: 1 });
        return true;
    }

    // Publish deployment package available notification
    publishDeploymentAvailable(payload) {
        if (!this.connected) {
            console.warn('MQTT not connected, cannot publish deployment notification');
            return false;
        }

        const topic = TOPICS.DEPLOYMENT_AVAILABLE;
        console.log(`Publishing deployment available to ${topic}:`, payload);
        this.client.publish(topic, JSON.stringify(payload), { qos: 1, retain: true });
        return true;
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            this.connected = false;
        }
    }
}

// Singleton instance
const mqttService = new MqttService();

module.exports = mqttService;
