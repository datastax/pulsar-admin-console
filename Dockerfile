FROM node:11 as UI-BUILD

WORKDIR /build

COPY ./dashboard/ .

# npm update caniuse-lite browserslist
RUN npm install
RUN npm install -g @vue/cli
RUN npm run build

#
# build node app in the next stage
# 
FROM node:11.15-alpine  

LABEL maintainer="ming.luo@kafkaesque.io"

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
COPY /root/dashboard/dist/index.html /root/dashboard/dist/index.html.template
RUN pwd
COPY server/package*.json /root/server/
COPY server/*.js /root/server/
COPY server/*.html /root/server/
RUN cd server && npm install

EXPOSE 8080 8081 6454 6455
