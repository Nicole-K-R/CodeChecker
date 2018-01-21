# specify the node base image with your desired version node:<version>
FROM node:carbon

# Install Python.
RUN \
  apt-get update && \
  apt-get install -y python python-dev python-pip python-virtualenv && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Set mongodb password env variable inside container

# Install Python packages
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 7000
CMD [ "node", "app.js" ]


