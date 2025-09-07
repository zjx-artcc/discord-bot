ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm i -g pnpm

RUN pnpm i

RUN pnpm build

# Deploy commands
RUN pnpm dc 

USER node

CMD ["node", "./build/index.js"]