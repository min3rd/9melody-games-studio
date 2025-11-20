FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies first (cache)
COPY web/package.json web/package-lock.json* ./
RUN npm ci --production=false

# Copy source
COPY web/ .

# Expose default next dev port
EXPOSE 3000
ENV NODE_ENV=development

# Default command for development
CMD ["npm", "run", "dev"]
