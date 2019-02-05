#!/bin/bash

# API NPM INSTALL
cd /opt/important_date_reminders/api
npm install

source ../app.conf

envsubst < config/config.json.in > config/config.json