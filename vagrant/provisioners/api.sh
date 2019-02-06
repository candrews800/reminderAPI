#!/bin/bash

# API NPM INSTALL
cd $BASE_PATH/api
npm install

envsubst < config/config.json.in > config/config.json