const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Middleware to parse JSON
app.use(express.json());

// Route to fetch hydration reminders
app.get('/hydration', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City parameter is required.' });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const { temp } = response.data.main;
        const humidity = response.data.main.humidity;
        const uvIndex = Math.floor(Math.random() * 10); // Simulated UV index (replace with real API if available)

        // Hydration reminder based on weather conditions
        let reminder = '';
        if (temp > 30 && uvIndex > 6) {
            reminder = 'Drink at least 3 liters of water daily. Stay hydrated and avoid prolonged sun exposure.';
        } else if (temp < 10 && humidity > 70) {
            reminder = 'Drink warm beverages like herbal tea. Keep your skin moisturized to prevent dryness.';
        } else if (uvIndex > 4) {
            reminder = 'Apply sunscreen and drink plenty of water. Avoid direct sunlight during peak hours.';
        } else {
            reminder = 'Maintain regular hydration by drinking water every 2 hours.';
        }

        const hydrationData = {
            city: response.data.name,
            temperature: temp,
            humidity: humidity,
            uvIndex: uvIndex,
            reminder: reminder,
        };
        res.json(hydrationData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch hydration data.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});