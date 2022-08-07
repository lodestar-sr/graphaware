FROM node:12

WORKDIR /

RUN mkdir -p /public

COPY serve-static.js /index.ts
RUN npm install express express-history-api-fallback

COPY build /public

ENTRYPOINT ["node", "."]