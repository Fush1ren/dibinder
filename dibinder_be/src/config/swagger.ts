import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "DiBinder API",
    version: "1.0.0",
    description: "DiBinder API Documentation",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server",
    },
  ],
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"], // arahkan ke file TS
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
