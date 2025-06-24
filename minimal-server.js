const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the root project directory or specify the folder name
app.use(express.static(path.join(__dirname)));

// Fallback route to serve index.html for root access
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Optional: explicit route for dashboard.html
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Optional: explicit route for sign_in and sign_up html files if needed
app.get('/sign_in/:file', (req, res) => {
  const fileName = req.params.file;
  res.sendFile(path.join(__dirname, 'sign_in', fileName));
});

app.get('/sign_up/:file', (req, res) => {
  const fileName = req.params.file;
  res.sendFile(path.join(__dirname, 'sign_up', fileName));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

