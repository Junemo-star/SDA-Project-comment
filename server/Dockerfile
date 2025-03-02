FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["npm", "start"]

# EXPOSE $PORT
# CMD ["sh", "-c", "npx strapi start --port $PORT"]