FROM node:14 as UI-BUILD

WORKDIR /build

COPY ./dashboard/ .

# Prefer ci instead of install here
RUN npm ci
# Only need @vue/cli to run the "build-standalone" script. We don't need it in the final image.
RUN npm install -g @vue/cli
RUN npm run build-standalone
RUN chmod -R g=u /build/dist

#
# build node app in the next stage
# 
FROM node:14.18-alpine

LABEL maintainer="ming luo"

# Default to the root group for openshift compatibility.
RUN adduser -u 10001 -S appuser -G root

WORKDIR /home/appuser/
USER 10001:0

RUN mkdir -p dashboard/dist && mkdir server && mkdir config && ls
COPY --from=UI-BUILD --chown=10001:0 /build/dist /home/appuser/dashboard/dist
COPY --chown=10001:0 config/default.json /home/appuser/config/
COPY --chown=10001:0 server/package*.json /home/appuser/server/
COPY --chown=10001:0 server/*.js /home/appuser/server/
RUN cd server && npm ci --production && npm cache clean --force

WORKDIR /home/appuser/server

# OpenShift compatibility
RUN chmod g+w /home/appuser
ENV HOME /home/appuser

EXPOSE 8080 8081 6454 6455

CMD [ "npm", "start" ]
