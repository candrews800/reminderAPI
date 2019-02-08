#!/bin/bash

# REMINDER NPM INSTALL
cd $BASE_PATH/reminder
npm install

envsubst < config/config.json.in > config/config.json

# Symbolic link /seeder to reminder/seeds
ln -s $BASE_PATH/seeder $BASE_PATH/reminder/seeds