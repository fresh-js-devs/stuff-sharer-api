const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  apis: ['./routes/category.js', './routes/stuff.js', './routes/user.js'],
  basePath: '/',
  swaggerDefinition: {
    info: {
      description: 'Stuff Sharer API Documentation',
      swagger: '2.0',
      title: 'Stuff Sharer API Documentation',
      version: '1.0.0',
    },
  },
};
const specs = swaggerJsdoc(options);

module.exports = specs;
