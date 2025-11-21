# Base image
FROM node:20-alpine AS base
WORKDIR /app

# Install deps
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --production --legacy-peer-deps || npm install --production

# Build
FROM base AS build
COPY . .
# install devDeps for building
RUN npm install --legacy-peer-deps
# Generate Prisma client for production
RUN npm run prisma:generate
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only necessary files
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src

EXPOSE 3000
CMD ["npm", "start"]
