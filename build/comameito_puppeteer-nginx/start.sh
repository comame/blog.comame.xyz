#!/usr/bin/env sh

service nginx start

if [ "$1" = "serve" ]; then
    read -p "Press any key to terminate: " tmp
    exit 0
fi

cd /
cp /files/package.json /package.json
cp /files/package-lock.json /package-lock.json

npm ci

ALL=1 node /files/build
