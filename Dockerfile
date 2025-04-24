FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

WORKDIR /app/src/infrastructure/data/prisma
RUN npx prisma generate
RUN npm install -g dotenv-cli
RUN dotenv -e .env -- npx prisma db push

WORKDIR /app

RUN npm run build

EXPOSE 443

CMD ["npm", "run", "start:prod"]