const express = require('express');

const requestRouter = express.Router();

requestRouter.get('/requests', async (req, res) => {
  // Retrieve all requests from the database
});