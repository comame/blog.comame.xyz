cd /
cp /files/package.json /package.json
cp /files/package-lock.json /package-lock.json

npm ci

service nginx start

ALL=1 node /files/build
