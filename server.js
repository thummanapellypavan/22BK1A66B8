const express = require('express');
const app = express();

app.use(express.json());

// Incident storage
let incidents = [];
let nextId = 1;

// Root
app.get('/', (req, res) => {
  res.send('Hello over HTTP!');
});

// List all incidents
app.get('/api/incidents', (req, res) => {
  res.json(incidents);
});

// Create new incident
app.post('/api/incidents', (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  let category = 'General Inquiry';
  let priority = 'Low';
  const descLower = description.toLowerCase();

  if (descLower.includes('password') || descLower.includes('login') || descLower.includes('account')) {
    category = 'Account Issue';
    priority = 'High';
  } else if (descLower.includes('network') || descLower.includes('slow') || descLower.includes('wifi')) {
    category = 'Network';
    priority = 'Medium';
  } else if (descLower.includes('printer') || descLower.includes('hardware')) {
    category = 'Hardware';
    priority = 'Medium';
  }

  const newIncident = {
    id: nextId++,
    description,
    category,
    priority,
    createdAt: new Date().toISOString()
  };

  incidents.push(newIncident);
  res.status(201).json(newIncident);
});

// Generate category report
app.get('/api/report', (req, res) => {
  const report = {};
  for (const incident of incidents) {
    report[incident.category] = (report[incident.category] || 0) + 1;
  }
  res.json(report);
});

// Start HTTP server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`HTTP Server running on http://localhost:${PORT}`);
});
