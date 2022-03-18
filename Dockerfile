# syntax=docker/dockerfile:1

FROM node:14-alpine

ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./


RUN npm install
RUN npm install -g @nestjs/cli


COPY . .
CMD ["npm", "start"]
