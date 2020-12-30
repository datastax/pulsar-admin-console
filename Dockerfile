FROM node:11 as UI-BUILD

WORKDIR /build

COPY ./dashboard/ .

# make sure node_modules is not copye although it should be skipped by .dockerignore
RUN rm -rf node_modules
RUN npm install
RUN npm install -g @vue/cli
RUN npm run build-standalone

#
# build node app in the next stage
# 
FROM node:11.15-alpine  

LABEL maintainer="ming luo"

# Enable header rewrites in apache
WORKDIR /root/

#RUN rm -rf /var/lib/apt/lists/* && \
#    apt-get update && apt-get install -y \
#    nodejs \
#    npm \
#    && rm -rf /var/lib/apt/lists/*
RUN mkdir -p dashboard/dist
RUN mkdir server
RUN ls
COPY --from=UI-BUILD /build/dist /root/dashboard/dist
COPY --from=UI-BUILD /build/dist/index.html /root/dashboard/dist/index.html.template
RUN pwd
COPY server/package*.json /root/server/
COPY server/*.js /root/server/
COPY server/*.html /root/server/
RUN cd server && npm install

WORKDIR /root/server

EXPOSE 8080 8081 6454 6455

CMD [ "npm", "start" ]
