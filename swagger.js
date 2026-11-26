import swaggerJsdoc from 'swagger-jsdoc';
import { writeFileSync } from 'node:fs';
import pkg from './package.json' with { type: 'json' };

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kizuna Rail API',
      version: pkg.version,
      description: 'API documentation for the Kizuna Rail application.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));

console.log('Swagger documentation generated successfully.');
