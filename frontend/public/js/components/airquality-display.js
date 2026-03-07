// Air quality display component
import { wsClient } from '../api.js';

export class AirQualityDisplay {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = {
            tempInC: null,
            tempInF: null,
            humidity: null,
            tvoc: null,
            eco2: null
        };
        this.wsHandler = null;
        this.unsubStale = null;
    }

    render() {
        const tempDisplay = this.data.tempInF != null ? Math.round(this.data.tempInF) : '-';
        const humidityDisplay = this.data.humidity != null ? Math.round(this.data.humidity) : '-';
        const tvocDisplay = this.data.tvoc != null ? Math.round(this.data.tvoc) : '-';
        const co2Display = this.data.eco2 != null ? Math.round(this.data.eco2) : '-';
        return `
            <div class="airquality-container">
                <!-- Temperature -->
                <div class="card airquality-card">
                    <svg class="airquality-icon temp" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                    </svg>
                    <div class="airquality-info">
                        <span class="airquality-value" id="temp-value">${tempDisplay}<span class="airquality-unit">°F</span></span>
                        <span class="airquality-label">Temperature</span>
                    </div>
                </div>

                <!-- Humidity -->
                <div class="card airquality-card">
                    <svg class="airquality-icon humidity" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                    <div class="airquality-info">
                        <span class="airquality-value" id="humidity-value">${humidityDisplay}<span class="airquality-unit">%</span></span>
                        <span class="airquality-label">Humidity</span>
                    </div>
                </div>

                <!-- TVOC -->
                <div class="card airquality-card ${this.getTvocClass()}">
                    <svg class="airquality-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
                    </svg>
                    <div class="airquality-info">
                        <span class="airquality-value" id="tvoc-value">${tvocDisplay}<span class="airquality-unit">ppb</span></span>
                        <span class="airquality-label">TVOC</span>
                        <span class="airquality-badge ${this.getTvocClass()}" id="tvoc-badge" ${this.data.tvoc == null ? 'style="display:none"' : ''}>${this.getTvocLabel()}</span>
                    </div>
                </div>

                <!-- eCO2 -->
                <div class="card airquality-card ${this.getCo2Class()}">
                    <svg class="airquality-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                    </svg>
                    <div class="airquality-info">
                        <span class="airquality-value" id="co2-value">${co2Display}<span class="airquality-unit">ppm</span></span>
                        <span class="airquality-label">eCO₂</span>
                        <span class="airquality-badge ${this.getCo2Class()}" id="co2-badge" ${this.data.eco2 == null ? 'style="display:none"' : ''}>${this.getCo2Label()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getTvocClass() {
        const tvoc = this.data.tvoc;
        if (tvoc == null) return '';
        if (tvoc < 65) return 'good';
        if (tvoc < 220) return 'moderate';
        if (tvoc < 660) return 'sensitive';
        return 'unhealthy';
    }

    getTvocLabel() {
        const tvoc = this.data.tvoc;
        if (tvoc == null) return '';
        if (tvoc < 65) return 'Excellent';
        if (tvoc < 220) return 'Good';
        if (tvoc < 660) return 'Moderate';
        if (tvoc < 2200) return 'Poor';
        return 'Unhealthy';
    }

    getCo2Class() {
        const co2 = this.data.eco2;
        if (co2 == null) return '';
        if (co2 < 1000) return 'good';
        if (co2 < 2000) return 'moderate';
        return 'unhealthy';
    }

    getCo2Label() {
        const co2 = this.data.eco2;
        if (co2 == null) return '';
        if (co2 < 1000) return 'Normal';
        if (co2 < 2000) return 'High';
        return 'Unhealthy';
    }

    init(data) {
        if (data) this.data = { ...this.data, ...data };
        this.updateDisplay();

        this.wsHandler = (incoming) => {
            Object.assign(this.data, incoming);
            this.updateDisplay();
        };
        wsClient.on('temphumid', this.wsHandler);

        this.unsubStale = wsClient.onStale('temphumid', () => {
            this.data = { tempInC: null, tempInF: null, humidity: null, tvoc: null, eco2: null };
            this.updateDisplay();
        });
    }

    updateDisplay() {
        const tempValue = document.getElementById('temp-value');
        const humidityValue = document.getElementById('humidity-value');
        const tvocValue = document.getElementById('tvoc-value');
        const tvocBadge = document.getElementById('tvoc-badge');
        const co2Value = document.getElementById('co2-value');
        const co2Badge = document.getElementById('co2-badge');

        if (tempValue) {
            tempValue.innerHTML = this.data.tempInF != null
                ? `${Math.round(this.data.tempInF)}<span class="airquality-unit">°F</span>`
                : `-<span class="airquality-unit">°F</span>`;
        }

        if (humidityValue) {
            humidityValue.innerHTML = this.data.humidity != null
                ? `${Math.round(this.data.humidity)}<span class="airquality-unit">%</span>`
                : `-<span class="airquality-unit">%</span>`;
        }

        if (tvocValue) {
            tvocValue.innerHTML = this.data.tvoc != null
                ? `${Math.round(this.data.tvoc)}<span class="airquality-unit">ppb</span>`
                : `-<span class="airquality-unit">ppb</span>`;
        }
        if (tvocBadge) {
            tvocBadge.textContent = this.getTvocLabel();
            tvocBadge.className = `airquality-badge ${this.getTvocClass()}`;
            tvocBadge.style.display = this.data.tvoc != null ? '' : 'none';
        }

        if (co2Value) {
            co2Value.innerHTML = this.data.eco2 != null
                ? `${Math.round(this.data.eco2)}<span class="airquality-unit">ppm</span>`
                : `-<span class="airquality-unit">ppm</span>`;
        }
        if (co2Badge) {
            co2Badge.textContent = this.getCo2Label();
            co2Badge.className = `airquality-badge ${this.getCo2Class()}`;
            co2Badge.style.display = this.data.eco2 != null ? '' : 'none';
        }

        // Update card classes for TVOC
        const tvocCard = tvocValue?.closest('.airquality-card');
        if (tvocCard) {
            tvocCard.className = `card airquality-card ${this.getTvocClass()}`;
        }

        // Update card classes for CO2
        const co2Card = co2Value?.closest('.airquality-card');
        if (co2Card) {
            co2Card.className = `card airquality-card ${this.getCo2Class()}`;
        }
    }

    cleanup() {
        if (this.wsHandler) {
            wsClient.off('temphumid', this.wsHandler);
        }
        if (this.unsubStale) this.unsubStale();
    }
}
