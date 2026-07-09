# Build stage
FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://localhost:5000
ARG VITE_TENANT_SLUG=apex-tower
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TENANT_SLUG=$VITE_TENANT_SLUG

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
