#!/bin/bash

# API NPM INSTALL
cd $BASE_PATH/api
npm install

envsubst < config/config.json.in > config/config.json

# Symbolic link /seeder to api/seeds
ln -s $BASE_PATH/seeder $BASE_PATH/api/seeds