#!/bin/bash

# REMINDER NPM INSTALL
cd $BASE_PATH/reminder
npm install

envsubst < config/config.json.in > config/config.json