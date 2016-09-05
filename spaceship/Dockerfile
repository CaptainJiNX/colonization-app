FROM mhart/alpine-node:6.5.0
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
ARG node_env=production
ENV NODE_ENV=$node_env
RUN npm install

COPY . /app

EXPOSE 80
CMD ["node", "."]
