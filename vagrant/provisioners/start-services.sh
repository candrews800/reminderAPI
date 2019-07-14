#!/bin/bash

cd $BASE_PATH/api

npm install forever -g
NODE_PATH=. forever restart server.js