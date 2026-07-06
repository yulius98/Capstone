FROM node:22-alpine
RUN apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY mock-ai-server.js .
RUN mkdir -p mock-uploads && chown -R node:node mock-uploads
USER node
EXPOSE 8000
CMD ["node", "mock-ai-server.js"]
