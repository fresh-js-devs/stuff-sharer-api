const express = require('express');
const swaggerUi = require('swagger-ui-express');

const specs = require('../docs/swagger');

const router = express.Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;
