// Curated SVG icon set for PDM channel configuration
// Font Awesome-inspired clean path designs, viewBox="0 0 24 24"
// pointer-events:none ensures clicks pass through to parent button

export const PDM_ICONS = {
    'lightbulb': {
        label: 'Light Bulb',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <path d="M9 21h6"/>
            <path d="M9 18h6"/>
            <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>
        </svg>`
    },
    'ceiling-light': {
        label: 'Ceiling Light',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <path d="M12 2v3"/>
            <path d="M5 9h14l-2 8H7L5 9z"/>
            <path d="M9 20h6"/>
        </svg>`
    },
    'exterior-light': {
        label: 'Exterior Light',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <path d="M4 2h4v6l2 3v2H4V2z"/>
            <path d="M12 7h3"/>
            <path d="M13 4h3"/>
            <path d="M12 10h2"/>
            <path d="M6 17v4"/>
        </svg>`
    },
    'strip-light': {
        label: 'LED Strip',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <rect x="1" y="9" width="22" height="6" rx="3"/>
            <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none"/>
            <circle cx="10" cy="12" r="1.2" fill="currentColor" stroke="none"/>
            <circle cx="14" cy="12" r="1.2" fill="currentColor" stroke="none"/>
            <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none"/>
        </svg>`
    },
    'water-pump': {
        label: 'Water Pump',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <path d="M12 22V16"/>
            <path d="M8 22h8"/>
            <circle cx="12" cy="10" r="7"/>
            <path d="M12 6v4h3" fill="none"/>
        </svg>`
    },
    'fan': {
        label: 'Fan',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <circle cx="12" cy="12" r="2.5"/>
            <path d="M12 2c-1 0-2 1-2 3 0 2.5 2 4.5 2 4.5"/>
            <path d="M22 12c0-1-1-2-3-2-2.5 0-4.5 2-4.5 2"/>
            <path d="M12 22c1 0 2-1 2-3 0-2.5-2-4.5-2-4.5"/>
            <path d="M2 12c0 1 1 2 3 2 2.5 0 4.5-2 4.5-2"/>
        </svg>`
    },
    'heater': {
        label: 'Heater',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <rect x="3" y="10" width="18" height="12" rx="2"/>
            <path d="M7 10V8" fill="none"/>
            <path d="M12 10V8" fill="none"/>
            <path d="M17 10V8" fill="none"/>
            <path d="M7 3c0 1.5 1.5 1.5 1.5 3" fill="none"/>
            <path d="M12 3c0 1.5 1.5 1.5 1.5 3" fill="none"/>
            <path d="M17 3c0 1.5 1.5 1.5 1.5 3" fill="none"/>
        </svg>`
    },
    'power-outlet': {
        label: 'Power Outlet',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <path d="M9 8v3" fill="none"/>
            <path d="M15 8v3" fill="none"/>
            <path d="M9 16a3 3 0 0 0 6 0" fill="none"/>
        </svg>`
    },
    'fridge': {
        label: 'Refrigerator',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <line x1="4" y1="10" x2="20" y2="10"/>
            <line x1="16" y1="5" x2="16" y2="8"/>
            <line x1="16" y1="13" x2="16" y2="17"/>
        </svg>`
    },
    'awning': {
        label: 'Awning',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <path d="M2 4h20v2L19 12H5L2 6V4z"/>
            <path d="M5 12v8"/>
            <path d="M19 12v8"/>
        </svg>`
    },
    'step': {
        label: 'Entry Step',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <path d="M2 20h7v-5h6v-5h7v-5"/>
            <path d="M22 5v15H2"/>
        </svg>`
    },
    'lock': {
        label: 'Door Lock',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <rect x="4" y="11" width="16" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/>
        </svg>`
    },
    'antenna': {
        label: 'Antenna',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <path d="M12 12v10"/>
            <circle cx="12" cy="5" r="3"/>
            <path d="M5 2a10 10 0 0 0 0 6" fill="none"/>
            <path d="M19 2a10 10 0 0 1 0 6" fill="none"/>
            <path d="M8 20h8"/>
        </svg>`
    },
    'speaker': {
        label: 'Speaker',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none"/>
        </svg>`
    },
    'generic': {
        label: 'Generic Device',
        svg: (filled) => `<svg class="light-icon" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>`
    }
};

// List of icons for use in config UI dropdowns
export const ICON_LIST = Object.entries(PDM_ICONS).map(([key, val]) => ({
    key,
    label: val.label
}));

/**
 * Get the SVG markup for an icon
 * @param {string} iconKey - Icon key from PDM_ICONS
 * @param {boolean} filled - Whether to show the filled (on) version
 * @returns {string} SVG markup string
 */
export function getIconSvg(iconKey, filled = false) {
    const icon = PDM_ICONS[iconKey] || PDM_ICONS['lightbulb'];
    return icon.svg(filled);
}
