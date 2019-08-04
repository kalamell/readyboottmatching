FROM node:10-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

WORKDIR /home/node/app

COPY package*.json ./

USER node


RUN npm install
RUN npm install -g pm2

COPY --chown=node:node . .

EXPOSE 8080
CMD ["node", "app.js"]
