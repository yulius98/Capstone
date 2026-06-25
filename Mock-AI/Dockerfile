FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN mkdir -p mock-uploads

EXPOSE 8000

CMD ["node", "mock-ai-server.js"]
