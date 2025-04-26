FROM node:20

WORKDIR /app

# COPY .env .env
# COPY bucket-credential-candra.json ./
COPY package*.json .

RUN npm install

COPY . .

COPY .env .env
COPY bucket-credential-candra.json .

WORKDIR /app/src/infrastructure/data/prisma
RUN npx prisma generate

WORKDIR /app

RUN npm run build

EXPOSE 443

CMD ["npm", "run", "start:prod"]