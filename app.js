const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
// const https = require('https');

const routes = require('./routes');

const MONGDB_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@nodeapp-cuhlh.mongodb.net/${process.env.MONGODB_DEFAULT_DB}?retryWrites=true&w=majority`;

const app = express();

// Body parser
app.use(bodyParser.json());

// SSL/TSL
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

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

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' },
);

// Routes
app.use('/', routes);

// Security
app.use(helmet());

// Compression of assets
app.use(compression());

// Request logging
app.use(morgan('combined', { stream: accessLogStream }));

// Connection
mongoose
  .connect(MONGDB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    app.listen(process.env.PORT || 5555),
  )
  .catch(err => console.log(err));
