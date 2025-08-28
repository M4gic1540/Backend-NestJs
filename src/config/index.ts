export const databaseConfig = {
  url: process.env.DATABASE_URL,
  logging: process.env.NODE_ENV === 'development',
};

export const appConfig = {
  port: parseInt(process.env.PORT, 10) || 3001,
  serviceName: process.env.SERVICE_NAME || 'user-service',
  environment: process.env.NODE_ENV || 'development',
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
};
