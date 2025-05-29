export const APP_CONFIG = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  AUTH: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    AUTH0: {
      CLIENT_ID: process.env.AUTH0_CLIENT_ID!,
      CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET!,
      ISSUER: process.env.AUTH0_ISSUER!,
    },
  },
  AWS: {
    REGION: process.env.AWS_REGION!,
    BUCKET: process.env.AWS_S3_BUCKET!,
    ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID!,
    SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  REDIS: {
    URL: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  DB: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  RESEND: {
    API_KEY: process.env.RESEND_API_KEY,
  },
  OPENAI: {
    API_KEY: process.env.OPENAI_API_KEY,
  },
  ULTRAVOX: {
    API_KEY: process.env.ULTRAVOX_API_KEY,
  },
};
