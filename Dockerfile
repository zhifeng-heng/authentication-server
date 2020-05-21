# Steps to build Docker image and run it on a remote server without using Docker Hub
# Below steps is using SG DEMO (VPN connection required) as an example
#
# 1. docker-compose build --no-cache
# 2. docker save -o ~/Desktop/authentication-server.tar authentication-server
# 3. sudo scp -i "HB_DEMO.pem" -r /Users/zhifeng/Desktop/authentication-server.tar ubuntu@192.10.30.175:.
# 4. docker load -i authentication-server.tar (remote server)
# 5. docker-compose up

FROM node:8.9.4

# Enable apt-get to run from the new sources.
RUN printf "deb http://archive.debian.org/debian/ \
    jessie main\ndeb-src http://archive.debian.org/debian/ \
    jessie main\ndeb http://security.debian.org \
    jessie/updates main\ndeb-src http://security.debian.org \
    jessie/updates main" > /etc/apt/sources.list

# Update everything on the box
# RUN apt-get -y update
# RUN apt-get clean

# Set the working directory
WORKDIR /srv/src

# Copy our package.json & install our dependencies
COPY package.json /srv/src/package.json
RUN npm install

# Copy the remaining application code
COPY . /srv/src

# Start the app
CMD npm run start
