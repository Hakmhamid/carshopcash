const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Example data structure for tables
let tables = [
    { id: 1, inUse: false, startTime: null, totalCharge: 0 },
    { id: 2, inUse: false, startTime: null, totalCharge: 0 },
    { id: 3, inUse: false, startTime: null, totalCharge: 0 },
    { id: 4, inUse: false, startTime: null, totalCharge: 0 },
    { id: 5, inUse: false, startTime: null, totalCharge: 0 },
    { id: 6, inUse: false, startTime: null, totalCharge: 0 },
    { id: 7, inUse: false, startTime: null, totalCharge: 0 },
    { id: 8, inUse: false, startTime: null, totalCharge: 0 },
    { id: 9, inUse: false, startTime: null, totalCharge: 0 },
    { id: 10, inUse: false, startTime: null, totalCharge: 0 },
    { id: 11, inUse: false, startTime: null, totalCharge: 0 },
    { id: 12, inUse: false, startTime: null, totalCharge: 0 },
    { id: 13, inUse: false, startTime: null, totalCharge: 0 },
    { id: 14, inUse: false, startTime: null, totalCharge: 0 },
    { id: 15, inUse: false, startTime: null, totalCharge: 0 },
];

const pricePerHour = 3;

// Get all tables
app.get('/api/tables', (req, res) => {
    res.json(tables);
});

// Start table session
app.post('/api/tables/:id/start', (req, res) => {
    const tableId = parseInt(req.params.id);
    const table = tables.find(t => t.id === tableId);
    if (table && !table.inUse) {
        table.inUse = true;
        table.startTime = Date.now();
        res.json({ message: 'Session started', table });
    } else {
        res.status(400).json({ message: 'Table is already in use or not found' });
    }
});

// End table session and calculate charge
app.post('/api/tables/:id/end', (req, res) => {
    const tableId = parseInt(req.params.id);
    const table = tables.find(t => t.id === tableId);
    if (table && table.inUse) {
        const currentTime = Date.now();
        const timePlayed = (currentTime - table.startTime) / (1000 * 60 * 60); // Time in hours
        table.totalCharge = timePlayed * pricePerHour;
        table.inUse = false;
        table.startTime = null;
        res.json({ message: 'Session ended', totalCharge: table.totalCharge });
    } else {
        res.status(400).json({ message: 'Table is not in use or not found' });
    }
});

// Reset total charge (if needed)
app.post('/api/tables/:id/reset', (req, res) => {
    const tableId = parseInt(req.params.id);
    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.totalCharge = 0;  // Reset total charge
        res.json({ message: 'Charge reset', table });
    } else {
        res.status(400).json({ message: 'Table not found' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
