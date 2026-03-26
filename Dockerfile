FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_SIGNALR_BASE_URL
ARG VITE_GRAPHQL_PATH
ARG VITE_GRAPHQL_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SIGNALR_BASE_URL=$VITE_SIGNALR_BASE_URL
ENV VITE_GRAPHQL_PATH=$VITE_GRAPHQL_PATH
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL

RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
