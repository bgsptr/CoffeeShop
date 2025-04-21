FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

WORKDIR /app/src/infrastructure/data/prisma
RUN npx prisma generate
WORKDIR /app

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]