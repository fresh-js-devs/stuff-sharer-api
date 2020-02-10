const express = require('express');

const categoryRoutes = require('./category');
const stuffRoutes = require('./stuff');
const userRoutes = require('./user');
const swaggerRoutes = require('./swagger');

let router = express.Router();

// Routes
router.use('/categories', categoryRoutes);
router.use('/stuff', stuffRoutes);
router.use('/users', userRoutes);
router.use(swaggerRoutes);

module.exports = router;
