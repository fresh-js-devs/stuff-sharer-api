const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes');

const app = express();

// Body parser
app.use(bodyParser.json());

// Cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Error Handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  req.status(status).json({ message, data });
});

// Routes
app.use('/', routes);

// Connection
mongoose
  .connect(
    'mongodb+srv://root:1026Orlova@nodeapp-cuhlh.mongodb.net/stuff-sharer?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => app.listen(4000))
  .catch(err => console.log(err));
