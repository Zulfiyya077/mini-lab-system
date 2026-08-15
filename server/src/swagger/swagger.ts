import swaggerJsdoc from "swagger-jsdoc";


const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Mini Lab System API",
      version: "1.0.0",
      description: "Laboratory Management System API",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    components: {
      securitySchemes: {
        accessToken: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
  },

  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);