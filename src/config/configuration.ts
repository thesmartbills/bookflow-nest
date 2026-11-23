export default () => ({
  app: {
    environment: process.env.NODE_ENV,
    port: Number(process.env.PORT || 3000),
  },

  database: {
    mongodbUri: process.env.MONGODB_URI,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
});
