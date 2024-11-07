FROM node:20.18.0-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27.1-alpine
WORKDIR /app/build
COPY --from=builder /app/dist .
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx_conf /etc/nginx/conf.d/
COPY ./letsencrypt /etc/letsencrypt
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]


