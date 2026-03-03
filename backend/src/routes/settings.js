const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const settings = db.collection('settings');

    // GET /api/settings
    router.get('/', async (req, res) => {
        try {
            const data = await settings.findOne({ _id: 'main' });
            res.json(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            res.status(500).json({ error: 'Failed to fetch settings' });
        }
    });

    // PUT /api/settings
    router.put('/', async (req, res) => {
        try {
            const { theme } = req.body;

            const updates = {};

            if (theme !== undefined) {
                if (!['dark', 'light'].includes(theme)) {
                    return res.status(400).json({ error: 'Theme must be dark or light' });
                }
                updates.theme = theme;
            }

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'No valid fields to update' });
            }

            updates.updated_at = new Date();

            await settings.updateOne(
                { _id: 'main' },
                { $set: updates }
            );

            const data = await settings.findOne({ _id: 'main' });
            res.json(data);
        } catch (error) {
            console.error('Error updating settings:', error);
            res.status(500).json({ error: 'Failed to update settings' });
        }
    });

    return router;
};
