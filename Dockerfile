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
FROM node:11  

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
COPY --from=UI-BUILD /build/dashboard/dist ./dashboard/dist
COPY server/package*.json ./server/
COPY server/*.js ./server/
COPY server/*.html ./server/
RUN cd server && npm install

EXPOSE 8080 8081 6454 6455
