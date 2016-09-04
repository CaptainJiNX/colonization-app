FROM mhart/alpine-node:6.5.0
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . /app

EXPOSE 80
CMD ["node", "."]
