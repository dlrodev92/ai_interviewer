export const APP_CONFIG = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  },
  AUTH: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    AUTH0: {
      CLIENT_ID: process.env.AUTH0_CLIENT_ID!,
      CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET!,
      ISSUER: process.env.AUTH0_ISSUER!,
    },
  },
  REDIS: {
    URL: process.env.REDIS_URL || "redis://localhost:6379",
  },
  AWS: {
    REGION: process.env.AWS_REGION!,
    BUCKET: process.env.AWS_S3_BUCKET!,
    ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID!,
    SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};
