# ---- Dependencies ----
    FROM node:18-alpine AS deps
    WORKDIR /app
    COPY package.json package-lock.json ./
    RUN npm install
    
    # ---- Build ----
    FROM node:18-alpine AS builder
    WORKDIR /app
    
    # Build-time environment variables
    ARG OPENAI_API_KEY
    ARG DATABASE_URL
    ARG NEXTAUTH_SECRET
    ARG AUTH0_CLIENT_ID
    ARG AUTH0_CLIENT_SECRET
    ARG AUTH0_ISSUER
    ARG AWS_REGION
    ARG AWS_S3_BUCKET
    ARG AWS_ACCESS_KEY_ID
    ARG AWS_SECRET_ACCESS_KEY
    ARG RESEND_API_KEY
    ARG ULTRAVOX_API_KEY
    
    ENV OPENAI_API_KEY=$OPENAI_API_KEY
    ENV DATABASE_URL=$DATABASE_URL
    ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
    ENV AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
    ENV AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET
    ENV AUTH0_ISSUER=$AUTH0_ISSUER
    ENV AWS_REGION=$AWS_REGION
    ENV AWS_S3_BUCKET=$AWS_S3_BUCKET
    ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
    ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
    ENV RESEND_API_KEY=$RESEND_API_KEY
    ENV ULTRAVOX_API_KEY=$ULTRAVOX_API_KEY
    
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    RUN npx prisma generate
    RUN npm run build
    
    # ---- Production ----
    FROM node:18-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    
    EXPOSE 3000
    CMD ["npm", "start"]
    