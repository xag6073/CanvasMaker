const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/save', (req, res) => {
  let data = req.body; // The data sent from the client

  // Save the data in the database
  database.save(data, (err) => {
    if (err) {
      res.status(500).send('Error saving data');
    } else {
      res.send('Data saved successfully');
    }
  });
});

app.listen(3000, () => console.log('Server listening on port 3000'));